'use client'

import { useCanvasStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import {
  Brush,
  Eraser,
  Square,
  MousePointer,
  Sparkles,
  Type,
  Pipette,
} from 'lucide-react'
import type { ToolType } from '@/types'

const tools: Array<{
  type: ToolType
  icon: React.ComponentType<{ className?: string }>
  label: string
}> = [
  { type: 'brush', icon: Brush, label: 'Brush' },
  { type: 'eraser', icon: Eraser, label: 'Eraser' },
  { type: 'shape', icon: Square, label: 'Shape' },
  { type: 'select', icon: MousePointer, label: 'Select' },
  { type: 'fill', icon: Pipette, label: 'Fill' },
  { type: 'text', icon: Type, label: 'Text' },
  { type: 'ai-assist', icon: Sparkles, label: 'AI Assist' },
]

export function ToolPanel() {
  const { currentTool, setTool } = useCanvasStore()

  return (
    <div className="flex flex-col gap-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="text-sm font-semibold text-skaitch-dark mb-2">
        Tools
      </div>
      
      {tools.map(({ type, icon: Icon, label }) => (
        <button
          key={type}
          onClick={() => setTool(type)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-md transition-all',
            'hover:bg-skaitch-purple/10',
            currentTool === type
              ? 'skaitch-tool-active shadow-md'
              : 'bg-white text-skaitch-dark'
          )}
          title={label}
        >
          <Icon className="w-5 h-5" />
          <span className="text-sm">{label}</span>
        </button>
      ))}
    </div>
  )
}
