'use client'

import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const blobRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const target = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // window is only available client-side — initialize here, not in useRef()
    pos.current.x = window.innerWidth / 2
    pos.current.y = window.innerHeight / 2
    target.current.x = window.innerWidth / 2
    target.current.y = window.innerHeight / 2

    const onMouseMove = (e: MouseEvent) => {
      target.current.x = e.clientX
      target.current.y = e.clientY
    }

    window.addEventListener('mousemove', onMouseMove)

    const animate = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.08
      pos.current.y += (target.current.y - pos.current.y) * 0.08

      if (blobRef.current) {
        blobRef.current.style.transform =
          `translate(${pos.current.x - 300}px, ${pos.current.y - 300}px)`
      }

      requestAnimationFrame(animate)
    }

    const raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={blobRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(240,135,82,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
