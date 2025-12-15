'use client'

import React from 'react'
import Image from 'next/image'
import type { CenteredHeroBlock as CenteredHeroBlockType, Media } from '@/payload-types'
import s from './CenteredHeroBlock.module.css'

type Props = CenteredHeroBlockType & { id?: string }

// define expected subtypes more precisely
type Background = {
  mode?: 'color' | 'image' | 'imageOverlay'
  color?: string
  image?: Media | { url: string; alt?: string } | null
  overlayColor?: string
  overlayOpacity?: number
  imageFit?: 'cover' | 'contain'
  position?: string
}

type Decorations = {
  leftImage?: Media | { url: string; alt?: string } | null
  rightImage?: Media | { url: string; alt?: string } | null
}

export default function CenteredHeroBlock({
  id,
  title,
  description,
  background,
  decorations,
  className,
}: Props) {
  const bg = (background as unknown as Background) ?? {}
  const bgImage = bg.image?.url
  const overlayColor = bg.overlayColor || '#000'
  const overlayOpacity = Math.max(0, Math.min(100, bg.overlayOpacity ?? 50)) / 100

  const decs = (decorations as unknown as Decorations) ?? {}
  const leftDec = decs.leftImage
  const rightDec = decs.rightImage

  // Build inline style for solid color fallback
  const sectionStyle: React.CSSProperties = {}
  if (bg.mode === 'color' && bg.color) {
    sectionStyle.background = bg.color
  } else if ((bg.mode === 'image' || bg.mode === 'imageOverlay') && bgImage) {
    // handled via <Image>
  } else {
    sectionStyle.background = bg.color || '#FBF7EE'
  }

  const overlayStyle: React.CSSProperties = {}
  if (bg.mode === 'imageOverlay') {
    overlayStyle.background = overlayColor
    overlayStyle.opacity = overlayOpacity
  }

  return (
    <section id={id} className={[s.section, className].filter(Boolean).join(' ')} style={sectionStyle}>
      {/* background image */}
      {bgImage && (bg.mode === 'image' || bg.mode === 'imageOverlay') && (
        <div className={s.bgWrap} aria-hidden>
          <Image
            src={bgImage.startsWith('http') ? bgImage : `${process.env.NEXT_PUBLIC_SERVER_URL || ''}${bgImage}`}
            alt={bg.image?.alt || title || 'Background'}
            fill
            sizes="(min-width:1024px) 1600px, (min-width:640px) 1000px, 100vw"
            className={s.bgImage}
            style={{
              objectFit: bg.imageFit === 'contain' ? 'contain' : 'cover',
              objectPosition: bg.position ?? 'center',
            }}
            priority
          />
        </div>
      )}

      {bg.mode === 'imageOverlay' && <div className={s.overlay} style={overlayStyle} aria-hidden />}

      {/* decorative left/right images */}
      {leftDec?.url && (
        <div className={`${s.decoration} ${s.left}`} aria-hidden>
          <Image src={leftDec.url} alt={leftDec.alt || ''} width={160} height={160} style={{ width: 'auto', height: '100%' }} />
        </div>
      )}
      {rightDec?.url && (
        <div className={`${s.decoration} ${s.right}`} aria-hidden>
          <Image src={rightDec.url} alt={rightDec.alt || ''} width={160} height={160} style={{ width: 'auto', height: '100%' }} />
        </div>
      )}

      {/* centered content */}
      <div className={s.inner}>
        <div className={s.content}>
          {title && <h1 className={s.title}>{title}</h1>}
          {description && <p className={s.description}>{description}</p>}
        </div>
      </div>
    </section>
  )
}
