import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ServerCrash, Home } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-16 text-center">
      <div className="p-4 rounded-full bg-rose-950/60 text-rose-400 border border-rose-800/60 mb-4">
        <ServerCrash className="w-10 h-10" />
      </div>
      <h1 className="text-3xl font-bold font-mono text-white mb-2">404 - Resource Not Found</h1>
      <p className="text-xs text-slate-400 font-mono max-w-md mb-6">
        The requested Kubernetes endpoint or OpsPilot dashboard route does not exist in the routing table.
      </p>
      <Button variant="primary" icon={Home} onClick={() => navigate('/dashboard')}>
        Return to Dashboard
      </Button>
    </div>
  );
};
