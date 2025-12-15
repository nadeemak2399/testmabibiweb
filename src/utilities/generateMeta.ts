import type { Metadata } from 'next'
import type { Media, Page, Post, Config } from '../payload-types'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

const SITE_NAME = 'Mabibiche'

const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const serverUrl = getServerSideURL()
  let url = serverUrl + '/website-template-OG.webp'

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    url = ogUrl ? serverUrl + ogUrl : serverUrl + image.url
  }

  return url
}

export const generateMeta = async (args: {
  doc: Partial<Page> | Partial<Post> | null
}): Promise<Metadata> => {
  const { doc } = args

  if (!doc) {
    return {
      title: SITE_NAME,
      description: '',
      openGraph: mergeOpenGraph(),
    }
  }

  const ogImage = getImageURL(doc?.meta?.image)

  // ✅ Logic:
  // 1. If meta.title exists → use it exactly as is (no site name added)
  // 2. If no meta.title → use doc.title + " | Mabibiche"
  // 3. If nothing → use "Mabibiche"
  let title = SITE_NAME

  if (doc?.meta?.title?.trim()) {
    title = doc.meta.title.trim()
  } else if (doc?.title?.trim()) {
    title = `${doc.title.trim()} | ${SITE_NAME}`
  }

  // ✅ Description fallback
  const description =
    doc?.meta?.description?.trim() ||
    ('excerpt' in doc && typeof doc.excerpt === 'string' ? doc.excerpt : '') ||
    ''

  // ✅ Canonical URL
  const url =
    Array.isArray(doc?.slug) ? doc.slug.join('/') : doc?.slug ? `/${doc.slug}` : '/'

  return {
    title,
    description,
    openGraph: mergeOpenGraph({
      title,
      description,
      images: ogImage
        ? [
            {
              url: ogImage,
            },
          ]
        : undefined,
      url,
    }),
  }
}
