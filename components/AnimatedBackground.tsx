'use client'

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 md:fixed pointer-events-none -z-10">
      {/* Base gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0a0a0f 0%, #0f1117 50%, #0a0a0f 100%)',
        }}
      />
      
      {/* Subtle animated gradient overlay */}
      <div
        className="absolute inset-0 opacity-20 md:opacity-30 md:animate-pulse-slow"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(ellipse at bottom, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
        }}
      />
      
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  )
}
