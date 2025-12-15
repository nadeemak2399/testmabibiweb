import type { Block } from 'payload';

export const CenteredHeroBlock: Block = {
  slug: 'centeredHeroBlock',
  interfaceName: 'CenteredHeroBlock',
  labels: { singular: 'Centered Hero', plural: 'Centered Heroes' },
  fields: [
    { name: 'title', type: 'text', required: true, admin: { placeholder: 'Silver Umrah Package' } },
    {
      name: 'description',
      type: 'textarea',
      admin: { rows: 3, placeholder: 'Short breadcrumb or subtitle text' },
    },

    {
      name: 'background',
      label: 'Background',
      type: 'group',
      admin: { description: 'Choose a color or image background and overlay.' },
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
          admin: { placeholder: '#FAF7F1' },
          // shown for color / imageOverlay
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Large wide image recommended (desktop)' },
        },
        {
          name: 'imageFit',
          type: 'select',
          defaultValue: 'cover',
          options: [
            { label: 'Cover', value: 'cover' },
            { label: 'Contain', value: 'contain' },
          ],
        },
        {
          name: 'position',
          type: 'select',
          defaultValue: 'center',
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
        },
        {
          name: 'overlayColor',
          type: 'text',
          admin: { placeholder: '#000000' },
          // used when mode === imageOverlay
        },
        {
          name: 'overlayOpacity',
          type: 'number',
          min: 0,
          max: 100,
          defaultValue: 50,
          admin: { description: '0 = transparent, 100 = opaque' },
        },
      ],
    },

    {
      name: 'decorations',
      label: 'Decorative shapes',
      type: 'group',
      fields: [
        {
          name: 'leftImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional decorative image on the left' },
        },
        {
          name: 'rightImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'Optional decorative image on the right' },
        },
      ],
    },

    { name: 'className', type: 'text', admin: { description: 'Optional extra CSS class for the section' } },
  ],
};
