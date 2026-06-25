import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { AppleHelloEffectHindi } from './AppleHelloEffectHindi'

export default function Preloader({ isComplete, dataReady, onDone }) {
  const textRef = useRef(null)
  const overlayRef = useRef(null)
  const tlRef = useRef(null)
  const [introComplete, setIntroComplete] = useState(false)
  const [animationDone, setAnimationDone] = useState(false)

  const handleIntroComplete = () => setIntroComplete(true)

  // Start GSAP exit animation only when BOTH token is ready AND intro animation finished
  useEffect(() => {
    if (!isComplete || !introComplete || tlRef.current) return

    if (!textRef.current || !overlayRef.current) {
      setAnimationDone(true)
      return
    }

    tlRef.current = gsap.timeline({
      onComplete: () => setAnimationDone(true),
    })

    tlRef.current
      .to(textRef.current, {
        scale: 1.06,
        opacity: 0,
        duration: 0.45,
        ease: 'power2.in',
      })
      .to(
        overlayRef.current,
        {
          yPercent: -100,
          duration: 0.55,
          ease: 'power3.inOut',
        },
        '-=0.15'
      )

    return () => {
      if (tlRef.current) {
        tlRef.current.kill()
        tlRef.current = null
      }
    }
  }, [isComplete, introComplete])

  // Dismiss only when BOTH exit animation and data are ready
  useEffect(() => {
    if (animationDone && dataReady) {
      onDone?.()
    }
  }, [animationDone, dataReady, onDone])

  return (
    <div
      ref={overlayRef}
      className="will-change-transform"
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
          onAnimationComplete={handleIntroComplete}
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
