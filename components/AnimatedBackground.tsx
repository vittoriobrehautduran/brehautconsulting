'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function AnimatedBackground() {
  const mountRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number>()

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.4,
      10000
    )
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      premultipliedAlpha: false 
    })
    renderer.setClearColor(0x000000, 0)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    const canvas = renderer.domElement
    canvas.style.pointerEvents = 'none'
    canvas.style.position = 'fixed'
    canvas.style.top = '0'
    canvas.style.left = '0'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.zIndex = '-1'
    canvas.style.backgroundColor = 'transparent'
    mountRef.current.appendChild(canvas)
    
    // Render once immediately to ensure canvas is cleared and transparent
    renderer.clear()

    camera.position.z = 5

    // Create circular particle texture with soft blur
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 128
      canvas.height = 128
      const context = canvas.getContext('2d')!

      const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)')
      gradient.addColorStop(0.3, 'rgba(246, 200, 255, 0.6)')
      gradient.addColorStop(0.6, 'rgba(228, 200, 255, 0.2)')
      gradient.addColorStop(1, 'rgba(228, 200, 255, 0)')
      
      context.fillStyle = gradient
      context.fillRect(0, 0, 128, 128)
      
      return new THREE.CanvasTexture(canvas)
    }

    const particleTexture = createParticleTexture()

    // Create smooth, subtle particles
    const particleCount = 150
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

    const material = new THREE.PointsMaterial({
      size: 2,
      map: particleTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)

    // Initial render to ensure canvas is properly initialized
    renderer.clear()
    renderer.render(scene, camera)

    let time = 0

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate)

      time += 0.003

      // Smooth particle rotation
      particles.rotation.x += 0.0003
      particles.rotation.y += 0.00045

      // Camera movement
      camera.position.x = Math.sin(time * 0.3) * 0.3
      camera.position.y = Math.cos(time * 0.25) * 0.3
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
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
      style={{ zIndex: -1 }}
    />
  )
}
