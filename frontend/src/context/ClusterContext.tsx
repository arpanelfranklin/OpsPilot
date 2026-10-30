import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClusterInfo, Environment } from '../types/cluster';
import { clusterService } from '../services/clusterService';

interface ClusterContextType {
  cluster: ClusterInfo | null;
  currentClusterKey: string;
  setClusterKey: (key: string) => void;
  environment: Environment;
  setEnvironment: (env: Environment) => void;
  isLoading: boolean;
  refreshCluster: () => Promise<void>;
}

const ClusterContext = createContext<ClusterContextType | undefined>(undefined);

export const ClusterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentClusterKey, setClusterKey] = useState<string>('production-us-east');
  const [cluster, setCluster] = useState<ClusterInfo | null>(null);
  const [environment, setEnvironment] = useState<Environment>('Production');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCluster = async (key: string) => {
    setIsLoading(true);
    try {
      const data = await clusterService.getClusterOverview(key);
      setCluster(data);
      setEnvironment(data.environment);
    } catch (err) {
      console.error('Failed to load cluster data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCluster(currentClusterKey);
  }, [currentClusterKey]);

  const handleSetEnvironment = (env: Environment) => {
    setEnvironment(env);
    if (env === 'Production') setClusterKey('production-us-east');
    else if (env === 'Staging') setClusterKey('staging-us-east');
    else if (env === 'Development') setClusterKey('dev-local');
  };

  return (
    <ClusterContext.Provider
      value={{
        cluster,
        currentClusterKey,
        setClusterKey,
        environment,
        setEnvironment: handleSetEnvironment,
        isLoading,
        refreshCluster: () => fetchCluster(currentClusterKey),
      }}
    >
      {children}
    </ClusterContext.Provider>
  );
};

export const useCluster = () => {
  const context = useContext(ClusterContext);
  if (!context) {
    throw new Error('useCluster must be used within a ClusterProvider');
  }
  return context;
};
