'use client'

import { useEffect, useRef, useState } from 'react'

export default function AnimatedBackground() {
  const mountRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number>()
  const [threeLoaded, setThreeLoaded] = useState(false)
  
  // Store Three.js resources in refs so cleanup can access them even if component unmounts during loading
  const resourcesRef = useRef<{
    geometry?: any
    material?: any
    particleTexture?: any
    renderer?: any
    rendererElement?: HTMLCanvasElement
    resizeTimeout?: NodeJS.Timeout
  }>({})

  // Lazy load Three.js to reduce initial bundle size
  useEffect(() => {
    if (!mountRef.current) return

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
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / initialHeight,
      0.4,
      10000
    )
    
    // Optimize renderer settings for mobile
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: !isMobile,
      premultipliedAlpha: false,
      powerPreference: 'high-performance'
    })
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

    camera.position.z = 5

    const createParticleTexture = () => {
      const canvas = document.createElement('canvas')
      // Smaller texture on mobile
      const size = isMobile ? 64 : 128
      canvas.width = size
      canvas.height = size
      const context = canvas.getContext('2d')!

      const gradient = context.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
      gradient.addColorStop(0.3, 'rgba(246, 200, 255, 0.6)')
      gradient.addColorStop(0.6, 'rgba(228, 200, 255, 0.2)')
      gradient.addColorStop(1, 'rgba(228, 200, 255, 0)')
      
      context.fillStyle = gradient
      context.fillRect(0, 0, size, size)
      
      return new THREE.CanvasTexture(canvas)
    }

      const particleTexture = createParticleTexture()
      resourcesRef.current.particleTexture = particleTexture

    // Optimized particle count - enough for smooth animation but not too many
    const particleCount = isMobile ? 80 : 150
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30
      positions[i + 1] = (Math.random() - 0.5) * 30
      positions[i + 2] = (Math.random() - 0.5) * 20

      const color = new THREE.Color()
      color.setHSL(0.55 + Math.random() * 0.1, 0.4, 0.4 + Math.random() * 0.2)
      colors[i] = color.r
      colors[i + 1] = color.g
      colors[i + 2] = color.b
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    resourcesRef.current.geometry = geometry

    // Use NormalBlending on mobile for better performance
    const material = new THREE.PointsMaterial({
      size: isMobile ? 1.5 : 2,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: isMobile ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
    })
    resourcesRef.current.material = material

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    renderer.clear()
    renderer.render(scene, camera)

    let time = 0
    let lastFrameTime = performance.now()
    // Adaptive frame rate - try for 60fps but allow 30fps if needed
    const targetFrameTime = isMobile ? 20 : 16 // Allow up to 50fps on mobile, 60fps on desktop

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      // Adaptive frame skipping - only skip if we're ahead of schedule
      const currentTime = performance.now()
      const deltaTime = currentTime - lastFrameTime
      if (deltaTime < targetFrameTime) {
        return
      }
      lastFrameTime = currentTime

      time += isMobile ? 0.005 : 0.003 // Faster time increment on mobile for smoother animation

      // Balanced rotation speed - faster on mobile but still smooth
      const rotationSpeed = isMobile ? 0.0005 : 0.0003
      particles.rotation.x += rotationSpeed
      particles.rotation.y += rotationSpeed * 1.5

      // Faster camera movement on mobile for better visual feedback
      const cameraSpeed = isMobile ? 0.4 : 0.3
      camera.position.x = Math.sin(time * cameraSpeed) * 0.3
      camera.position.y = Math.cos(time * (cameraSpeed * 0.83)) * 0.3
      camera.lookAt(scene.position)

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
          camera.aspect = currentWidth / newHeight
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
      if (resourcesRef.current.geometry) {
        resourcesRef.current.geometry.dispose()
      }
      if (resourcesRef.current.material) {
        resourcesRef.current.material.dispose()
      }
      if (resourcesRef.current.particleTexture) {
        resourcesRef.current.particleTexture.dispose()
      }
      if (resourcesRef.current.renderer) {
        resourcesRef.current.renderer.dispose()
      }
      // Clear refs
      resourcesRef.current = {}
    }
    })
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1, height: '100vh' }}
    />
  )
}
