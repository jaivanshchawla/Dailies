import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { AppleHelloEffectHindi } from './AppleHelloEffectHindi'

export default function Preloader({ isComplete, onDone }) {
  const textRef = useRef(null)
  const overlayRef = useRef(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isComplete || hasAnimated.current) return
    hasAnimated.current = true

    const tl = gsap.timeline({
      onComplete: () => onDone?.(),
    })

    tl.to(textRef.current, {
      scale: 1.08,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in',
    })
      .to(
        overlayRef.current,
        {
          yPercent: -100,
          duration: 0.75,
          ease: 'power4.inOut',
        },
        '-=0.15'
      )

    return () => tl.kill()
  }, [isComplete])

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}
    >
      <div ref={textRef}>
        <AppleHelloEffectHindi
          durationScale={1}
          style={{
            width: 'min(80vw, 400px)',
            height: 'auto',
          }}
          className="text-foreground"
        />
      </div>
    </div>
  )
}
