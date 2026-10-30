import React, { useState } from 'react';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ActionConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionTitle: string;
  actionType: 'danger' | 'warning' | 'info';
  targetResource: string;
  description: string;
  onConfirm: () => Promise<void> | void;
}

export const ActionConfirmModal: React.FC<ActionConfirmModalProps> = ({
  isOpen,
  onClose,
  actionTitle,
  actionType,
  targetResource,
  description,
  onConfirm,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
      setCompleted(true);
      setTimeout(() => {
        setCompleted(false);
        setIsProcessing(false);
        onClose();
      }, 1400);
    } catch {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (!isProcessing) {
      setCompleted(false);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={actionTitle}
      subtitle={`Target: ${targetResource}`}
      maxWidth="md"
    >
      <div className="space-y-4">
        {completed ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3 animate-bounce" />
            <h4 className="text-base font-semibold text-slate-100">Simulation Executed</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              Action simulation acknowledged. Spring Boot backend integration will execute real cluster mutations in Week 2.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-3 p-3.5 bg-amber-950/40 border border-amber-800/60 rounded-md">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200/90 leading-relaxed">
                <span className="font-semibold block mb-0.5 text-amber-300">Week 1 Action Simulation Notice:</span>
                This action is simulated for interface verification. No mutation will be dispatched to live Kubernetes or Prometheus instances.
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">{description}</p>

            <div className="p-3 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-slate-400">
              <div><span className="text-slate-500">Action:</span> {actionTitle}</div>
              <div><span className="text-slate-500">Resource:</span> {targetResource}</div>
              <div><span className="text-slate-500">Namespace:</span> chat-app</div>
              <div><span className="text-slate-500">Dry-Run:</span> enabled (Week 1 mode)</div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-devops-border">
              <Button variant="outline" size="sm" onClick={handleClose} disabled={isProcessing}>
                Cancel
              </Button>
              <Button
                variant={actionType === 'danger' ? 'danger' : 'primary'}
                size="sm"
                onClick={handleConfirm}
                isLoading={isProcessing}
              >
                Simulate {actionTitle}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
