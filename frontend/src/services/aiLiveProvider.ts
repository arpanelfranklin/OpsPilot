export type AIProvider = 'autonomous' | 'gemini' | 'groq' | 'openai' | 'custom';

export interface AISettings {
  provider: AIProvider;
  apiKey: string;
  model: string;
  customEndpoint?: string;
  temperature: number;
}

const STORAGE_KEY = 'opspilot_ai_settings';

export const DEFAULT_AI_SETTINGS: AISettings = {
  provider: 'autonomous',
  apiKey: ((import.meta as any).env?.VITE_GEMINI_API_KEY || (import.meta as any).env?.VITE_AI_API_KEY || ''),
  model: 'gemini-1.5-flash',
  temperature: 0.7,
};

export function getAISettings(): AISettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_AI_SETTINGS, ...parsed };
    }
  } catch (e) {
    console.error('Failed to parse AI settings from localStorage', e);
  }
  return { ...DEFAULT_AI_SETTINGS };
}

export function saveAISettings(settings: AISettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save AI settings to localStorage', e);
  }
}

/**
 * Detailed SRE system context injected into live LLM requests.
 */
const SYSTEM_PROMPT = `You are OpsPilot, an elite Autonomous Site Reliability Engineer (SRE) and Kubernetes Operations AI Assistant.

YOU ARE CONNECTED TO LIVE TELEMETRY FOR: prod-cluster-alpha (Kubernetes v1.29.2).
Current Live State of the Cluster:
- Status: DEGRADED (1 Active Incident: INC-102)
- Active Incident INC-102:
  * Service: chat-backend (namespace: chat-app)
  * State: CrashLoopBackOff (7 restarts in last 15m)
  * Reason: OOMKilled (Exit Code 137). Breached memory limit of 512Mi under 1,420 WebSocket sessions.
  * Recommended remediation: Increase memory limits to 1024Mi via 'kubectl patch deployment chat-backend -n chat-app' or rollback to v1.2.3.
- Workloads:
  * chat-backend: 1/2 replicas ready (Degraded)
  * chat-frontend: 2/2 replicas ready (Healthy, LoadBalancer IP: 34.120.45.89)
  * mongodb: 1/1 replicas ready (Healthy, memory: 780Mi / 2Gi)
  * auth-service: 2/2 replicas ready (Healthy, previously resolved INC-099)
  * prometheus-k8s: 1/1 replicas ready (Healthy)
- Nodes:
  * node-01 (34% CPU, 51% RAM)
  * node-02 (48% CPU, 63% RAM - hosts failing backend pod)
  * node-03 (45% CPU, 69% RAM - hosts mongodb)

INSTRUCTIONS:
1. You can answer ANY question the user asks: cluster questions, Kubernetes runbooks, Docker, Linux, CI/CD, PromQL, YAML manifests, code generation (Bash, Python, JS/TS, Go), and general technology or conversational questions.
2. Structure your answers cleanly using Markdown: headers (###), bold text, bullet points, and fenced code blocks (\`\`\`bash, \`\`\`yaml, etc.).
3. At the end of your response, always include a section titled "### Suggested Follow-ups" with 2 to 3 concise, highly relevant next question prompts formatted as bullet points, so the user can easily continue the investigation.
`;

/**
 * Call Google Gemini REST API.
 */
async function callGemini(
  query: string,
  history: Array<{ sender: 'user' | 'assistant'; text: string }>,
  apiKey: string,
  model: string = 'gemini-1.5-flash'
): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Build contents history
  const contents: any[] = [];

  // Add past conversation turns (last 6 max for speed)
  const recentHistory = history.slice(-6);
  for (const h of recentHistory) {
    contents.push({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    });
  }

  // Add current query
  contents.push({
    role: 'user',
    parts: [{ text: query }],
  });

  const body = {
    contents,
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!candidate) {
    throw new Error('Gemini API returned empty response');
  }

  return candidate;
}

/**
 * Call OpenAI or Groq or OpenAI-compatible endpoint.
 */
async function callOpenAICompatible(
  query: string,
  history: Array<{ sender: 'user' | 'assistant'; text: string }>,
  apiKey: string,
  endpoint: string,
  model: string
): Promise<string> {
  const messages: any[] = [{ role: 'system', content: SYSTEM_PROMPT }];

  const recentHistory = history.slice(-6);
  for (const h of recentHistory) {
    messages.push({
      role: h.sender === 'user' ? 'user' : 'assistant',
      content: h.text,
    });
  }

  messages.push({ role: 'user', content: query });

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: model || 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`LLM API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error('LLM API returned empty choice');
  }

  return text;
}

/**
 * Main dispatcher to call live LLM based on user settings.
 */
export async function queryLiveLLM(
  query: string,
  history: Array<{ sender: 'user' | 'assistant'; text: string }> = []
): Promise<{ text: string; suggestedFollowUps: string[] }> {
  const settings = getAISettings();

  if (settings.provider === 'autonomous' || !settings.apiKey.trim()) {
    throw new Error('Autonomous mode or missing API key');
  }

  let fullResponse = '';

  if (settings.provider === 'gemini') {
    fullResponse = await callGemini(query, history, settings.apiKey, settings.model || 'gemini-1.5-flash');
  } else if (settings.provider === 'groq') {
    fullResponse = await callOpenAICompatible(
      query,
      history,
      settings.apiKey,
      'https://api.groq.com/openai/v1/chat/completions',
      settings.model || 'llama-3.3-70b-versatile'
    );
  } else if (settings.provider === 'openai') {
    fullResponse = await callOpenAICompatible(
      query,
      history,
      settings.apiKey,
      'https://api.openai.com/v1/chat/completions',
      settings.model || 'gpt-4o-mini'
    );
  } else if (settings.provider === 'custom') {
    fullResponse = await callOpenAICompatible(
      query,
      history,
      settings.apiKey,
      settings.customEndpoint || 'http://localhost:11434/v1/chat/completions',
      settings.model || 'llama3'
    );
  }

  // Parse follow-ups from the response if present
  const followUps: string[] = [];
  const followUpMatch = fullResponse.match(/### Suggested Follow-ups?([\s\S]*?)$/i);
  let cleanText = fullResponse;

  if (followUpMatch && followUpMatch[1]) {
    const followUpLines = followUpMatch[1]
      .split('\n')
      .map((l) => l.replace(/^[-*•\d.]\s*/, '').trim())
      .filter((l) => l.length > 3 && l.length < 80);

    followUps.push(...followUpLines.slice(0, 3));
    // Remove the follow-ups section from cleanText so it renders as buttons instead of raw text
    cleanText = fullResponse.replace(/### Suggested Follow-ups?[\s\S]*$/i, '').trim();
  }

  if (followUps.length === 0) {
    followUps.push(
      'Why is the backend unhealthy?',
      'How to resolve INC-102?',
      'Show recent incidents'
    );
  }

  return {
    text: cleanText,
    suggestedFollowUps: followUps,
  };
}

/**
 * Quick connection tester for the UI settings modal.
 */
export async function testAIConnection(settings: AISettings): Promise<{ success: boolean; message: string }> {
  try {
    if (!settings.apiKey.trim()) {
      return { success: false, message: 'Please enter an API key.' };
    }

    if (settings.provider === 'gemini') {
      await callGemini('test ping', [], settings.apiKey, settings.model || 'gemini-1.5-flash');
      return { success: true, message: `Successfully connected to Google Gemini (${settings.model || 'gemini-1.5-flash'}).` };
    }

    if (settings.provider === 'groq') {
      await callOpenAICompatible(
        'test ping',
        [],
        settings.apiKey,
        'https://api.groq.com/openai/v1/chat/completions',
        settings.model || 'llama-3.3-70b-versatile'
      );
      return { success: true, message: 'Successfully connected to Groq API.' };
    }

    if (settings.provider === 'openai') {
      await callOpenAICompatible(
        'test ping',
        [],
        settings.apiKey,
        'https://api.openai.com/v1/chat/completions',
        settings.model || 'gpt-4o-mini'
      );
      return { success: true, message: 'Successfully connected to OpenAI API.' };
    }

    return { success: true, message: 'Settings saved.' };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Connection failed. Please verify your API key and network.',
    };
  }
}
