import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  SkaitchCanvasState,
  Layer,
  HistoryEntry,
  Tool,
  ToolType,
} from '@/types'
import { generateId } from '@/lib/utils'

interface CanvasStore {
  // Canvas state
  canvasState: SkaitchCanvasState | null
  currentTool: ToolType
  selectedLayerId: string | null
  isDrawing: boolean
  
  // History
  historyIndex: number
  canUndo: boolean
  canRedo: boolean
  
  // AI Assist
  isAIProcessing: boolean
  aiPreviewImage: string | null
  
  // Actions
  createNewProject: (width: number, height: number, name: string) => void
  loadProject: (state: SkaitchCanvasState) => void
  saveProject: () => void
  
  // Tool actions
  setTool: (tool: ToolType) => void
  
  // Layer actions
  addLayer: (name: string) => void
  removeLayer: (id: string) => void
  selectLayer: (id: string) => void
  updateLayer: (id: string, updates: Partial<Layer>) => void
  reorderLayer: (id: string, newPosition: number) => void
  
  // Drawing actions
  setDrawing: (drawing: boolean) => void
  
  // History actions
  undo: () => void
  redo: () => void
  addToHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void
  
  // AI actions
  setAIProcessing: (processing: boolean) => void
  setAIPreview: (image: string | null) => void
  applyAIResult: (image: string) => void
}

const initialCanvasState = (
  width: number,
  height: number,
  name: string
): SkaitchCanvasState => ({
  id: generateId(),
  version: '1.0.0',
  projectName: name,
  width,
  height,
  layers: [
    {
      id: generateId(),
      name: 'Background',
      type: 'raster',
      data: '',
      opacity: 1,
      blendMode: 'normal',
      locked: false,
      visible: true,
      position: 0,
    },
  ],
  history: [],
  metadata: {
    created: new Date(),
    modified: new Date(),
    ai_assists_count: 0,
    skaitch_version: '1.0.0',
  },
})

export const useCanvasStore = create<CanvasStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        canvasState: null,
        currentTool: 'brush',
        selectedLayerId: null,
        isDrawing: false,
        historyIndex: -1,
        canUndo: false,
        canRedo: false,
        isAIProcessing: false,
        aiPreviewImage: null,

        // Create new project
        createNewProject: (width, height, name) => {
          const newState = initialCanvasState(width, height, name)
          set({
            canvasState: newState,
            selectedLayerId: newState.layers[0].id,
            historyIndex: -1,
            canUndo: false,
            canRedo: false,
          })
        },

        // Load existing project
        loadProject: (state) => {
          set({
            canvasState: state,
            selectedLayerId: state.layers[0]?.id || null,
            historyIndex: state.history.length - 1,
            canUndo: state.history.length > 0,
            canRedo: false,
          })
        },

        // Save project (would trigger API call)
        saveProject: () => {
          const state = get().canvasState
          if (state) {
            console.log('Saving project:', state.projectName)
            // API call would go here
          }
        },

        // Tool management
        setTool: (tool) => set({ currentTool: tool }),

        // Layer management
        addLayer: (name) =>
          set((state) => {
            if (!state.canvasState) return state
            const newLayer: Layer = {
              id: generateId(),
              name,
              type: 'raster',
              data: '',
              opacity: 1,
              blendMode: 'normal',
              locked: false,
              visible: true,
              position: state.canvasState.layers.length,
            }
            return {
              canvasState: {
                ...state.canvasState,
                layers: [...state.canvasState.layers, newLayer],
                metadata: {
                  ...state.canvasState.metadata,
                  modified: new Date(),
                },
              },
              selectedLayerId: newLayer.id,
            }
          }),

        removeLayer: (id) =>
          set((state) => {
            if (!state.canvasState || state.canvasState.layers.length === 1) {
              return state
            }
            const layers = state.canvasState.layers.filter((l) => l.id !== id)
            return {
              canvasState: {
                ...state.canvasState,
                layers,
                metadata: {
                  ...state.canvasState.metadata,
                  modified: new Date(),
                },
              },
              selectedLayerId:
                state.selectedLayerId === id ? layers[0]?.id : state.selectedLayerId,
            }
          }),

        selectLayer: (id) => set({ selectedLayerId: id }),

        updateLayer: (id, updates) =>
          set((state) => {
            if (!state.canvasState) return state
            return {
              canvasState: {
                ...state.canvasState,
                layers: state.canvasState.layers.map((layer) =>
                  layer.id === id ? { ...layer, ...updates } : layer
                ),
                metadata: {
                  ...state.canvasState.metadata,
                  modified: new Date(),
                },
              },
            }
          }),

        reorderLayer: (id, newPosition) =>
          set((state) => {
            if (!state.canvasState) return state
            const layers = [...state.canvasState.layers]
            const layerIndex = layers.findIndex((l) => l.id === id)
            if (layerIndex === -1) return state
            
            const [layer] = layers.splice(layerIndex, 1)
            layers.splice(newPosition, 0, layer)
            
            // Update positions
            const reorderedLayers = layers.map((l, i) => ({ ...l, position: i }))
            
            return {
              canvasState: {
                ...state.canvasState,
                layers: reorderedLayers,
              },
            }
          }),

        // Drawing state
        setDrawing: (drawing) => set({ isDrawing: drawing }),

        // History management
        undo: () =>
          set((state) => {
            if (!state.canUndo || !state.canvasState) return state
            const newIndex = state.historyIndex - 1
            // Apply history entry (simplified)
            return {
              historyIndex: newIndex,
              canUndo: newIndex >= 0,
              canRedo: true,
            }
          }),

        redo: () =>
          set((state) => {
            if (!state.canRedo || !state.canvasState) return state
            const newIndex = state.historyIndex + 1
            // Apply history entry (simplified)
            return {
              historyIndex: newIndex,
              canUndo: true,
              canRedo: newIndex < state.canvasState.history.length - 1,
            }
          }),

        addToHistory: (entry) =>
          set((state) => {
            if (!state.canvasState) return state
            const historyEntry: HistoryEntry = {
              ...entry,
              id: generateId(),
              timestamp: new Date(),
            }
            return {
              canvasState: {
                ...state.canvasState,
                history: [...state.canvasState.history, historyEntry],
                metadata: {
                  ...state.canvasState.metadata,
                  modified: new Date(),
                  ai_assists_count:
                    entry.type === 'ai-assist'
                      ? state.canvasState.metadata.ai_assists_count + 1
                      : state.canvasState.metadata.ai_assists_count,
                },
              },
              historyIndex: state.canvasState.history.length,
              canUndo: true,
              canRedo: false,
            }
          }),

        // AI actions
        setAIProcessing: (processing) => set({ isAIProcessing: processing }),
        
        setAIPreview: (image) => set({ aiPreviewImage: image }),
        
        applyAIResult: (image) =>
          set((state) => {
            // Apply AI result to selected layer
            if (!state.canvasState || !state.selectedLayerId) return state
            
            const updatedLayers = state.canvasState.layers.map((layer) =>
              layer.id === state.selectedLayerId
                ? { ...layer, data: image, type: 'ai-generated' as const }
                : layer
            )
            
            return {
              canvasState: {
                ...state.canvasState,
                layers: updatedLayers,
              },
              aiPreviewImage: null,
              isAIProcessing: false,
            }
          }),
      }),
      {
        name: 'skaitch-canvas-storage',
        partialize: (state) => ({
          canvasState: state.canvasState,
        }),
      }
    )
  )
)
