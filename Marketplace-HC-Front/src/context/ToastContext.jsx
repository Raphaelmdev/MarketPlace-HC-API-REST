import { createContext, useContext, useState } from "react";
import "@/styles/components/Toast.css";

const ToastContext = createContext(null);

const MAX_TOASTS = 5;
const DEFAULT_DURATION = 3000;
const EXIT_ANIMATION_DURATION = 300;
const DEFAULT_REDIRECT_DELAY = 2500;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  function removeToast(id) {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }

  function closeToast(id) {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, leaving: true } : toast
      )
    );

    setTimeout(() => {
      removeToast(id);
    }, EXIT_ANIMATION_DURATION);
  }

  function showToast({
    type = "info",
    message,
    duration = DEFAULT_DURATION,
    callback,
    redirectDelay = DEFAULT_REDIRECT_DELAY
  }) {
    const id = Date.now() + Math.random();

    setToasts((prev) => {
      const updated = [
        ...prev,
        {
          id,
          type,
          message,
          duration,
          leaving: false
        }
      ];

      if (updated.length > MAX_TOASTS) {
        updated.shift();
      }

      return updated;
    });

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) =>
          prev.map((toast) =>
            toast.id === id ? { ...toast, leaving: true } : toast
          )
        );
      }, duration - EXIT_ANIMATION_DURATION);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    if (callback) {
      setTimeout(() => {
        callback();
      }, redirectDelay);
    }
  }

  function showSuccess(message, callback, redirectDelay) {
    showToast({
      type: "success",
      message,
      callback,
      redirectDelay
    });
  }

  function showError(message, callback, redirectDelay) {
    showToast({
      type: "error",
      message,
      callback,
      redirectDelay
    });
  }

  function showInfo(message, callback, redirectDelay) {
    showToast({
      type: "info",
      message,
      callback,
      redirectDelay
    });
  }

  function showWarning(message, callback, redirectDelay) {
    showToast({
      type: "warning",
      message,
      callback,
      redirectDelay
    });
  }

  return (
    <ToastContext.Provider
      value={{
        showSuccess,
        showError,
        showInfo,
        showWarning
      }}
    >
      {children}

      <div className="toast-container">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast toast-${toast.type} ${
              toast.leaving ? "toast-out" : ""
            }`}
            onClick={() => closeToast(toast.id)}
          >
            <span>{toast.message}</span>

            {toast.duration > 0 && (
              <div
                className="toast-progress"
                style={{ animationDuration: `${toast.duration}ms` }}
              />
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast deve ser usado dentro de ToastProvider.");
  }

  return context;
}