"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Pencil, Eraser, Trash2, Undo, Redo } from "lucide-react"

// Add a new interface for the component props
interface WhiteboardProps {
  taskStatusId?: number;
}

export default function Whiteboard({ taskStatusId }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gridCanvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [gridCtx, setGridCtx] = useState<CanvasRenderingContext2D | null>(null)
  const [drawing, setDrawing] = useState(false)
  const [tool, setTool] = useState("pencil")
  const [color, setColor] = useState("#000000")
  const [lineWidth, setLineWidth] = useState([3])
  const [prevPos, setPrevPos] = useState({ x: 0, y: 0 })
  const [canvasHistory, setCanvasHistory] = useState<ImageData[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const colors = [
    "#000000", // Black
    "#4b5563", // Gray
    "#ef4444", // Red
    "#f97316", // Orange
    "#eab308", // Yellow
    "#22c55e", // Green
    "#3b82f6", // Blue
    "#8b5cf6", // Purple
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    const gridCanvas = gridCanvasRef.current
    const container = containerRef.current
    if (!canvas || !gridCanvas || !container) return

    const context = canvas.getContext("2d", { willReadFrequently: true })
    const gridContext = gridCanvas.getContext("2d")
    if (!context || !gridContext) return

    // Set canvas size to match parent
    const resizeCanvas = () => {
      // Get the actual dimensions of the container
      const rect = container.getBoundingClientRect()
      
      // Create a temporary canvas to hold the current drawing
      const tempCanvas = document.createElement('canvas')
      const tempCtx = tempCanvas.getContext('2d')
      
      if (tempCtx && canvas.width > 0 && canvas.height > 0) {
        // Copy the entire current canvas to the temp canvas
        tempCanvas.width = canvas.width
        tempCanvas.height = canvas.height
        tempCtx.drawImage(canvas, 0, 0)
      }
      
      // Resize both canvases
      canvas.width = rect.width
      gridCanvas.width = rect.width
      canvas.height = rect.height
      gridCanvas.height = rect.height

      // Clear main canvas with transparent background
      context.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw grid on the grid canvas
      drawGrid(gridContext, gridCanvas.width, gridCanvas.height)
      
      // Restore drawing from the temp canvas
      if (tempCtx && tempCanvas.width > 0 && tempCanvas.height > 0) {
        context.drawImage(tempCanvas, 0, 0)
      }
    }

    // Initial resize
    resizeCanvas()

    // Set up resize observer for more reliable size detection
    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas()
    })

    resizeObserver.observe(container)

    // Also keep the window resize listener for safety
    window.addEventListener("resize", resizeCanvas)

    setCtx(context)
    setGridCtx(gridContext)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // Save canvas state for undo/redo
  const saveCanvasState = () => {
    if (!ctx || !canvasRef.current) return
    
    try {
      const currentState = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
      
      // If we're not at the end of the history, remove future states
      if (historyIndex < canvasHistory.length - 1) {
        setCanvasHistory(prev => prev.slice(0, historyIndex + 1))
      }
      
      setCanvasHistory(prev => [...prev, currentState])
      setHistoryIndex(prev => prev + 1)
    } catch (e) {
      console.error("Failed to save canvas state", e)
    }
  }

  const undo = () => {
    if (!ctx || !canvasRef.current || historyIndex <= 0) return
    
    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)
    
    // Clear canvas
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    
    // Draw grid first
    drawGrid(ctx, canvasRef.current.width, canvasRef.current.height)
    
    // Restore previous state
    ctx.putImageData(canvasHistory[newIndex], 0, 0)
  }

  const redo = () => {
    if (!ctx || !canvasRef.current || historyIndex >= canvasHistory.length - 1) return
    
    const newIndex = historyIndex + 1
    setHistoryIndex(newIndex)
    
    // Clear canvas
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    
    // Draw grid first
    drawGrid(ctx, canvasRef.current.width, canvasRef.current.height)
    
    // Restore next state
    ctx.putImageData(canvasHistory[newIndex], 0, 0)
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!ctx) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Save the canvas state before starting a new drawing action
    saveCanvasState()

    ctx.beginPath()
    ctx.moveTo(x, y)
    setPrevPos({ x, y })
    setDrawing(true)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !ctx || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (tool === "eraser") {
      // Use destination-out composite operation for eraser
      ctx.globalCompositeOperation = "destination-out"
      ctx.lineWidth = lineWidth[0] * 2 // Make eraser slightly larger
    } else {
      ctx.globalCompositeOperation = "source-over"
      ctx.strokeStyle = color
      ctx.lineWidth = lineWidth[0]
    }
    
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // Improved line smoothing for a more tldraw-like feel
    const currentPos = { x, y };
    const midPoint = {
      x: (prevPos.x + currentPos.x) / 2,
      y: (prevPos.y + currentPos.y) / 2
    };

    ctx.quadraticCurveTo(prevPos.x, prevPos.y, midPoint.x, midPoint.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(midPoint.x, midPoint.y);
    
    setPrevPos(currentPos);
  }

  const stopDrawing = () => {
    if (ctx) {
      ctx.closePath()
      // Reset composite operation
      ctx.globalCompositeOperation = "source-over"
    }
    setDrawing(false)
  }

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return
    
    // Save current state before clearing
    saveCanvasState()
    
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }

  // Add touch support
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!ctx) return
    e.preventDefault()

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    // Save the canvas state before starting a new drawing action
    saveCanvasState()

    ctx.beginPath()
    ctx.moveTo(x, y)
    setPrevPos({ x, y })
    setDrawing(true)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!drawing || !ctx || !canvasRef.current) return
    e.preventDefault()

    const rect = canvasRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    if (tool === "eraser") {
      // Use destination-out composite operation for eraser
      ctx.globalCompositeOperation = "destination-out"
      ctx.lineWidth = lineWidth[0] * 2 // Make eraser slightly larger
    } else {
      ctx.globalCompositeOperation = "source-over"
      ctx.strokeStyle = color
      ctx.lineWidth = lineWidth[0]
    }
    
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    if (ctx) {
      ctx.closePath()
      // Reset composite operation
      ctx.globalCompositeOperation = "source-over"
    }
    setDrawing(false)
  }

  // Add a new function to export the canvas as PNG
  const exportCanvasAsPng = () => {
    if (!canvasRef.current || !gridCanvasRef.current) return null;
    
    // Create a temporary canvas to combine grid and drawing
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    if (!tempCtx) return null;
    
    // Set the temp canvas to the same dimensions
    tempCanvas.width = canvasRef.current.width;
    tempCanvas.height = canvasRef.current.height;
    
    // First draw the grid (background)
    tempCtx.drawImage(gridCanvasRef.current, 0, 0);
    
    // Then draw the user's drawing on top
    tempCtx.drawImage(canvasRef.current, 0, 0);
    
    // Convert to data URL (PNG format)
    const dataUrl = tempCanvas.toDataURL('image/png');
    
    return dataUrl;
  };

  // Updated grid drawing function to take context and dimensions as parameters
  const drawGrid = (context: CanvasRenderingContext2D, width: number, height: number) => {
    if (!context) return

    // Clear the grid canvas first
    context.clearRect(0, 0, width, height);
    
    // Fill with white background
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    // Save the current drawing state
    context.save();

    // Set grid line style
    const gridSize = 20; // Grid cell size in pixels
    
    // Draw major grid lines (every 5 cells)
    context.strokeStyle = "#e2e8f0"; // Slightly darker for major lines
    context.lineWidth = 1; // Increased from 0.8 for better visibility on mobile
    
    // Ensure we start from 0 and cover the entire canvas
    for (let x = 0; x <= width; x += gridSize * 5) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }

    for (let y = 0; y <= height; y += gridSize * 5) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }
    
    // Draw minor grid lines
    context.strokeStyle = "#f1f5f9"; // Very light gray for minor lines
    context.lineWidth = 0.7; // Increased from 0.5 for better visibility on mobile
    
    for (let x = 0; x <= width; x += gridSize) {
      // Skip major lines
      if (x % (gridSize * 5) !== 0) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
    }

    for (let y = 0; y <= height; y += gridSize) {
      // Skip major lines
      if (y % (gridSize * 5) !== 0) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }
    }

    // Restore the drawing state
    context.restore();
  }

  // Expose the export function to parent components
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // @ts-ignore - Adding a method to the window for external access
      window.exportWhiteboardCanvas = exportCanvasAsPng;
    }
  }, []);

  useEffect(() => {
    if (ctx && canvasRef.current) {
      // Initialize with a blank state
      const initialState = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      setCanvasHistory([initialState]);
      setHistoryIndex(0);
    }
    
    if (gridCtx && gridCanvasRef.current) {
      // Draw the initial grid
      drawGrid(gridCtx, gridCanvasRef.current.width, gridCanvasRef.current.height);
    }
  }, [ctx, gridCtx]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 border-b flex flex-wrap items-center gap-2 bg-gray-50">
        <div className="flex items-center gap-1">
          <Button
            variant={tool === "pencil" ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setTool("pencil")}
            title="Pencil"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant={tool === "eraser" ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => setTool("eraser")}
            title="Eraser"
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>

        <div className="h-8 border-l mx-1 hidden sm:block"></div>

        <div className="flex items-center gap-1 flex-wrap">
          {colors.map((c) => (
            <div
              key={c}
              className={`h-5 w-5 sm:h-6 sm:w-6 rounded-full cursor-pointer border ${color === c ? "ring-2 ring-offset-1 sm:ring-offset-2 ring-blue-500" : "border-gray-200"}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>

        <div className="h-8 border-l mx-1 hidden sm:block"></div>

        <div className="w-24 sm:w-32 flex items-center gap-1 sm:gap-2">
          <span className="text-xs text-gray-500 hidden xs:inline">Thickness:</span>
          <Slider value={lineWidth} min={1} max={10} step={1} onValueChange={setLineWidth} />
        </div>

        <div className="h-8 border-l mx-1 hidden sm:block"></div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={undo}
            disabled={historyIndex <= 0}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={redo}
            disabled={historyIndex >= canvasHistory.length - 1}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="outline" size="sm" className="ml-auto" onClick={clearCanvas}>
          <Trash2 className="h-4 w-4 mr-1" /> 
          <span className="hidden sm:inline">Clear</span>
        </Button>
      </div>

      <div className="flex-1 relative bg-white" ref={containerRef}>
        {/* Grid canvas (background layer) */}
        <canvas
          ref={gridCanvasRef}
          className="absolute inset-0 touch-none"
          style={{ width: "100%", height: "100%" }}
        />
        
        {/* Drawing canvas (foreground layer) */}
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="absolute inset-0 touch-none"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </div>
  )
}

