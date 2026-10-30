import { ChatMessage } from '../types/chat';
import { initialChatMessages } from '../data/mockChat';
import { queryAutonomousEngine } from './aiEngine';
import { queryLiveLLM, getAISettings } from './aiLiveProvider';

const delay = (ms: number = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const aiService = {
  /**
   * Returns default introductory conversation messages.
   */
  async getInitialHistory(): Promise<ChatMessage[]> {
    await delay(50);
    return [...initialChatMessages];
  },

  /**
   * Process and respond to ANY user prompt or operational query.
   * Seamlessly routes between Live Cloud LLM (Gemini/OpenAI/Groq) and the
   * built-in autonomous SRE reasoning engine.
   */
  async sendQuery(
    query: string,
    history: ChatMessage[] = []
  ): Promise<ChatMessage> {
    const trimmed = query.trim();
    if (!trimmed) {
      throw new Error('Query cannot be empty');
    }

    const settings = getAISettings();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isLiveConfigured =
      settings.provider !== 'autonomous' && Boolean(settings.apiKey?.trim());

    // 1. Attempt Live Cloud LLM if user configured an API key
    if (isLiveConfigured) {
      try {
        const compactHistory = history.map((m) => ({
          sender: m.sender,
          text: m.text,
        }));

        const liveResult = await queryLiveLLM(trimmed, compactHistory);

        // Check if query is about the failing backend to augment with telemetry evidence
        const qLower = trimmed.toLowerCase();
        let evidence = undefined;
        if (
          qLower.includes('backend') ||
          qLower.includes('oom') ||
          qLower.includes('crashloop') ||
          qLower.includes('102') ||
          qLower.includes('incident')
        ) {
          const autoFallback = queryAutonomousEngine(trimmed);
          evidence = autoFallback.evidence;
        }

        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          timestamp: now,
          text: liveResult.text,
          confidence: 96,
          evidence,
          suggestedFollowUps: liveResult.suggestedFollowUps,
        };
      } catch (liveError: any) {
        console.warn(
          'Live AI provider request failed. Seamlessly routing to autonomous engine:',
          liveError?.message || liveError
        );
        // Fall through to autonomous engine
      }
    }

    // 2. Autonomous SRE Reasoning Engine (Offline / Built-in / Instant)
    await delay(350); // Natural thinking cadence
    const autonomousResult = queryAutonomousEngine(trimmed);

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: now,
      text: autonomousResult.text,
      confidence: autonomousResult.confidence,
      evidence: autonomousResult.evidence,
      suggestedFollowUps: autonomousResult.suggestedFollowUps,
    };
  },
};
