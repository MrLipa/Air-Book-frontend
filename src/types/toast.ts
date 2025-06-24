export type ToastFunction = (severity: ToastSeverity, summary: string, detail: string) => void;

export enum ToastSeverity {
  SUCCESS = "success",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface ToastContextType {
  showToast: (severity: ToastSeverity, summary: string, detail: string) => void;
}

export interface ToastProviderProps {
  children: React.ReactNode;
}
