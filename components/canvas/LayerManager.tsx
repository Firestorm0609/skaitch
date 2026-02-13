'use client'

import { useCanvasStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Plus, Trash2, Eye, EyeOff, Lock, Unlock } from 'lucide-react'

export function LayerManager() {
  const {
    canvasState,
    selectedLayerId,
    selectLayer,
    addLayer,
    removeLayer,
    updateLayer,
  } = useCanvasStore()

  if (!canvasState) return null

  const layers = [...canvasState.layers].sort((a, b) => b.position - a.position)

  return (
    <div className="flex flex-col gap-2 p-3 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold text-skaitch-dark">
          Layers
        </div>
        <button
          onClick={() => addLayer(`Layer ${layers.length + 1}`)}
          className="p-1 rounded hover:bg-skaitch-purple/10"
          title="Add layer"
        >
          <Plus className="w-4 h-4 text-skaitch-purple" />
        </button>
      </div>

      <div className="space-y-1 max-h-60 overflow-y-auto">
        {layers.map((layer) => (
          <div
            key={layer.id}
            onClick={() => selectLayer(layer.id)}
            className={cn(
              'flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer',
              'hover:bg-skaitch-purple/5 transition-all',
              selectedLayerId === layer.id && 'skaitch-layer-selected'
            )}
          >
            {/* Layer thumbnail */}
            <div className="w-8 h-8 bg-gray-100 rounded border border-gray-300 flex-shrink-0" />

            {/* Layer info */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-skaitch-dark truncate">
                {layer.name}
              </div>
              <div className="text-xs text-gray-500">
                {Math.round(layer.opacity * 100)}%
              </div>
            </div>

            {/* Layer controls */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  updateLayer(layer.id, { visible: !layer.visible })
                }}
                className="p-1 rounded hover:bg-white"
                title={layer.visible ? 'Hide' : 'Show'}
              >
                {layer.visible ? (
                  <Eye className="w-3 h-3" />
                ) : (
                  <EyeOff className="w-3 h-3 text-gray-400" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation()
                  updateLayer(layer.id, { locked: !layer.locked })
                }}
                className="p-1 rounded hover:bg-white"
                title={layer.locked ? 'Unlock' : 'Lock'}
              >
                {layer.locked ? (
                  <Lock className="w-3 h-3" />
                ) : (
                  <Unlock className="w-3 h-3 text-gray-400" />
                )}
              </button>

              {layers.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeLayer(layer.id)
                  }}
                  className="p-1 rounded hover:bg-red-50"
                  title="Delete layer"
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Opacity slider for selected layer */}
      {selectedLayerId && (
        <div className="pt-2 border-t">
          <label className="text-xs font-medium text-skaitch-dark mb-1 block">
            Opacity
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={
              (layers.find((l) => l.id === selectedLayerId)?.opacity ?? 1) * 100
            }
            onChange={(e) => {
              if (selectedLayerId) {
                updateLayer(selectedLayerId, {
                  opacity: Number(e.target.value) / 100,
                })
              }
            }}
            className="w-full"
          />
        </div>
      )}
    </div>
  )
}
