import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);

  show(toast: Omit<ToastMessage, 'id'>) {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = toast.duration ?? (toast.type === 'error' ? 6500 : toast.type === 'warning' ? 5500 : 4500);
    const newToast: ToastMessage = {
      ...toast,
      id,
      duration
    };

    this.toasts.update(current => [...current, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }
  }

  success(message: string, title: string = 'Success') {
    this.show({ type: 'success', title, message });
  }

  error(message: string, title: string = 'Error') {
    this.show({ type: 'error', title, message });
  }

  warning(message: string, title: string = 'Warning') {
    this.show({ type: 'warning', title, message });
  }

  info(message: string, title: string = 'Information') {
    this.show({ type: 'info', title, message });
  }

  remove(id: string) {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }

  clear() {
    this.toasts.set([]);
  }
}
