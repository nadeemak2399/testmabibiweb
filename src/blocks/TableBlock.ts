// src/blocks/TableBlock.ts
import type { Block } from 'payload'

export const TableBlock: Block = {
  slug: 'table',
  labels: {
    singular: 'Table',
    plural: 'Tables',
  },
  fields: [
    {
      name: 'hasHeader',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'rows',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'cells',
          type: 'array',
          required: true,
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}
