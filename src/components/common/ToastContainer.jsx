import React from 'react';
import { useShop } from '../../context/ShopContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-luxury bg-onyx-900/95 text-white backdrop-blur-md border border-white/10 animate-slide-up transition-all duration-300"
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-gold" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {isInfo && <Info className="w-5 h-5 text-sky-400" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white tracking-wide">{toast.title}</p>
              {toast.message && (
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded-md"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
