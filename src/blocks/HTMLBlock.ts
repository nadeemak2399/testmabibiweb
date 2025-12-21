import type { Block } from 'payload'

export const HTMLBlock: Block = {
  slug: 'html',
  labels: {
    singular: 'HTML',
    plural: 'HTML Blocks',
  },
  fields: [
    {
      name: 'html',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Paste HTML here (tables from Word/Excel are supported)',
      },
    },
  ],
}
