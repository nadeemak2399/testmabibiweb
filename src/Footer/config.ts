import type { GlobalConfig } from 'payload'
import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: { read: () => true },
  fields: [

    {
      name: 'branding',
      label: 'Branding',
      type: 'group',
      fields: [
        {
          name: 'logo',
          label: 'Footer Logo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Overrides the default Logo component in the footer (SVG/PNG recommended).',
          },
        },
      ],
    },
    
    // Contact (left column)
    {
      name: 'contact',
      label: 'Contact',
      type: 'group',
      admin: { description: 'Shown in the left column under the logo' },
      fields: [
    { name: 'phoneIcon',   type: 'text', admin: { placeholder: '📞' } }, // NEW
    { name: 'phone',       type: 'text' },
    { name: 'emailIcon',   type: 'text', admin: { placeholder: '✉️' } }, // NEW
    { name: 'email',       type: 'email' },
    { name: 'addressIcon', type: 'text', admin: { placeholder: '📍' } }, // NEW
    { name: 'address',     type: 'textarea', admin: { rows: 3 } }
      ],
    },



    // Add somewhere near the top of `fields` (before menus is fine)
{
  name: 'background',
  label: 'Background',
  type: 'group',
  admin: { description: 'Controls the top band background (color or image).' },
  fields: [
    {
      name: 'mode',
      type: 'select',
      defaultValue: 'color',
      options: [
        { label: 'Solid color', value: 'color' },
        { label: 'Image', value: 'image' },
        { label: 'Image + overlay', value: 'imageOverlay' },
      ],
    },
    {
      name: 'color',
      type: 'text',
      admin: {
        placeholder: '#2E383C',
        condition: (_, siblingData) => (siblingData?.mode === 'color' || siblingData?.mode === 'imageOverlay'),
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => (siblingData?.mode === 'image' || siblingData?.mode === 'imageOverlay'),
        description: 'Large, wide image recommended',
      },
    },
    {
      name: 'imageFit',
      type: 'select',
      defaultValue: 'cover',
      admin: { condition: (_, s) => (s?.mode === 'image' || s?.mode === 'imageOverlay') },
      options: [
        { label: 'Cover', value: 'cover' },
        { label: 'Contain', value: 'contain' },
      ],
    },
    {
      name: 'position',
      type: 'select',
      defaultValue: 'center',
      admin: { condition: (_, s) => (s?.mode === 'image' || s?.mode === 'imageOverlay') },
      options: [
        { label: 'Top', value: 'top' },
        { label: 'Center', value: 'center' },
        { label: 'Bottom', value: 'bottom' },
      ],
    },
    {
      name: 'repeat',
      type: 'checkbox',
      defaultValue: false,
      admin: { condition: (_, s) => (s?.mode === 'image' || s?.mode === 'imageOverlay') },
    },
    {
      name: 'overlayOpacity',
      type: 'number',
      min: 0,
      max: 100,
      defaultValue: 70,
      admin: {
        description: 'Only used with Image + overlay',
        condition: (_, s) => s?.mode === 'imageOverlay',
      },
    },
    {
      name: 'bottomBarColor',
      type: 'text',
      admin: { placeholder: '#263135', description: 'Bottom copyright bar color (optional)' },
    },
  ],
},


    // Menus (three columns)
    {
      name: 'menus',
      label: 'Menus',
      type: 'group',
      fields: [
        {
          name: 'packages',
          label: 'Packages',
          type: 'group',
          fields: [
            { name: 'heading', type: 'text', defaultValue: 'Packages' }, // 👈 NEW
            {
              name: 'links',
              type: 'array',
              admin: { initCollapsed: true },
              labels: { singular: 'Link', plural: 'Links' },
              fields: [
                link({ appearances: false }),
              ],
            },
          ],
        },
        {
          name: 'resources',
          label: 'Resources',
          type: 'group',
          fields: [
                    { name: 'heading', type: 'text', defaultValue: 'Resources' }, // 👈 NEW
            {
              name: 'links',
              type: 'array',
              admin: { initCollapsed: true },
              labels: { singular: 'Link', plural: 'Links' },
              fields: [
                link({ appearances: false }),
              ],
            },
          ],
        },
        {
          name: 'company',
          label: 'Company',
          type: 'group',
          fields: [
                    { name: 'heading', type: 'text', defaultValue: 'Company' }, // 👈 NEW
            {
              name: 'links',
              type: 'array',
              admin: { initCollapsed: true },
              labels: { singular: 'Link', plural: 'Links' },
              fields: [
                link({ appearances: false }),
              ],
            },
          ],
        },
      ],
    },

    // Copyright (bottom bar)
    {
      name: 'copyright',
      type: 'text',
      admin: { placeholder: 'Copyright © 2024 Kaaba Journey – All Rights Reserved' },
    },

    // Backward compatibility (optional): keeps your old nav items
    {
      name: 'navItems',
      type: 'array',
      admin: {
        initCollapsed: true,
        description: 'Legacy links; you can keep or migrate these into Menus above.',
        components: { RowLabel: '@/Footer/RowLabel#RowLabel' },
      },
      maxRows: 6,
      fields: [link({ appearances: false })],
    },
  ],
  hooks: { afterChange: [revalidateFooter] },
}
