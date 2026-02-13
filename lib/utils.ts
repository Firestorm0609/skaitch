import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Tailwind class merging utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Canvas utilities
export function canvasToBase64(canvas: HTMLCanvasElement, format: 'png' | 'jpeg' = 'png'): string {
  return canvas.toDataURL(`image/${format}`)
}

export function base64ToImage(base64: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = base64
  })
}

export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL()
  link.click()
}

// Color utilities
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

// UUID generator
export function generateId(): string {
  return crypto.randomUUID()
}

// Debounce utility
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Throttle utility
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// File size formatter
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

// Date formatter
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// Truncate wallet address
export function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

// Calculate AI contribution percentage
export function calculateAIContribution(
  totalStrokes: number,
  aiAssistCount: number
): number {
  if (totalStrokes === 0) return 0
  return Math.round((aiAssistCount / (totalStrokes + aiAssistCount)) * 100)
}

// Image compression
export async function compressImage(
  base64: string,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.8
): Promise<string> {
  const img = await base64ToImage(base64)
  const canvas = document.createElement('canvas')
  let width = img.width
  let height = img.height

  if (width > height) {
    if (width > maxWidth) {
      height *= maxWidth / width
      width = maxWidth
    }
  } else {
    if (height > maxHeight) {
      width *= maxHeight / height
      height = maxHeight
    }
  }

  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx?.drawImage(img, 0, 0, width, height)
  
  return canvas.toDataURL('image/jpeg', quality)
}

// Validate canvas dimensions
export function validateCanvasDimensions(
  width: number,
  height: number
): { valid: boolean; error?: string } {
  const MIN_SIZE = 100
  const MAX_SIZE = 8192

  if (width < MIN_SIZE || height < MIN_SIZE) {
    return { valid: false, error: `Minimum canvas size is ${MIN_SIZE}x${MIN_SIZE}px` }
  }
  if (width > MAX_SIZE || height > MAX_SIZE) {
    return { valid: false, error: `Maximum canvas size is ${MAX_SIZE}x${MAX_SIZE}px` }
  }
  return { valid: true }
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

// Local storage helpers
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error('Storage error:', error)
    }
  },
  remove: (key: string): void => {
    localStorage.removeItem(key)
  },
  clear: (): void => {
    localStorage.clear()
  },
}
