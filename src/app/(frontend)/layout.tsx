import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  // ✅ Fetch Payload header data (for favicon + injected code)
  let favicon: string | undefined
  let headCode: string | undefined
  let bodyCode: string | undefined

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/globals/header`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error('Failed to fetch header data:', res.status)
    } else {
      const headerData = await res.json()
      favicon = headerData?.branding?.favicon?.url
      headCode = headerData?.customCode?.headCode
      bodyCode = headerData?.customCode?.bodyCode
    }
  } catch (error) {
    console.error('Error fetching header data:', error)
  }

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme />
        {/* ✅ Dynamically insert favicon */}
        {favicon && <link rel="icon" href={favicon} sizes="any" />}

        {/* ✅ Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />

        {/* ✅ Custom Head Code Injection */}
        {headCode && <div dangerouslySetInnerHTML={{ __html: headCode }} />}
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
        {/* ✅ Custom Body Code Injection (e.g., chat widgets, tracking pixels) */}
        {bodyCode && <div dangerouslySetInnerHTML={{ __html: bodyCode }} />}
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
