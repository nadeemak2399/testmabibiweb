'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import './style.css'

interface Category {
  id: string
  title: string
  slug: string
}

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string
  description?: string
  heroImage?: { url: string }
  publishedAt?: string
  categories?: Category[]
  content?: { root?: { children?: any[] } }
}

interface Props {
  heading?: string
  category?: Category | string
  postsPerPage?: number
  showAllCategories?: boolean // ✅ new field
}

export const AllCatPosts: React.FC<Props> = ({
  heading = 'Category Posts',
  category,
  postsPerPage = 6,
  showAllCategories = false,
}) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    let url = `/api/posts?limit=${postsPerPage}&page=${currentPage}`


    // ✅ If not showing all categories, filter by category
    if (!showAllCategories && category) {
      const categoryId = typeof category === 'string' ? category : category.id
      url += `&where[categories][equals]=${categoryId}`
    }

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setPosts(data.docs || [])
        setTotalPages(data.totalPages || 1)
      })
  }, [category, postsPerPage, currentPage, showAllCategories])

  // 🧠 Skip rendering if no category selected and not showing all
  if (!showAllCategories && !category) return null

  const getDescription = (post: Post) => {
    if (post.excerpt) return post.excerpt
    if (!post.content?.root?.children) return ''
    const textNodes = post.content.root.children
      .filter((node: any) => node.type === 'paragraph')
      .map((node: any) =>
        node.children?.map((child: any) => child.text || '').join(' ')
      )
      .join(' ')
    return textNodes.slice(0, 150) + '...'
  }

  return (
    <section className="catposts-section">
      <h2 className="section-heading">{heading}</h2>

      <div className="posts-grid">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <Link href={`/posts/${post.slug}`}>
              {post.heroImage?.url && (
                <Image
                  src={post.heroImage.url}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="post-image"
                />
              )}
            </Link>

            <div className="post-content">
              {/* CATEGORY */}
              {post.categories && post.categories.length > 0 && (
                <p className="post-category">
                  {post.categories.map((cat, index) => (
                    <React.Fragment key={cat.id}>
                      <Link href={`/${cat.slug}`} className="category-link">
                        {cat.title}
                      </Link>
                      {index < post.categories!.length - 1 && ', '}
                    </React.Fragment>
                  ))}
                </p>
              )}

              <Link href={`/posts/${post.slug}`}>
                <h2 className="post-title">{post.title}</h2>
              </Link>

              <p className="post-description">{getDescription(post)}</p>

              <Link href={`/posts/${post.slug}`} className="read-more">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  )
}

export default AllCatPosts
