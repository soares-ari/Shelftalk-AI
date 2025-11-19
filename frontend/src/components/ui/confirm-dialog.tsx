"use client";

import { useState } from "react";

type Props = {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  children: React.ReactNode;
};

export function ConfirmDialog({
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch (err) {
      console.error("Confirm error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Trigger */}
      <div onClick={() => setOpen(true)}>{children}</div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-6 max-w-md w-full mx-4 space-y-4">
            <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
            <p className="text-slate-400 text-sm">{description}</p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {loading ? "Deletando..." : confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}