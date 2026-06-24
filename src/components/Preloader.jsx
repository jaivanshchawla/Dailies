import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { AppleHelloEffectHindi } from './AppleHelloEffectHindi'

export default function Preloader({ isComplete, onDone }) {
  const textRef = useRef(null)
  const overlayRef = useRef(null)
  const tlRef = useRef(null)

  useEffect(() => {
    if (!isComplete || tlRef.current) return

    // Safety: if refs are null (unmounted), skip animation
    if (!textRef.current || !overlayRef.current) {
      console.debug('[Preloader] refs null, skipping animation')
      onDone?.()
      return
    }

    tlRef.current = gsap.timeline({
      onComplete: () => onDone?.(),
    })

    tlRef.current
      .to(textRef.current, {
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

    return () => {
      if (tlRef.current) {
        console.debug('[Preloader] killing GSAP timeline on unmount')
        tlRef.current.kill()
        tlRef.current = null
      }
    }
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
