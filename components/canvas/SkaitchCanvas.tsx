'use client'

import { useEffect, useRef, useState } from 'react'
import { fabric } from 'fabric'
import { useCanvasStore } from '@/lib/store'
import { cn } from '@/lib/utils'

interface SkaitchCanvasProps {
  width?: number
  height?: number
  className?: string
}

export function SkaitchCanvas({
  width = 800,
  height = 600,
  className,
}: SkaitchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  
  const {
    currentTool,
    isDrawing,
    setDrawing,
    addToHistory,
    selectedLayerId,
  } = useCanvasStore()

  const [currentColor, setCurrentColor] = useState('#000000')
  const [brushSize, setBrushSize] = useState(5)

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      isDrawingMode: currentTool === 'brush',
      width,
      height,
      backgroundColor: '#ffffff',
    })

    // Configure brush
    canvas.freeDrawingBrush.color = currentColor
    canvas.freeDrawingBrush.width = brushSize

    fabricCanvasRef.current = canvas

    // Event listeners
    canvas.on('mouse:down', () => setDrawing(true))
    canvas.on('mouse:up', handleDrawingComplete)

    return () => {
      canvas.dispose()
    }
  }, [])

  // Update tool
  useEffect(() => {
    if (!fabricCanvasRef.current) return
    fabricCanvasRef.current.isDrawingMode = currentTool === 'brush'
  }, [currentTool])

  // Update brush settings
  useEffect(() => {
    if (!fabricCanvasRef.current) return
    const brush = fabricCanvasRef.current.freeDrawingBrush
    brush.color = currentColor
    brush.width = brushSize
  }, [currentColor, brushSize])

  const handleDrawingComplete = () => {
    setDrawing(false)
    
    if (!fabricCanvasRef.current) return

    // Save to history
    const dataURL = fabricCanvasRef.current.toDataURL()
    addToHistory({
      type: 'draw',
      before: '', // Previous state would go here
      after: dataURL,
    })
  }

  const clearCanvas = () => {
    if (!fabricCanvasRef.current) return
    fabricCanvasRef.current.clear()
    fabricCanvasRef.current.backgroundColor = '#ffffff'
  }

  return (
    <div className={cn('relative', className)}>
      <canvas
        ref={canvasRef}
        className="skaitch-canvas border-2 border-skaitch-purple/20 rounded-lg shadow-lg"
      />
      
      {/* Quick Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white/90 p-2 rounded-lg shadow-md">
        <input
          type="color"
          value={currentColor}
          onChange={(e) => setCurrentColor(e.target.value)}
          className="w-10 h-10 cursor-pointer rounded"
          title="Pick color"
        />
        <input
          type="range"
          min="1"
          max="50"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-10"
          title="Brush size"
          style={{ writingMode: 'vertical-lr' }}
        />
        <button
          onClick={clearCanvas}
          className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
          title="Clear canvas"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
