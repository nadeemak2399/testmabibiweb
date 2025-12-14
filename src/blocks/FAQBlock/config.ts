// src/payload/blocks/faqBlock/config.ts
import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import FAQRowLabel from './FAQRowLabel';

export const FAQBlock: Block = {
  slug: 'faqBlock',
  interfaceName: 'FAQBlock',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    {
      name: 'intro',
      type: 'richText',
      editor: lexicalEditor({ features: ({ defaultFeatures }) => [...defaultFeatures] }),
    },
    {
      name: 'items',
      type: 'array',
      labels: { singular: 'FAQ', plural: 'FAQs' },
      admin: {
        components: {
          // cast to bypass Payload type mismatch (safe if component returns JSX)
          RowLabel: (FAQRowLabel as unknown) as any,
        },
      },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true, admin: { rows: 4, placeholder: 'Type the answer…' } },
        { name: 'defaultOpen', type: 'checkbox', defaultValue: false },
        { name: 'anchor', type: 'text' },
      ],
    },
    { name: 'className', type: 'text' },
  ],
}
