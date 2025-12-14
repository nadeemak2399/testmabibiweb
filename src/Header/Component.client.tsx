'use client'

import Link from 'next/link'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import './style.css'

type Props = {
  data?: HeaderType | null
}

export function HeaderClient({ data }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openKey, setOpenKey] = useState<string | null>(null)

  const branding = (data as any)?.branding || {}
  const navigation = (data as any)?.navigation || [] // ✅ unified navigation
  const ctaPrimary = (data as any)?.ctaPrimary || {}
  const ctaSecondary = (data as any)?.ctaSecondary || {}
  const auth = (data as any)?.auth || {}
  const logo = branding?.logo as any

  const toggleSub = (key: string) => {
    setOpenKey((k) => (k === key ? null : key))
  }

    const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  return (
    <header className="header-outter-cont">
      <div className="container max-w-6xl  px-4 header-cont">
          {/* --- Logo --- */}
          <div className="header-logo">
            <Link href="/" className="inline-flex items-center gap-3">
              {logo?.url ? (
                <Image src={logo.url} alt={logo.alt || 'Logo'} width={140} height={40} style={{ height: 'auto' }} />
              ) : (
                <div className="font-bold text-lg">Brand</div>
              )}
            </Link>

            {branding?.tagline && (
              <span className="hidden sm:inline-block text-slate-600 text-sm brand-tagline">
                {branding.tagline}
              </span>
            )}
          </div>

          {/* --- Mobile Menu Button --- */}
          <button
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 border rounded-md hover:bg-gray-100 transition-colors"
            onClick={() => {
              setMenuOpen(!menuOpen)
              if (menuOpen) setOpenKey(null)
            }}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-slate-700 my-1 transition-all duration-300 ${
                menuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-slate-700 transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}
            />
          </button>
      </div>

          {/* --- Desktop Navigation --- */}
          <nav className="hidden lg:flex flex-1 justify-center pl-4 primary-navigation" aria-label="Primary navigation">
            <div className="flex justify-center container ">
              {navigation.map((item: any, i: number) => {
                  const linkData = item.link || {}
                  const children = item?.submenu || []
                  const key = `nav-${i}`

                  if (!children || children.length === 0) {
                    return (
                      <CMSLink
                        key={i}
                        className="nav-item"
                        {...linkData}
                      />
                    )
                  }

                return (
                  <div key={i} className="relative nav-item">
                    <button
                      type="button"
                      className="text-sm text-slate-600 hover:text-black flex items-center gap-2"
                      aria-expanded={openKey === key}
                      aria-haspopup="true"
                      onClick={() => toggleSub(key)}
                    >
                      {item?.label || item?.link?.label || item?.link?.text || 'Linksss'}
                      <svg
                        className="ml-1 h-3 w-3 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        width="12"
                        height="12"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>


                    <div className={`submenu ${openKey === key ? 'show' : ''}`} role="menu" aria-label={`${item?.label ?? 'submenu'} options`}>
                      <ul className="submenu-list">
                        {children.map((child: any, ci: number) => {
                            const childLink = child.link || {}
                            return (
                              <li key={ci}>
                                <CMSLink className="submenu-link" {...childLink} />
                              </li>
                            )
                          })}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>
          </nav>

         

        {/* --- Mobile Dropdown --- */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            menuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t py-3 space-y-3">
            <div className="flex flex-col gap-2">
              {navigation.map((item: any, i: number) => {
  const linkData = item.link || {}
  const children = item?.submenu || []
  const key = `nav-${i}`

  if (!children || children.length === 0) {
    return (
      <CMSLink
        key={i}
        className="nav-item"
        {...linkData}
      />
    )
  }

                return (
                  <div key={i}>
                    <div className="flex justify-between items-center">
  <button
    onClick={() => setOpenKey((k) => (k === key ? null : key))}
    aria-expanded={openKey === key}
    aria-controls={key}
    className="flex items-center gap-2 text-sm text-slate-600 hover:text-black"
  >
    {item?.label || item?.link?.label || item?.link?.text || 'Linksss'}
    <svg
      className={`h-4 w-4 transition-transform ${openKey === key ? 'rotate-180' : ''}`}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 11.584l3.71-4.353a.75.75 0 011.14.98l-4.25 5a.75.75 0 01-1.14 0l-4.25-5a.75.75 0 01.02-1.06z"
        clipRule="evenodd"
      />
    </svg>
  </button>
</div>


                    <div id={key} className={`${openKey === key ? 'block' : 'hidden'} pl-4 mt-2`}>
                      <ul className="space-y-1">
                        {children.map((child: any, ci: number) => {
                          const childLink = child.link || {}
                          return (
                            <li key={ci}>
                              <CMSLink className="submenu-link" {...childLink} />
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col gap-2 mt-4">
              {ctaSecondary?.label && (
                <Link
                  href={ctaSecondary.url || '#'}
                  target={ctaSecondary.target || '_self'}
                  className="rounded-full border px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 text-center"
                >
                  {ctaSecondary.label}
                </Link>
              )}
              {auth?.loginUrl && (
                <Link href={auth.loginUrl} className="text-sm text-slate-700 text-center">
                  {auth.loginLabel || 'Log In'}
                </Link>
              )}
              {ctaPrimary?.label && (
                <Link
                  href={ctaPrimary.url || '#'}
                  target={ctaPrimary.target || '_self'}
                  className="inline-flex justify-center items-center px-4 py-2 rounded-full text-sm font-semibold bg-slate-900 text-white"
                >
                  {ctaPrimary.label}
                </Link>
              )}
            </div>
          </div>
        </div>
    </header>
  )
}
