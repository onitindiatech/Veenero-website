import React, { useEffect } from 'react';
import * as Icons from 'lucide-react';
import { CmsPage } from '../../types/cms.types';

interface DeleteConfirmModalProps {
  page: CmsPage | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  page,
  onConfirm,
  onCancel,
}) => {
  if (!page) return null;

  // Trap Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={onCancel}
      />

      {/* Modal card */}
      <div className="relative bg-card border border-border/50 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-fade-in z-10">
        {/* Warning icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-600 mx-auto mb-4">
          <Icons.Trash2 className="h-6 w-6" />
        </div>

        <h2
          id="delete-modal-title"
          className="text-center text-lg font-bold text-foreground font-sans mb-2"
        >
          Delete Page
        </h2>

        <p className="text-center text-sm text-muted-foreground font-sans mb-1">
          Are you sure you want to delete{' '}
          <span className="font-bold text-foreground">"{page.name}"</span>?
        </p>
        <p className="text-center text-xs text-muted-foreground/70 font-sans mb-6">
          This action cannot be undone. The page and all its content will be permanently removed.
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            id="delete-modal-cancel"
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-xl border border-border/50 bg-transparent text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors duration-200 font-sans"
          >
            Cancel
          </button>
          <button
            type="button"
            id="delete-modal-confirm"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold transition-colors duration-200 font-sans flex items-center justify-center gap-2"
          >
            <Icons.Trash2 className="h-3.5 w-3.5" />
            Delete Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
