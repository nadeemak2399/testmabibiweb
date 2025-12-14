import type { Block, Field } from 'payload'
import {
  lexicalEditor,
  BoldFeature,
  ItalicFeature,
  UnderlineFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  InlineCodeFeature,
  ParagraphFeature,
  HeadingFeature,
  AlignFeature,
  IndentFeature,
  UnorderedListFeature,
  OrderedListFeature,
  ChecklistFeature,
  LinkFeature,
  BlockquoteFeature,
  UploadFeature,
  HorizontalRuleFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'oneThird',
    options: [
      { label: 'One Third', value: 'oneThird' },
      { label: 'Half', value: 'half' },
      { label: 'Two Thirds', value: 'twoThirds' },
      { label: 'Full', value: 'full' },
    ],
  },
  {
    name: 'richText',
    type: 'richText',
    editor: lexicalEditor({
      features: ({ defaultFeatures, rootFeatures }) => [
        // Default basic text formatting:
        ...defaultFeatures,
        // Inline formatting features:
        BoldFeature(),
        ItalicFeature(),
        UnderlineFeature(),
        StrikethroughFeature(),
        SubscriptFeature(),
        SuperscriptFeature(),
        InlineCodeFeature(),
        // Block‑level formatting and structure:
        ParagraphFeature(),
        HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
        AlignFeature(),
        IndentFeature(),
        UnorderedListFeature(),
        OrderedListFeature(),
        ChecklistFeature(),
        BlockquoteFeature(),
        // Links & media:
        LinkFeature(),
        UploadFeature(),
        // Other helpers:
        HorizontalRuleFeature(),
        // Toolbars:
        FixedToolbarFeature(),
        InlineToolbarFeature(),
      ],
    }),
  },
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_data, siblingData) => Boolean(siblingData?.enableLink),
      },
    },
  }),
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      admin: { initCollapsed: true },
      fields: columnFields,
    },
  ],
}
