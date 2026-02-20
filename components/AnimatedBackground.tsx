'use client'

import { useEffect, useRef, useState } from 'react'

export default function AnimatedBackground() {
  const mountRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number>()
  const [threeLoaded, setThreeLoaded] = useState(false)
  
  // Store Three.js resources in refs so cleanup can access them even if component unmounts during loading
  const resourcesRef = useRef<{
    gridLines?: any[]
    gridLinesWithMaterials?: Array<{
      line: any
      material: any
      baseOpacity: number
      lineY?: number
      lineX?: number
      isHorizontal: boolean
    }>
    networkLines?: any[]
    lightParticles?: any[]
    lightTexture?: any
    renderer?: any
    rendererElement?: HTMLCanvasElement
    resizeTimeout?: NodeJS.Timeout
  }>({})

  // Lazy load Three.js to reduce initial bundle size
  useEffect(() => {
    if (!mountRef.current || typeof window === 'undefined') return

    import('three').then((THREE) => {
    // Detect mobile device and reduced motion preference
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      return
    }

    // Use fixed viewport height to avoid jumps when address bar shows/hides
    const getViewportHeight = () => {
      return Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
      )
    }

    const initialHeight = getViewportHeight()
    const scene = new THREE.Scene()
    
    // Use orthographic camera for 2D grid - better for flat grid patterns
    const aspect = window.innerWidth / initialHeight
    const viewSize = Math.max(window.innerWidth, initialHeight) * 0.8
    const camera = new THREE.OrthographicCamera(
      -viewSize * aspect / 2,
      viewSize * aspect / 2,
      viewSize / 2,
      -viewSize / 2,
      0.1,
      1000
    )
    
    // Optimize renderer settings for mobile
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: !isMobile,
      premultipliedAlpha: false,
      powerPreference: 'high-performance'
    })
    // Transparent background so CSS gradient shows through
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(window.innerWidth, initialHeight)
    // Optimized pixel ratio - use device pixel ratio but cap it for performance
    renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2))
    
    const canvas = renderer.domElement
    canvas.style.pointerEvents = 'none'
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100vh'
    canvas.style.zIndex = '-1'
    canvas.style.backgroundColor = 'transparent'
    resourcesRef.current.renderer = renderer
    resourcesRef.current.rendererElement = canvas
    
    if (mountRef.current) {
    mountRef.current.appendChild(canvas)
    }
    
    renderer.clear()

    // Position camera to see the grid plane
    camera.position.z = 100

    // Create subtle grid and network lines - more spaced out
    const gridLines: any[] = []
    const networkLines: any[] = []
    const gridSize = isMobile ? 120 : 180
    // Calculate grid extent to match camera view
    const gridExtentX = viewSize * aspect
    const gridExtentY = viewSize
    const gridStepsX = Math.floor(gridExtentX / gridSize)
    const gridStepsY = Math.floor(gridExtentY / gridSize)
    
    // Subtle color with blue-purple tint, adjust brightness for mobile
    const lineColor = isMobile 
      ? new THREE.Color(0.55, 0.6, 0.75) // Less bright for mobile
      : new THREE.Color(0.7, 0.75, 0.9) // Brighter for desktop
    const gridOpacity = isMobile ? 0.25 : 0.35 // Lower opacity for mobile
    const networkOpacity = 0.15 // Slightly lower for network connections

    // Create grid lines material - linewidth doesn't work in WebGL, removed
    // Store base opacity for dynamic updates
    const baseGridOpacity = gridOpacity
    const gridMaterial = new THREE.LineBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: gridOpacity
    })
    
    // Store grid lines with their materials for dynamic opacity updates
    const gridLinesWithMaterials: Array<{
      line: any
      material: any
      baseOpacity: number
      lineY?: number
      lineX?: number
      isHorizontal: boolean
    }> = []

    // Create network lines material
    const networkMaterial = new THREE.LineBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: networkOpacity
    })


    // Create horizontal grid lines
    for (let i = -gridStepsY; i <= gridStepsY; i++) {
      const y = i * gridSize
      const points = [
        new THREE.Vector3(-gridExtentX, y, 0),
        new THREE.Vector3(gridExtentX, y, 0)
      ]
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      // Create new material instance for each line to ensure independent control
      const lineMaterial = new THREE.LineBasicMaterial({
        color: lineColor.clone(),
        transparent: true,
        opacity: baseGridOpacity
      })
      const line = new THREE.Line(geometry, lineMaterial)
      scene.add(line)
      gridLines.push(line)
      gridLinesWithMaterials.push({ 
        line, 
        material: lineMaterial, 
        baseOpacity: baseGridOpacity,
        lineY: y,
        isHorizontal: true
      })
    }

    // Create vertical grid lines
    for (let i = -gridStepsX; i <= gridStepsX; i++) {
      const x = i * gridSize
      const points = [
        new THREE.Vector3(x, -gridExtentY, 0),
        new THREE.Vector3(x, gridExtentY, 0)
      ]
      const geometry = new THREE.BufferGeometry().setFromPoints(points)
      // Create new material instance for each line to ensure independent control
      const lineMaterial = new THREE.LineBasicMaterial({
        color: lineColor.clone(),
        transparent: true,
        opacity: baseGridOpacity
      })
      const line = new THREE.Line(geometry, lineMaterial)
      scene.add(line)
      gridLines.push(line)
      gridLinesWithMaterials.push({ 
        line, 
        material: lineMaterial, 
        baseOpacity: baseGridOpacity,
        lineX: x,
        isHorizontal: false
      })
    }

    // Create network/system architecture connecting lines
    // Connect some grid points to create a subtle network pattern
    const networkPoints: any[] = []
    const networkDensity = isMobile ? 0.15 : 0.2 // Fewer connections on mobile
    
    for (let x = -gridStepsX; x <= gridStepsX; x += 2) {
      for (let y = -gridStepsY; y <= gridStepsY; y += 2) {
        if (Math.random() < networkDensity) {
          networkPoints.push(new THREE.Vector3(x * gridSize, y * gridSize, 0))
        }
      }
    }

    // Connect nearby points to create system architecture feel
    for (let i = 0; i < networkPoints.length; i++) {
      const point = networkPoints[i]
      const connections: any[] = []
      
      for (let j = i + 1; j < networkPoints.length; j++) {
        const otherPoint = networkPoints[j]
        const distance = point.distanceTo(otherPoint)
        const maxConnectionDistance = gridSize * 3
        
        if (distance <= maxConnectionDistance && Math.random() < 0.3) {
          connections.push(otherPoint)
        }
      }
      
      // Limit connections per point for cleaner look
      connections.slice(0, 2).forEach(connectedPoint => {
        const geometry = new THREE.BufferGeometry().setFromPoints([point, connectedPoint])
        const line = new THREE.Line(geometry, networkMaterial)
        scene.add(line)
        networkLines.push(line)
      })
    }

    resourcesRef.current.gridLines = gridLines
    resourcesRef.current.gridLinesWithMaterials = gridLinesWithMaterials
    resourcesRef.current.networkLines = networkLines

    // Position camera to look at grid center - static position for stability
    camera.position.set(0, 0, 100)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()

    renderer.clear()
    renderer.render(scene, camera)

    let time = 0
    let lastFrameTime = performance.now()
    // Adaptive frame rate - try for 60fps but allow 30fps if needed
    const targetFrameTime = isMobile ? 20 : 16

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      // Adaptive frame skipping - only skip if we're ahead of schedule
      const currentTime = performance.now()
      const deltaTime = currentTime - lastFrameTime
      if (deltaTime < targetFrameTime) {
        return
      }
      lastFrameTime = currentTime

      // Update grid lines with subtle pulsating effect - no lights, just time-based pulsing
      const delta = (deltaTime / 1000) // Normalize to seconds
      const pulseSpeed = 2.5 // Speed of pulsing effect
      const pulseAmount = 0.3 // Pulse variation (30%)
      
      if (resourcesRef.current.gridLinesWithMaterials) {
        resourcesRef.current.gridLinesWithMaterials.forEach((gridLineData: any, index: number) => {
          if (!gridLineData.material) return
          
          // Create pulsing based on line position and time
          // Each line pulses slightly out of phase for a wave-like effect
          const linePhase = (gridLineData.isHorizontal ? gridLineData.lineY : gridLineData.lineX) * 0.01
          const pulseValue = Math.sin(time * pulseSpeed + linePhase + index * 0.1) // Range: -1 to 1
          const pulse = pulseValue * pulseAmount + 1.0 // Range: 0.7 to 1.3
          
          // Apply brightness variation - pulse directly affects opacity
          const brightness = pulse // pulse ranges from 0.7 to 1.3
          const newOpacity = Math.min(1.0, gridLineData.baseOpacity * brightness)
          gridLineData.material.opacity = newOpacity
          
          // Color shift - make lines whiter when brighter, less intense on mobile
          const whitenessMultiplier = isMobile ? 0.3 : 0.5 // Less whiteness on mobile
          const whiteness = Math.max(0, pulseValue) * whitenessMultiplier
          const baseR = isMobile ? 0.55 : 0.7
          const baseG = isMobile ? 0.6 : 0.75
          const baseB = isMobile ? 0.75 : 0.9
          gridLineData.material.color.setRGB(
            Math.min(1.0, baseR + whiteness),
            Math.min(1.0, baseG + whiteness),
            Math.min(1.0, baseB + whiteness * 0.3) // Keep some blue tint but allow more whiteness
          )
        })
      }

      time += delta

      // Keep camera static for now - no movement to avoid view issues
      // Grid will be static and always visible
      camera.position.set(0, 0, 100)
      camera.lookAt(0, 0, 0)

      renderer.render(scene, camera)
    }

    animate()

    // Only resize on orientation change, not on scroll (which changes innerHeight on mobile)
    let lastWidth = window.innerWidth

    const handleResize = () => {
      const currentWidth = window.innerWidth
      const widthDiff = Math.abs(currentWidth - lastWidth)

      if (resourcesRef.current.resizeTimeout) {
        clearTimeout(resourcesRef.current.resizeTimeout)
      }

      resourcesRef.current.resizeTimeout = setTimeout(() => {
        // Only resize on significant width change (orientation change)
        if (widthDiff > 20 && resourcesRef.current.renderer) {
          const newHeight = getViewportHeight()
          const newAspect = currentWidth / newHeight
          const newViewSize = Math.max(currentWidth, newHeight) * 0.8
          camera.left = -newViewSize * newAspect / 2
          camera.right = newViewSize * newAspect / 2
          camera.top = newViewSize / 2
          camera.bottom = -newViewSize / 2
          camera.updateProjectionMatrix()
          resourcesRef.current.renderer.setSize(currentWidth, newHeight)
          lastWidth = currentWidth
        }
      }, 200)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    setThreeLoaded(true)

    // Cleanup function - can access resources via ref even if unmounted during loading
    return () => {
      window.removeEventListener('resize', handleResize)
      if (resourcesRef.current.resizeTimeout) {
        clearTimeout(resourcesRef.current.resizeTimeout)
      }
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      if (mountRef.current && resourcesRef.current.rendererElement) {
        try {
          mountRef.current.removeChild(resourcesRef.current.rendererElement)
        } catch (e) {
          // Element may have already been removed
        }
      }
      // Dispose of all geometries and materials
      if (resourcesRef.current.gridLines) {
        resourcesRef.current.gridLines.forEach(line => {
          if (line.geometry) line.geometry.dispose()
          if (line.material) line.material.dispose()
        })
      }
      if (resourcesRef.current.networkLines) {
        resourcesRef.current.networkLines.forEach(line => {
          if (line.geometry) line.geometry.dispose()
          if (line.material) line.material.dispose()
        })
      }
      if (resourcesRef.current.renderer) {
        resourcesRef.current.renderer.dispose()
    }
      // Clear refs
      resourcesRef.current = {}
    }
    }).catch((error) => {
      console.error('Failed to load Three.js:', error)
      // Silently fail - background animation is not critical
    })
  }, [])

  return (
    <>
      {/* Enhanced gradient background with depth */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: -2,
          height: '100vh',
          background: 'linear-gradient(135deg, #030507 0%, #0a0d12 25%, #0d1117 50%, #0a0d12 75%, #030507 100%)'
        }}
      />
      <div
        ref={mountRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: -1, height: '100vh' }}
      />
    </>
  )
}
