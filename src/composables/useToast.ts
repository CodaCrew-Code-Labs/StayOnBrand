import { reactive } from 'vue'

export interface Toast {
  id: number
  type: 'success' | 'error' | 'info'
  title: string
  message?: string
  duration?: number
}

const toasts = reactive<Toast[]>([])
let toastId = 0

export function useToast() {
  const show = (toast: Omit<Toast, 'id'>) => {
    const id = ++toastId
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000
    }
    toasts.push(newToast)

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, newToast.duration)
    }

    return id
  }

  const dismiss = (id: number) => {
    const index = toasts.findIndex(t => t.id === id)
    if (index !== -1) {
      toasts.splice(index, 1)
    }
  }

  const success = (title: string, message?: string, duration?: number) => {
    return show({ type: 'success', title, message, duration })
  }

  const error = (title: string, message?: string, duration?: number) => {
    return show({ type: 'error', title, message, duration })
  }

  const info = (title: string, message?: string, duration?: number) => {
    return show({ type: 'info', title, message, duration })
  }

  return {
    toasts,
    show,
    dismiss,
    success,
    error,
    info
  }
}
