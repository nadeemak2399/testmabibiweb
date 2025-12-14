import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import type { Footer as FooterType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import Image from 'next/image'

export async function Footer() {
  const footerData: FooterType = await getCachedGlobal('footer', 1)()

  // ----- background style builder -----
  const bg = footerData?.background
  const img = (bg?.image as any)?.url as string | undefined

  // Solid color fallback
  const solid = bg?.color || '#2E383C'

  // Build background style for the TOP BAND
  const topStyle: React.CSSProperties = {}
  if (bg?.mode === 'color') {
    topStyle.background = solid
  } else if ((bg?.mode === 'image' || bg?.mode === 'imageOverlay') && img) {
    const size = bg?.imageFit === 'contain' ? 'contain' : 'cover'
    const pos =
      bg?.position === 'top' ? 'top' :
      bg?.position === 'bottom' ? 'bottom' : 'center'
    const repeat = bg?.repeat ? 'repeat' : 'no-repeat'

    if (bg?.mode === 'imageOverlay') {
      const alpha = Math.max(0, Math.min(100, bg?.overlayOpacity ?? 70)) / 100
      // set overlay color (fall back to solid)
      const overlay = bg?.color || 'rgba(0,0,0,0.6)'
      // If a hex color is provided, we’ll still use it as plain (browser will accept it)
      topStyle.backgroundImage = `linear-gradient(rgba(0,0,0,${alpha}), rgba(0,0,0,${alpha})), url(${img})`
    } else {
      topStyle.backgroundImage = `url(${img})`
    }
    topStyle.backgroundSize = size
    topStyle.backgroundPosition = pos
    topStyle.backgroundRepeat = repeat
    // Text is white in your design
  } else {
    // default (old look)
    topStyle.background = '#2E383C'
  }

  // Bottom bar color
  const bottomColor = bg?.bottomBarColor || '#263135'

  // ----- existing data reads (unchanged) -----
  const phone   = footerData?.contact?.phone
  const email   = footerData?.contact?.email
  const address = footerData?.contact?.address
  const packages = footerData?.menus?.packages?.links ?? []
  const resources = footerData?.menus?.resources?.links ?? []
  const company = footerData?.menus?.company?.links ?? []
  const packagesHeading  = footerData?.menus?.packages?.heading  || 'Packages';
  const resourcesHeading = footerData?.menus?.resources?.heading || 'Resources';
  const companyHeading   = footerData?.menus?.company?.heading   || 'Company';
  const phoneIcon   = footerData?.contact?.phoneIcon   || 'fa-solid fa-phone'
const emailIcon   = footerData?.contact?.emailIcon   || 'fa-solid fa-envelope'
const addressIcon = footerData?.contact?.addressIcon || 'fa-solid fa-map-location-dot'




const footerLogo = (footerData?.branding?.logo as any) || null
  const year = new Date().getFullYear()
  const copyright =
    footerData?.copyright ||
    `Copyright © ${year} Kaaba Journey – All Rights Reserved`

  return (
    <footer className="mt-auto text-white">
      {/* Top band with custom background */}
      <div style={topStyle}>
        <div className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-4">
          {/* --- your four columns (logo/contact + three menus) stay as in your current implementation --- */}
          <div>
            <Link className="inline-flex items-center gap-3" href="/">
              {footerLogo?.url ? (
                <Image
                  src={footerLogo.url}
                  alt={footerLogo.alt || 'Logo'}
                  width={160}
                  height={48}
                  style={{ height: 'auto', width: 'auto', maxWidth: 180 }}
                  priority
                />
              ) : (
                <Logo />
              )}
            </Link>
            <ul className="mt-8 space-y-4 text-[15px] leading-6">
              {phone && (<li className="flex items-start gap-3">
                <span aria-hidden className="mt-0.5"><i className={phoneIcon}></i></span>
                <span>{phone}</span></li>)}
              {email && (<li className="flex items-start gap-3 break-all"><span aria-hidden className="mt-0.5"><i className={emailIcon}></i></span><span>{email}</span></li>)}
              {address && (<li className="flex items-start gap-3"> <span aria-hidden className="mt-0.5"><i className={addressIcon}></i></span><span>{address}</span></li>)}
            </ul>
          </div>

          <nav>
            <h3 className="text-xl font-semibold">{packagesHeading}</h3>
            <ul className="mt-5 space-y-3 text-[15px]">
              {packages.map((item, i) => {
                const l = (item as any)?.link
                if (!l) return null
                return (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-2 inline-block h-2 w-2 rounded-full bg-white/80" />
                    <CMSLink className="hover:underline" {...l} />
                  </li>
                )
              })}
            </ul>
          </nav>

          <nav>
            <h3 className="text-xl font-semibold">{resourcesHeading}</h3>
            <ul className="mt-5 space-y-3 text-[15px]">
               {resources.map((item, i) => {
      const l = (item as any)?.link
      if (!l) return null
      return (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-2 inline-block h-2 w-2 rounded-full bg-white/80" />
          <CMSLink className="hover:underline" {...l} />
        </li>
      )
    })}
            </ul>
          </nav>

          <nav>
            <h3 className="text-xl font-semibold">{companyHeading}</h3>
            <ul className="mt-5 space-y-3 text-[15px]">
              {company.map((item, i) => {
      const l = (item as any)?.link
      if (!l) return null
      return (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-2 inline-block h-2 w-2 rounded-full bg-white/80" />
          <CMSLink className="hover:underline" {...l} />
        </li>
      )
    })}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom bar (color can be customized) */}
      <div style={{ background: bottomColor }}>
        <div className="container mx-auto px-4 py-4">
          <p className="text-center text-sm text-white/90">{copyright}</p>
        </div>
      </div>
    </footer>
  )
}
