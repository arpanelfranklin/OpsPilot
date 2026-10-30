import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { ClusterProvider } from './context/ClusterContext';
import { AppLayout } from './components/layout/AppLayout';

import { Dashboard } from './pages/Dashboard';
import { Cluster } from './pages/Cluster';
import { Incidents } from './pages/Incidents';
import { IncidentDetails } from './pages/IncidentDetails';
import { Workloads } from './pages/Workloads';
import { AIAssistant } from './pages/AIAssistant';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <ClusterProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/cluster" element={<Cluster />} />
              <Route path="/incidents" element={<Incidents />} />
              <Route path="/incidents/:id" element={<IncidentDetails />} />
              <Route path="/workloads" element={<Workloads />} />
              <Route path="/assistant" element={<AIAssistant />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ClusterProvider>
    </ToastProvider>
  );
};

export default App;
