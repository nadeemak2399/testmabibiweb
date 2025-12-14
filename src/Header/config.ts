// src/payload/globals/Header.ts
import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import HeaderRowLabel from '../Header/HeaderRowLabel'

export const Header: GlobalConfig = {
  slug: 'header',
  access: { read: () => true },
  fields: [
    // Branding
    {
      name: 'branding',
      label: 'Branding',
      type: 'group',
      fields: [
        {
          name: 'logo',
          label: 'Logo (footer/header override)',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'tagline',
          type: 'text',
          admin: { placeholder: 'The everything app, for work.' },
        },
        {
          name: 'favicon',
          label: 'Website Favicon',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
      ],
    },

    // Unified Navigation (menu + submenu)
    {
      name: 'navigation',
      label: 'Navigation',
      type: 'array',
      minRows: 0,
      fields: [
        link({ appearances: false }), // top-level link
        {
          name: 'submenu',
          label: 'Submenu Items',
          type: 'array',
          minRows: 0,
          fields: [
            link({ appearances: false }), // same structure for submenu
          ],
          admin: { initCollapsed: true },
        },
      ],
      admin: {
        components: {
          RowLabel: (HeaderRowLabel as unknown) as any,
        },
      },
    },

    // Primary CTA
    {
      name: 'ctaPrimary',
      label: 'Primary CTA (Sign Up)',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Sign Up' },
        { name: 'url', type: 'text', admin: { placeholder: '/signup' } },
        {
          name: 'target',
          type: 'select',
          options: [
            { label: 'Same tab', value: '_self' },
            { label: 'New tab', value: '_blank' },
          ],
          defaultValue: '_self',
        },
        {
          name: 'gradient',
          type: 'checkbox',
          defaultValue: true,
          admin: { description: 'Use gradient styling' },
        },
      ],
    },

    // Secondary CTA
    {
      name: 'ctaSecondary',
      label: 'Secondary CTA (Contact Sales)',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', defaultValue: 'Contact Sales' },
        { name: 'url', type: 'text', admin: { placeholder: '/contact-sales' } },
        {
          name: 'target',
          type: 'select',
          options: [
            { label: 'Same tab', value: '_self' },
            { label: 'New tab', value: '_blank' },
          ],
          defaultValue: '_self',
        },
      ],
    },

    // Auth links
    {
      name: 'auth',
      label: 'Auth / Small Links',
      type: 'group',
      fields: [
        { name: 'loginLabel', type: 'text', defaultValue: 'Log In' },
        { name: 'loginUrl', type: 'text', admin: { placeholder: '/login' } },
      ],
    },

    { name: 'className', type: 'text' },

    // ✅ Custom Code Injection Section
    {
      name: 'customCode',
      label: 'Custom Code Injection',
      type: 'group',
      fields: [
        {
          name: 'headCode',
          label: 'Head Code (Analytics, Search Console, etc.)',
          type: 'textarea',
          admin: {
            description:
              'Paste HTML or JavaScript snippets here. It will be injected inside the <head> tag (e.g., Google Analytics, Search Console, etc.)',
          },
        },
        {
          name: 'bodyCode',
          label: 'Body Code (Scripts before </body>)',
          type: 'textarea',
          admin: {
            description:
              'Paste code that should appear just before the closing </body> tag (e.g., chat widgets, tracking pixels).',
          },
        },
      ],
    },
  ],
  hooks: { afterChange: [revalidateHeader] },
}
