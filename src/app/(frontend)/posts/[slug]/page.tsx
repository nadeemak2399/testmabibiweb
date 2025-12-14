import type { Metadata } from 'next'

import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'
import TocClient from './toc.client' // new client component (create file next)
import type { Post } from '@/payload-types'
import Link from 'next/link'
import { PostHero } from '@/heros/PostHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import Image from 'next/image'
import './style.css'

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'posts',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}




export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const url = '/posts/' + decodedSlug
  const post = await queryPostBySlug({ slug: decodedSlug })

  if (!post) return <PayloadRedirects url={url} />


  // ✅ Fetch related posts from the same categories
let relatedPosts: Post[] = []

if (post.categories && Array.isArray(post.categories) && post.categories.length > 0) {
  relatedPosts = await queryRelatedPosts({
    categoryIds: post.categories.map((c: any) => c.id || c),
    currentPostId: post.id,
  })
}


   return (
    <article className="post-article">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}

      {/* PostHero remains — shows the title etc. */}

     

      <div className="post-wrapper mabb">
        <div className="post-container">
          {/* New grid layout: left = TOC, right = content */}
          <div className="post-grid">
            {/* Left: client-side TOC */}
            <aside className="post-sidebar">
              {/* The TocClient will find headings inside #post-content and render the TOC */}
              <TocClient />
            </aside>

            {/* Right: the article content (server-rendered via RichText) */}
            <section id="post-body" className="prose max-w-none">

            <div className='post-breadcrumbs'>
              
              <div className='post-breadcrumbs-home'>
                <Link href="/">Home</Link> <i className="fa-solid fa-angles-right"></i> 
              </div>

              <div className='post-breadcrumbs-category'>
                {(() => {
  const categories = post?.categories
  if (!Array.isArray(categories) || categories.length === 0) return null

   return (
    <div className="post-categories flex items-center gap-2 flex-wrap">
      <span className="">
        {' '}
        {categories.map((cat, index) => {
          if (!cat || typeof cat === 'string') return null // skip invalid or ID-only items

          // ✅ Use only known fields from Payload type
          const name = (cat as any).title || (cat as any).label || 'Unnamed'
          const slug = (cat as any).slug || (cat as any).id

          return (
            <React.Fragment key={cat.id || index}>
              <Link
                href={`/${slug}`}
                className="text-blue-600 hover:underline"
              >
                {name}
              </Link>
              {index < categories.length - 1 && ', '}
            </React.Fragment>
          )
        })}
      </span><i className="fa-solid fa-angles-right"></i> 
    </div>
  )
})()}
              </div>
              
              
              <div className='post-breadcrumbs-postName'>
                {post.title}
              </div>
              
              
              
              
            </div>


              {/* NOTE: RichText renders HTML/lexical content server-side */}
              <div id="post-content">
                <div id="post-content">
  <div className="post-title">
    <h1 className="mb-3 text-3xl md:text-5xl lg:text-6xl">{post.title}</h1>




<div className="post-meta-custom">
  {/* Authors */}
  <div className="flex items-center gap-2 flex-wrap">
    <span><i className="fa-regular fa-circle-user"></i> By</span>
    <span className="font-medium text-gray-800">
      {(() => {
        const populated = (post as any).populatedAuthors
        if (Array.isArray(populated) && populated.length > 0) {
          return populated.map((a: any) => a.name).join(', ')
        }
        const rel = (post as any).authors
        if (Array.isArray(rel) && rel.length > 0) {
          const names = rel
            .map((r: any) => r?.name || `${r?.firstName || ''} ${r?.lastName || ''}`.trim())
            .filter(Boolean)
          if (names.length > 0) return names.join(', ')
        }
        return 'Unknown author'
      })()}
    </span>
  </div>

  {/* Date */}
  <div className="post-date flex items-center gap-1">
    <i className="fa-regular fa-calendar-days"></i>
    <time className="text-sm text-gray-600">
      {(() => {
        const dateVal = (post as any).publishedAt || (post as any).createdAt
        if (!dateVal) return 'Unpublished'
        try {
          const d = new Date(dateVal)
          return d.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })
        } catch {
          return String(dateVal)
        }
      })()}
    </time>
  </div>

{/* ✅ Categories */}
{(() => {
  const categories = post?.categories
  if (!Array.isArray(categories) || categories.length === 0) return null

  return (
    <div className="post-categories flex items-center gap-2 flex-wrap">
      <i className="fa-regular fa-folder-closed"></i>
      <span className="text-sm text-gray-700">
        {' '}
        {categories.map((cat, index) => {
          if (!cat || typeof cat === 'string') return null // skip invalid or ID-only items

          // ✅ Use only known fields from Payload type
          const name = (cat as any).title || (cat as any).label || 'Unnamed'
          const slug = (cat as any).slug || (cat as any).id

          return (
            <React.Fragment key={cat.id || index}>
              <Link
                href={`/${slug}`}
                className="text-blue-600 hover:underline"
              >
                {name}
              </Link>
              {index < categories.length - 1 && ', '}
            </React.Fragment>
          )
        })}
      </span>
    </div>
  )
})()}

</div>






  </div>

{/* --- Featured image below the title --- */}
{post.heroImage && typeof post.heroImage !== 'string' && post.heroImage.url && (
  <div className="post-img">
    <Image
      src={
          typeof post.heroImage === 'string'
            ? post.heroImage
            : post.heroImage.url
        }
      alt={post.title || 'Featured Image'}
      fill
      className="rounded-md object-cover"
      sizes="(max-width: 768px) 100vw, 50vw"
      priority
    />
  </div>
)}

  <RichText className="max-w-[48rem] mx-auto" data={post.content} enableGutter={false} />
</div>

              </div>

              {post.relatedPosts && post.relatedPosts.length > 0 && (
                <RelatedPosts
                  className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
                  docs={post.relatedPosts.filter((post) => typeof post === 'object')}
                />
              )}

                    {/* ✅ Related posts block */}
        {relatedPosts?.length > 0 && (
          <div className="related-posts-container">
            <div className="related-posts-heading">Related Posts</div>
            <div className="related-posts-grid">
              {relatedPosts.map((p) => (
                <article key={p.id} className="related-post-card">
                  <Link
                    key={p.id}
                    href={`/posts/${p.slug}`}
                    className="rounded-lg overflow-hidden border hover:shadow-lg transition bg-white block"
                  >
                  {p.heroImage && typeof p.heroImage === 'object' && p.heroImage.url && (
                    <Image
                      src={p.heroImage.url}
                      alt={p.title}
                      width={400}
                      height={250}
                      className="related-post-image"
                    />
                  )}</Link>
                  <div className="related-post-content">
                    <Link
                    key={p.id}
                    href={`/posts/${p.slug}`}
                    className="rounded-lg overflow-hidden border hover:shadow-lg transition bg-white block"
                  ><div className="related-post-title">{p.title}</div></Link>
                    <p className="related-post-date">
                      {new Date(p.publishedAt || p.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

        )}

            </section>
          </div>
        </div>
      </div>

    </article>
  )



}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  // Decode to support slugs with special characters
  const decodedSlug = decodeURIComponent(slug)
  const post = await queryPostBySlug({ slug: decodedSlug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
const queryRelatedPosts = cache(async ({ categoryIds, currentPostId }: { categoryIds: string[]; currentPostId: string }) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'posts',
    draft,
    limit: 3,
    depth: 2,
    where: {
      and: [
        {
          id: {
            not_equals: currentPostId,
          },
        },
        {
          categories: {
            in: categoryIds, // ✅ Match any of the same categories
          },
        },
      ],
    },
  })

  return result.docs
})
