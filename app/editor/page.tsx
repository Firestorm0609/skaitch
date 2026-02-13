'use client'

import { useEffect } from 'react'
import { useCanvasStore } from '@/lib/store'
import { SkaitchCanvas } from '@/components/canvas/SkaitchCanvas'
import { ToolPanel } from '@/components/canvas/ToolPanel'
import { LayerManager } from '@/components/canvas/LayerManager'
import { AIAssistPanel } from '@/components/ai-assist/AIAssistPanel'
import { Undo2, Redo2, Save, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function EditorPage() {
  const {
    createNewProject,
    canvasState,
    undo,
    redo,
    canUndo,
    canRedo,
    saveProject,
  } = useCanvasStore()

  useEffect(() => {
    if (!canvasState) {
      createNewProject(1024, 768, 'Untitled Skaitch')
    }
  }, [])

  const handleSave = () => {
    saveProject()
    // Show toast notification
  }

  const handleExport = () => {
    // Export canvas as image
    console.log('Exporting...')
  }

  return (
    <div className="flex flex-col h-screen bg-skaitch-dark">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-skaitch-purple to-skaitch-cyan bg-clip-text text-transparent">
            SKAITCH
          </h1>
          <div className="text-sm text-gray-600">
            {canvasState?.projectName || 'Untitled'}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <button
            onClick={undo}
            disabled={!canUndo}
            className={cn(
              'p-2 rounded-md hover:bg-gray-100',
              !canUndo && 'opacity-50 cursor-not-allowed'
            )}
            title="Undo"
          >
            <Undo2 className="w-5 h-5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={cn(
              'p-2 rounded-md hover:bg-gray-100',
              !canRedo && 'opacity-50 cursor-not-allowed'
            )}
            title="Redo"
          >
            <Redo2 className="w-5 h-5" />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Save/Export */}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-skaitch-purple text-white rounded-md hover:bg-skaitch-purple/90"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </header>

      {/* Main Editor */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Tools */}
        <aside className="w-48 lg:w-56 p-3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
          <ToolPanel />
          <div className="mt-4">
            <LayerManager />
          </div>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-gradient-to-br from-gray-100 to-gray-200">
          <SkaitchCanvas width={1024} height={768} />
        </main>

        {/* Right Sidebar - AI Assist */}
        <aside className="w-64 lg:w-72 p-3 bg-gray-50 border-l border-gray-200 overflow-y-auto">
          <AIAssistPanel />
          
          {/* AI Stats */}
          {canvasState && (
            <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
              <div className="text-sm font-semibold text-skaitch-dark mb-2">
                Project Stats
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>AI Assists:</span>
                  <span className="font-medium text-skaitch-purple">
                    {canvasState.metadata.ai_assists_count}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Layers:</span>
                  <span className="font-medium">{canvasState.layers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Canvas:</span>
                  <span className="font-medium">
                    {canvasState.width}×{canvasState.height}
                  </span>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}