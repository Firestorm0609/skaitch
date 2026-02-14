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
  width = 1024,
  height = 768,
  className,
}: SkaitchCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
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
  const [zoom, setZoom] = useState(1)
  const [isPanning, setIsPanning] = useState(false)
  const [lastPosX, setLastPosX] = useState(0)
  const [lastPosY, setLastPosY] = useState(0)
  const [shapeType, setShapeType] = useState<'rectangle' | 'circle' | 'line'>('rectangle')
  const [isDrawingShape, setIsDrawingShape] = useState(false)
  const [shapeStartX, setShapeStartX] = useState(0)
  const [shapeStartY, setShapeStartY] = useState(0)
  const [currentShape, setCurrentShape] = useState<fabric.Object | null>(null)

  // Initialize Fabric.js canvas with pan/zoom support
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width,
      height,
      backgroundColor: '#ffffff',
      selection: currentTool === 'select', // Enable selection for select tool
      isDrawingMode: currentTool === 'brush',
    })

    // Configure brush
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = currentColor
      canvas.freeDrawingBrush.width = brushSize
    }

    fabricCanvasRef.current = canvas

    // Event listeners
    canvas.on('mouse:down', handleMouseDown)
    canvas.on('mouse:move', handleMouseMove)
    canvas.on('mouse:up', handleMouseUp)
    canvas.on('mouse:wheel', handleMouseWheel)

    // Object manipulation events
    canvas.on('object:modified', handleObjectModified)
    canvas.on('path:created', handlePathCreated)

    return () => {
      canvas.dispose()
    }
  }, [])

  // Update tool mode
  useEffect(() => {
    if (!fabricCanvasRef.current) return
    const canvas = fabricCanvasRef.current

    // Clean up any ongoing drawing states when switching tools
    setDrawing(false)
    setIsDrawingShape(false)
    if (currentShape) {
      canvas.remove(currentShape)
      setCurrentShape(null)
    }

    // Update mode based on tool
    switch (currentTool) {
      case 'brush':
        canvas.isDrawingMode = true
        canvas.selection = false
        // Force reinitialize brush
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = currentColor
          canvas.freeDrawingBrush.width = brushSize
        }
        // Make existing objects non-selectable during drawing
        canvas.forEachObject((obj: fabric.Object) => {
          obj.selectable = false
          obj.evented = false
        })
        break
      
      case 'eraser':
        canvas.isDrawingMode = true
        canvas.selection = false
        // Force reinitialize eraser
        if (canvas.freeDrawingBrush) {
          canvas.freeDrawingBrush.color = '#ffffff'
          canvas.freeDrawingBrush.width = brushSize
        }
        canvas.forEachObject((obj: fabric.Object) => {
          obj.selectable = false
          obj.evented = false
        })
        break
      
      case 'select':
        canvas.isDrawingMode = false
        canvas.selection = true
        canvas.forEachObject((obj: fabric.Object) => {
          obj.selectable = true
          obj.evented = true
        })
        break
      
      case 'shape':
        canvas.isDrawingMode = false
        canvas.selection = false
        canvas.forEachObject((obj: fabric.Object) => {
          obj.selectable = false
          obj.evented = false
        })
        break

      case 'text':
        canvas.isDrawingMode = false
        canvas.selection = false
        canvas.forEachObject((obj: fabric.Object) => {
          obj.selectable = false
          obj.evented = false
        })
        break

      case 'fill':
        canvas.isDrawingMode = false
        canvas.selection = false
        canvas.forEachObject((obj: fabric.Object) => {
          obj.selectable = true
          obj.evented = true
        })
        break
      
      default:
        canvas.isDrawingMode = false
        canvas.selection = false
        canvas.forEachObject((obj: fabric.Object) => {
          obj.selectable = false
          obj.evented = false
        })
        break
    }

    canvas.renderAll()
  }, [currentTool, currentColor, brushSize])

  // Update brush settings
  useEffect(() => {
    if (!fabricCanvasRef.current) return
    const brush = fabricCanvasRef.current.freeDrawingBrush
    if (brush) {
      brush.color = currentTool === 'eraser' ? '#ffffff' : currentColor
      brush.width = brushSize
    }
  }, [currentColor, brushSize, currentTool])

  // Handle mouse down - for panning, drawing, shapes, text, and fill
  const handleMouseDown = (opt: any) => {
    const evt = opt.e
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    // Get fresh tool value from store to avoid stale closures
    const tool = useCanvasStore.getState().currentTool

    // Pan with space bar or middle mouse button
    if (evt.spaceKey || evt.button === 1) {
      setIsPanning(true)
      canvas.selection = false
      setLastPosX(evt.clientX)
      setLastPosY(evt.clientY)
      canvas.setCursor('grab')
      return
    }

    // For drawing tools
    if (tool === 'brush' || tool === 'eraser') {
      setDrawing(true)
      return
    }

    // For shape tool
    if (tool === 'shape') {
      setIsDrawingShape(true)
      const pointer = canvas.getPointer(evt)
      setShapeStartX(pointer.x)
      setShapeStartY(pointer.y)
      return
    }

    // For text tool - only if clicking on empty canvas
    if (tool === 'text' && !opt.target) {
      const pointer = canvas.getPointer(evt)
      const text = new fabric.IText('', { // Empty string, no placeholder
        left: pointer.x,
        top: pointer.y,
        fontSize: 24,
        fill: currentColor,
        fontFamily: 'Arial',
      })

      canvas.add(text)
      canvas.setActiveObject(text)
      text.enterEditing()
      text.selectAll() // Select all text so typing replaces it
      canvas.renderAll()
      return
    }

    // For fill tool - only if clicking on an object
    if (tool === 'fill' && opt.target) {
      opt.target.set('fill', currentColor)
      canvas.renderAll()

      const dataURL = canvas.toDataURL()
      addToHistory({
        type: 'modify',
        before: '',
        after: dataURL,
      })
      return
    }
  }

  // Handle mouse move - for panning and shape preview
  const handleMouseMove = (opt: any) => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    const evt = opt.e
    
    // Get fresh tool value from store to avoid stale closures
    const tool = useCanvasStore.getState().currentTool

    // Handle panning
    if (isPanning) {
      const vpt = canvas.viewportTransform
      if (!vpt) return

      vpt[4] += evt.clientX - lastPosX
      vpt[5] += evt.clientY - lastPosY
      
      canvas.requestRenderAll()
      setLastPosX(evt.clientX)
      setLastPosY(evt.clientY)
      return
    }

    // Handle shape drawing preview
    if (isDrawingShape && tool === 'shape') {
      const pointer = canvas.getPointer(evt)
      
      // Remove previous preview shape
      if (currentShape) {
        canvas.remove(currentShape)
      }

      // Create new preview shape
      let shape: fabric.Object | null = null
      const width = pointer.x - shapeStartX
      const height = pointer.y - shapeStartY

      switch (shapeType) {
        case 'rectangle':
          shape = new fabric.Rect({
            left: width < 0 ? pointer.x : shapeStartX,
            top: height < 0 ? pointer.y : shapeStartY,
            width: Math.abs(width),
            height: Math.abs(height),
            fill: 'transparent',
            stroke: currentColor,
            strokeWidth: brushSize,
          })
          break
        case 'circle':
          const radius = Math.sqrt(width * width + height * height) / 2
          shape = new fabric.Circle({
            left: shapeStartX,
            top: shapeStartY,
            radius: Math.abs(radius),
            fill: 'transparent',
            stroke: currentColor,
            strokeWidth: brushSize,
            originX: 'center',
            originY: 'center',
          })
          break
        case 'line':
          shape = new fabric.Line(
            [shapeStartX, shapeStartY, pointer.x, pointer.y],
            {
              stroke: currentColor,
              strokeWidth: brushSize,
            }
          )
          break
      }

      if (shape) {
        shape.selectable = false
        canvas.add(shape)
        setCurrentShape(shape)
        canvas.renderAll()
      }
    }
  }

  // Handle mouse up
  const handleMouseUp = () => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    // Get fresh tool value from store
    const tool = useCanvasStore.getState().currentTool

    setIsPanning(false)
    canvas.setCursor('default')
    
    if (isDrawing) {
      setDrawing(false)
      // Force render to ensure stroke is visible
      canvas.renderAll()
    }

    // Finalize shape
    if (isDrawingShape && currentShape) {
      // Make the final shape selectable if needed
      if (tool === 'shape') {
        currentShape.selectable = false
        currentShape.evented = false
      }
      
      setIsDrawingShape(false)
      setCurrentShape(null)

      // Save to history
      const dataURL = canvas.toDataURL()
      addToHistory({
        type: 'draw',
        before: '',
        after: dataURL,
      })

      canvas.renderAll()
    }
  }

  // Handle mouse wheel - for zooming
  const handleMouseWheel = (opt: any) => {
    const evt = opt.e
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    // Only zoom with Ctrl key
    if (!evt.ctrlKey) return

    evt.preventDefault()
    evt.stopPropagation()

    const delta = evt.deltaY
    let newZoom = canvas.getZoom()
    
    newZoom *= 0.999 ** delta

    // Limit zoom range
    if (newZoom > 5) newZoom = 5
    if (newZoom < 0.1) newZoom = 0.1

    // Zoom to mouse point
    const point = new fabric.Point(evt.offsetX, evt.offsetY)
    canvas.zoomToPoint(point, newZoom)
    
    setZoom(newZoom)
  }

  // Handle path created (after drawing)
  const handlePathCreated = (e: any) => {
    setDrawing(false)
    
    if (!fabricCanvasRef.current) return

    const canvas = fabricCanvasRef.current
    
    // Force immediate render
    canvas.renderAll()
    
    // Also render on next frame to ensure visibility
    requestAnimationFrame(() => {
      canvas.renderAll()
    })

    // Save to history
    const dataURL = canvas.toDataURL()
    addToHistory({
      type: 'draw',
      before: '',
      after: dataURL,
    })
  }

  // Handle object modified (move, resize, rotate)
  const handleObjectModified = (e: any) => {
    if (!fabricCanvasRef.current) return

    // Save to history
    const dataURL = fabricCanvasRef.current.toDataURL()
    addToHistory({
      type: 'modify',
      before: '',
      after: dataURL,
    })
  }

  // Clear canvas
  const clearCanvas = () => {
    if (!fabricCanvasRef.current) return
    fabricCanvasRef.current.clear()
    fabricCanvasRef.current.backgroundColor = '#ffffff'
    fabricCanvasRef.current.renderAll()
  }

  // Reset zoom and pan
  const resetView = () => {
    if (!fabricCanvasRef.current) return
    fabricCanvasRef.current.setViewportTransform([1, 0, 0, 1, 0, 0])
    setZoom(1)
  }

  // Zoom in/out buttons
  const handleZoom = (direction: 'in' | 'out') => {
    if (!fabricCanvasRef.current) return
    const canvas = fabricCanvasRef.current
    
    let newZoom = canvas.getZoom()
    newZoom = direction === 'in' ? newZoom * 1.2 : newZoom / 1.2
    
    if (newZoom > 5) newZoom = 5
    if (newZoom < 0.1) newZoom = 0.1
    
    canvas.setZoom(newZoom)
    setZoom(newZoom)
  }

  // Add text to canvas
  const addText = () => {
    if (!fabricCanvasRef.current) return
    const canvas = fabricCanvasRef.current

    const text = new fabric.IText('Click to edit', {
      left: canvas.width! / 2,
      top: canvas.height! / 2,
      fontSize: 24,
      fill: currentColor,
      fontFamily: 'Arial',
    })

    canvas.add(text)
    canvas.setActiveObject(text)
    text.enterEditing()
    canvas.renderAll()

    // Save to history after text is added
    setTimeout(() => {
      const dataURL = canvas.toDataURL()
      addToHistory({
        type: 'draw',
        before: '',
        after: dataURL,
      })
    }, 100)
  }

  // Fill selected object with current color
  const fillObject = () => {
    if (!fabricCanvasRef.current) return
    const canvas = fabricCanvasRef.current
    const activeObject = canvas.getActiveObject()

    if (activeObject) {
      activeObject.set('fill', currentColor)
      canvas.renderAll()

      // Save to history
      const dataURL = canvas.toDataURL()
      addToHistory({
        type: 'modify',
        before: '',
        after: dataURL,
      })
    }
  }

  return (
    <div 
      ref={containerRef}
      className={cn('relative flex items-center justify-center', className)}
    >
      <canvas
        ref={canvasRef}
        className="skaitch-canvas border-2 border-skaitch-purple/20 rounded-lg shadow-lg"
      />
      
      {/* Quick Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-gray-200">
        {/* Shape selector (only show when shape tool is active) */}
        {currentTool === 'shape' && (
          <div className="flex flex-col gap-1 pb-2 border-b border-gray-300">
            <span className="text-xs font-medium text-gray-600">Shape</span>
            <select
              value={shapeType}
              onChange={(e) => setShapeType(e.target.value as any)}
              className="text-xs px-2 py-1 border rounded"
            >
              <option value="rectangle">Rectangle</option>
              <option value="circle">Circle</option>
              <option value="line">Line</option>
            </select>
          </div>
        )}

        {/* Color picker */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium text-gray-600">Color</span>
          <input
            type="color"
            value={currentColor}
            onChange={(e) => setCurrentColor(e.target.value)}
            className="w-12 h-12 cursor-pointer rounded border-2 border-gray-300"
            title="Pick color"
            disabled={currentTool === 'eraser'}
          />
        </div>

        {/* Brush size */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium text-gray-600">Size</span>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-12 h-24"
            title="Brush size"
            style={{ writingMode: 'vertical-lr' }}
          />
          <span className="text-xs text-gray-500">{brushSize}px</span>
        </div>

        <div className="border-t border-gray-300 my-1" />

        {/* Zoom controls */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs font-medium text-gray-600">Zoom</span>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => handleZoom('in')}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
              title="Zoom in"
            >
              +
            </button>
            <span className="text-xs text-center text-gray-600 font-mono">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => handleZoom('out')}
              className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
              title="Zoom out"
            >
              −
            </button>
          </div>
          <button
            onClick={resetView}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 w-full"
            title="Reset view"
          >
            Reset
          </button>
        </div>

        <div className="border-t border-gray-300 my-1" />

        {/* Clear button */}
        <button
          onClick={clearCanvas}
          className="px-3 py-2 text-xs font-medium bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          title="Clear canvas"
        >
          Clear All
        </button>
      </div>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm">
        <div className="font-semibold mb-1">Controls:</div>
        <div>• <kbd className="bg-white/20 px-1 rounded">Space</kbd> + Drag = Pan</div>
        <div>• <kbd className="bg-white/20 px-1 rounded">Ctrl</kbd> + Scroll = Zoom</div>
        {currentTool === 'select' && (
          <div>• Click & drag to select/move objects</div>
        )}
        {currentTool === 'shape' && (
          <div>• Drag to draw {shapeType}</div>
        )}
        {currentTool === 'text' && (
          <div>• Click anywhere to add text</div>
        )}
        {currentTool === 'fill' && (
          <div>• Click object to fill with color</div>
        )}
      </div>
    </div>
  )
}