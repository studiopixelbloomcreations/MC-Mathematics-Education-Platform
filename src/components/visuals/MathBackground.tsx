import { useEffect, useState } from 'react'

const vectors = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  top: `${10 + index * 8}%`,
  left: `${index % 2 === 0 ? 8 + index * 8 : 50 + index * 3}%`,
  width: 140 + index * 18,
  rotate: index % 2 === 0 ? 18 : -24,
  delay: index * 0.18,
}))

const triangles = Array.from({ length: 8 }, (_, index) => ({
  id: index,
  size: 80 + index * 18,
  top: `${8 + index * 10}%`,
  left: `${index % 2 === 0 ? 6 + index * 9 : 55 + index * 3}%`,
  delay: `${index * 0.35}s`,
}))

export function MathBackground() {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 })

  useEffect(() => {
    function handleMove(event: MouseEvent) {
      setMouse({
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      })
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 section-grid opacity-35 transition-transform duration-500"
        style={{
          transform: `translate(${(mouse.x - 0.5) * 24}px, ${(mouse.y - 0.5) * 24}px)`,
        }}
      />
      <div className="absolute left-1/2 top-24 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-cyan-400/12 blur-[130px]" />
      <div className="absolute bottom-[-8rem] right-[-8rem] h-[26rem] w-[26rem] rounded-full bg-violet-500/14 blur-[120px]" />

      {triangles.map((triangle) => (
        <div
          key={triangle.id}
          className="triangle-drift absolute"
          style={{
            top: triangle.top,
            left: triangle.left,
            width: triangle.size,
            height: triangle.size,
            animationDelay: triangle.delay,
          }}
        />
      ))}

      {vectors.map((vector) => (
        <div
          key={vector.id}
          className="vector-pulse absolute h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent"
          style={{
            top: vector.top,
            left: vector.left,
            width: vector.width,
            transform: `rotate(${vector.rotate}deg)`,
            animationDelay: `${vector.delay}s`,
            animationDuration: `${4.8 + vector.id}s`,
          }}
        />
      ))}

      {Array.from({ length: 24 }, (_, index) => (
        <div
          key={index}
          className="particle-float absolute rounded-full bg-cyan-300/55"
          style={{
            width: index % 3 === 0 ? 4 : 2,
            height: index % 3 === 0 ? 4 : 2,
            top: `${10 + (index * 13) % 82}%`,
            left: `${4 + (index * 17) % 90}%`,
            animationDelay: `${index * 0.15}s`,
            animationDuration: `${5 + index * 0.28}s`,
          }}
        />
      ))}
    </div>
  )
}
