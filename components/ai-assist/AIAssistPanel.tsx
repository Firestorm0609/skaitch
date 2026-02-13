'use client'

import { useState } from 'react'
import { useCanvasStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Sparkles, Wand2, Circle, Minus, Palette } from 'lucide-react'
import type { AssistType } from '@/types'

const quickActions: Array<{
  type: AssistType
  icon: React.ComponentType<{ className?: string }>
  label: string
}> = [
  { type: 'PERFECT_SHAPE', icon: Circle, label: 'Perfect Shape' },
  { type: 'STRAIGHTEN_LINE', icon: Minus, label: 'Straight Line' },
  { type: 'CLEAN_SKETCH', icon: Wand2, label: 'Clean Up' },
  { type: 'COLOR_SUGGESTION', icon: Palette, label: 'Color Ideas' },
]

export function AIAssistPanel() {
  const { isAIProcessing, setAIProcessing, addToHistory } = useCanvasStore()
  const [prompt, setPrompt] = useState('')
  const [assistType, setAssistType] = useState<AssistType>('SKETCH_TO_ART')

  const handleAIAssist = async () => {
    if (!prompt.trim() && assistType === 'SKETCH_TO_ART') return

    setAIProcessing(true)

    try {
      // TODO: Call AI API
      const response = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: assistType,
          prompt,
          // canvas data would go here
        }),
      })

      const data = await response.json()

      if (data.success) {
        addToHistory({
          type: 'ai-assist',
          before: '', // canvas before
          after: data.resultImage,
          aiPrompt: prompt,
        })
      }
    } catch (error) {
      console.error('AI assist error:', error)
    } finally {
      setAIProcessing(false)
    }
  }

  const handleQuickAction = async (type: AssistType) => {
    setAssistType(type)
    setAIProcessing(true)
    
    // Simulate AI processing
    setTimeout(() => {
      setAIProcessing(false)
      // Apply quick action
    }, 1500)
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-gradient-to-br from-skaitch-purple/10 to-skaitch-cyan/10 rounded-lg border-2 border-skaitch-purple/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-skaitch-purple" />
          <h3 className="font-semibold text-skaitch-dark">AI Assist</h3>
        </div>
        <button
          onClick={() => setPrompt('')}
          className="px-2 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded"
        >
          Clear
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col gap-2">
        {quickActions.map(({ type, icon: Icon, label }) => (
          <button
            key={type}
            onClick={() => handleQuickAction(type)}
            disabled={isAIProcessing}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-md text-left',
              'bg-white hover:bg-skaitch-purple/10',
              'border border-skaitch-purple/20',
              'transition-all disabled:opacity-50'
            )}
          >
            <Icon className="w-4 h-4 text-skaitch-purple flex-shrink-0" />
            <span className="text-xs font-medium truncate">{label}</span>
          </button>
        ))}
      </div>

      {/* Custom Prompt */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-skaitch-dark">
          Custom Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'make this a basketball, uncolored'"
          className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-skaitch-purple"
          rows={3}
          disabled={isAIProcessing}
        />
        <button
          onClick={handleAIAssist}
          disabled={isAIProcessing || !prompt.trim()}
          className={cn(
            'w-full px-4 py-2 rounded-md font-medium transition-all',
            'bg-skaitch-purple text-white',
            'hover:bg-skaitch-purple/90',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            isAIProcessing && 'animate-pulse'
          )}
        >
          {isAIProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="skaitch-loading" />
              Processing...
            </span>
          ) : (
            'Apply AI Assist'
          )}
        </button>
      </div>

      {/* Strength Slider */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-skaitch-dark">
          AI Influence: 50%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          defaultValue="50"
          className="w-full"
          disabled={isAIProcessing}
        />
      </div>
    </div>
  )
}