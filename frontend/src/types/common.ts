export type FilterOption<T = string> = {
  label: string;
  value: T;
};

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description?: string;
  duration?: number;
}
