import { useEffect, useMemo, useState } from 'react'

const anchors = [
  { x: 8, y: 16, label: 'pi' },
  { x: 18, y: 38, label: 'f(x)' },
  { x: 29, y: 24, label: 'theta' },
  { x: 39, y: 52, label: 'sqrt' },
  { x: 52, y: 20, label: 'sin' },
  { x: 61, y: 42, label: 'Sigma' },
  { x: 73, y: 28, label: 'x+y' },
  { x: 84, y: 50, label: 'y=mx+c' },
  { x: 16, y: 72, label: 'A' },
  { x: 31, y: 82, label: 'r^2' },
  { x: 48, y: 70, label: 'tan' },
  { x: 66, y: 78, label: 'Delta' },
  { x: 82, y: 70, label: 'n!' },
]

const edges = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [3, 5],
  [4, 5],
  [4, 6],
  [5, 7],
  [1, 8],
  [8, 9],
  [9, 10],
  [10, 11],
  [11, 12],
  [5, 10],
  [6, 12],
  [2, 3],
] as const

const formulas = [
  { text: 'a^2 + b^2 = c^2', top: '14%', left: '58%', delay: '0s' },
  { text: 'lim x->a', top: '24%', left: '10%', delay: '1.3s' },
  { text: 'int f(x)dx', top: '66%', left: '74%', delay: '2.1s' },
  { text: 'P(A) = m/n', top: '72%', left: '24%', delay: '0.7s' },
]

const triangles = Array.from({ length: 7 }, (_, index) => ({
  id: index,
  size: 88 + index * 20,
  top: `${4 + index * 12}%`,
  left: `${index % 2 === 0 ? 2 + index * 9 : 60 + index * 2}%`,
  delay: `${index * 0.42}s`,
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

  const nodes = useMemo(
    () =>
      anchors.map((anchor, index) => {
        const dx = mouse.x * 100 - anchor.x
        const dy = mouse.y * 100 - anchor.y
        const distance = Math.hypot(dx, dy)
        const force = Math.max(0, 1 - distance / 28)

        return {
          ...anchor,
          x: anchor.x - dx * 0.045 * force,
          y: anchor.y - dy * 0.045 * force,
          glow: 0.3 + force * 0.7,
          size: index % 3 === 0 ? 8 : 6,
        }
      }),
    [mouse],
  )

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0 section-grid opacity-35 transition-transform duration-500"
        style={{
          transform: `translate(${(mouse.x - 0.5) * 20}px, ${(mouse.y - 0.5) * 20}px)`,
        }}
      />
      <div className="absolute left-[18%] top-[10%] h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-[130px]" />
      <div className="absolute right-[8%] top-[18%] h-[26rem] w-[26rem] rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute bottom-[-6rem] left-[42%] h-[22rem] w-[22rem] rounded-full bg-violet-500/12 blur-[120px]" />

      <svg className="absolute inset-0 h-full w-full opacity-90" viewBox="0 0 100 100" preserveAspectRatio="none">
        {edges.map(([startIndex, endIndex], edgeIndex) => {
          const start = nodes[startIndex]
          const end = nodes[endIndex]
          const mx = mouse.x * 100
          const my = mouse.y * 100
          const midX = (start.x + end.x) / 2
          const midY = (start.y + end.y) / 2
          const curveX = midX + (mx - midX) * 0.08
          const curveY = midY + (my - midY) * 0.08

          return (
            <path
              key={`${startIndex}-${endIndex}`}
              d={`M ${start.x} ${start.y} Q ${curveX} ${curveY} ${end.x} ${end.y}`}
              className="math-line"
              style={{
                opacity: 0.18 + ((edgeIndex % 5) + 1) * 0.06,
              }}
            />
          )
        })}

        {nodes.map((node, index) => (
          <g key={node.label} transform={`translate(${node.x} ${node.y})`}>
            <circle
              r={node.size}
              className="math-node-halo"
              style={{ opacity: Math.min(0.55, node.glow * 0.28) }}
            />
            <circle r={node.size / 3} className="math-node-core" />
            <text
              x={index % 2 === 0 ? 1.8 : -1.8}
              y={index % 2 === 0 ? -1.6 : 2.4}
              textAnchor={index % 2 === 0 ? 'start' : 'end'}
              className="math-label"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

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

      {Array.from({ length: 22 }, (_, index) => (
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

      {formulas.map((formula) => (
        <div
          key={formula.text}
          className="formula-drift absolute rounded-full px-3 py-1.5"
          style={{
            top: formula.top,
            left: formula.left,
            animationDelay: formula.delay,
            transform: `translate(${(mouse.x - 0.5) * 14}px, ${(mouse.y - 0.5) * 14}px)`,
          }}
        >
          {formula.text}
        </div>
      ))}
    </div>
  )
}
