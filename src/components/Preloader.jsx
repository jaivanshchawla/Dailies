import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AppleHelloEffectHindi } from './AppleHelloEffectHindi'

export default function Preloader({ onComplete }) {
  const [visible, setVisible] = useState(true)

  const handleComplete = () => {
    setTimeout(() => setVisible(false), 600)
    onComplete?.()
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg)',
          }}
        >
          <AppleHelloEffectHindi
            durationScale={1}
            onAnimationComplete={handleComplete}
            style={{
              width: 'min(80vw, 400px)',
              height: 'auto',
            }}
            className="text-foreground"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
