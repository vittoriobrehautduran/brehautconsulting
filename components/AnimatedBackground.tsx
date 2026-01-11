'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function AnimatedBackground() {
  const mountRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number>()

  useEffect(() => {
    if (!mountRef.current) return

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
    // Lower pixel ratio on mobile for better performance
    renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 1) : Math.min(window.devicePixelRatio, 2))
    
    const canvas = renderer.domElement
    canvas.style.pointerEvents = 'none'
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100vh'
    canvas.style.zIndex = '-1'
    canvas.style.backgroundColor = 'transparent'
    mountRef.current.appendChild(canvas)
    
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

    // Significantly reduce particle count on mobile
    const particleCount = isMobile ? 60 : 150
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

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    renderer.clear()
    renderer.render(scene, camera)

    let time = 0
    let lastFrameTime = performance.now()
    // Frame skipping on mobile - render every other frame for 30fps instead of 60fps
    const targetFrameTime = isMobile ? 33 : 16 // 30fps on mobile, 60fps on desktop

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      // Frame skipping for mobile
      const currentTime = performance.now()
      const deltaTime = currentTime - lastFrameTime
      if (deltaTime < targetFrameTime) {
        return
      }
      lastFrameTime = currentTime

      time += 0.003

      // Slower, smoother rotation on mobile
      const rotationSpeed = isMobile ? 0.0002 : 0.0003
      particles.rotation.x += rotationSpeed
      particles.rotation.y += rotationSpeed * 1.5

      // Slower camera movement on mobile
      const cameraSpeed = isMobile ? 0.2 : 0.3
      camera.position.x = Math.sin(time * cameraSpeed) * 0.3
      camera.position.y = Math.cos(time * (cameraSpeed * 0.83)) * 0.3
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    animate()

    // Only resize on orientation change, not on scroll (which changes innerHeight on mobile)
    let resizeTimeout: NodeJS.Timeout | null = null
    let lastWidth = window.innerWidth

    const handleResize = () => {
      const currentWidth = window.innerWidth
      const widthDiff = Math.abs(currentWidth - lastWidth)

      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }

      resizeTimeout = setTimeout(() => {
        // Only resize on significant width change (orientation change)
        if (widthDiff > 20) {
          const newHeight = getViewportHeight()
          camera.aspect = currentWidth / newHeight
          camera.updateProjectionMatrix()
          renderer.setSize(currentWidth, newHeight)
          lastWidth = currentWidth
        }
      }, 200)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    const mountElement = mountRef.current
    const rendererElement = renderer.domElement

    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      if (mountElement && rendererElement) {
        mountElement.removeChild(rendererElement)
      }
      geometry.dispose()
      material.dispose()
      particleTexture.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1, height: '100vh' }}
    />
  )
}
