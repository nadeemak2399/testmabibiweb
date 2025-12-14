import type { Block } from 'payload'

export const AllCatPosts: Block = {
  slug: 'allCatPosts',
  labels: {
    singular: 'Category Posts Block',
    plural: 'Category Posts Blocks',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      defaultValue: 'Category Posts',
    },
    {
      name: 'showAllCategories',
      type: 'checkbox',
      label: 'Show Posts from All Categories',
      defaultValue: false,
      admin: {
        description:
          'Enable this to show posts from all categories. If unchecked, you can select a specific category below.',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Select Category',
      admin: {
        condition: (data, siblingData) => !siblingData.showAllCategories,
        description:
          'Choose which category’s posts to show. Hidden if "Show All Categories" is enabled.',
      },
    },
    {
      name: 'postsPerPage',
      type: 'number',
      label: 'Number of Posts Per Page',
      defaultValue: 6,
      min: 1,
      max: 20,
    },
  ],
}
