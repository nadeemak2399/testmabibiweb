import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { AllCatPosts } from '../../blocks/AllCatPosts/config'
import { FAQBlock } from '../../blocks/FAQBlock/config';
import { CenteredHeroBlock } from '../../blocks/CenteredHeroBlock/config';
import { hero } from '@/heros/config'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

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
  EXPERIMENTAL_TableFeature,
} from '@payloadcms/richtext-lexical'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'postURL',
      type: 'text',
      admin: { readOnly: true },
      hooks: {
        afterRead: [
          ({ data }) => {
            if (!data?.slug) return '';
            return `${process.env.NEXT_PUBLIC_SERVER_URL || ''}/${data.slug}`;
          },
        ],
      },
    },
    {
      name: 'isHomePage',
      type: 'checkbox',
      label: 'Set as homepage',
      defaultValue: false,
      admin: {
        description: 'Only one page should be set as homepage.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        { fields: [hero], label: 'Hero' },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [
                {
                  slug: 'richTextBlock',
                  labels: { singular: 'Rich Text', plural: 'Rich Texts' },
                  fields: [
                    {
                      name: 'content',
                      type: 'richText',
                      required: true,
                      editor: lexicalEditor({
                        admin: { placeholder: 'Start writing here...' },
                        features: ({ defaultFeatures }) => [
                          ...defaultFeatures,
                          BoldFeature(),
                          ItalicFeature(),
                          UnderlineFeature(),
                          StrikethroughFeature(),
                          SubscriptFeature(),
                          SuperscriptFeature(),
                          InlineCodeFeature(),
                          ParagraphFeature(),
                          HeadingFeature({ enabledHeadingSizes: ['h2','h3','h4','h5','h6'] }),
                          AlignFeature(),
                          IndentFeature(),
                          UnorderedListFeature(),
                          OrderedListFeature(),
                          ChecklistFeature(),
                          LinkFeature(),
                          BlockquoteFeature(),
                          UploadFeature(),
                          HorizontalRuleFeature(),
                          FixedToolbarFeature(),
                          InlineToolbarFeature(),
                          EXPERIMENTAL_TableFeature(), // table support
                        ],
                      }),
                    },
                  ],
                },
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
                AllCatPosts,
                FAQBlock,
                CenteredHeroBlock,
              ],
              required: true,
              admin: { initCollapsed: true },
            },
          ],
          label: 'Content',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            { name: 'robots', type: 'text', admin: { hidden: true } },
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: { autosave: { interval: 100 }, schedulePublish: true },
    maxPerDoc: 50,
  },
}
