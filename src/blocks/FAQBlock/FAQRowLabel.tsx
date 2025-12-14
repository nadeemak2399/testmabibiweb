// src/payload/blocks/faqBlock/FAQRowLabel.tsx
import React from 'react';

type ItemData = { question?: string } | undefined;

interface RowLabelProps {
  data?: ItemData;
  index?: number;
  // allow other props Payload might pass
  [key: string]: any;
}

/**
 * Simple, defensive RowLabel that avoids destructuring/shorthand mistakes
 * and avoids the "always truthy" checks by testing the property directly.
 */
const FAQRowLabel: React.FC<RowLabelProps> = (props) => {
  const data = props.data ?? {};                 // ensure object
  const idx = typeof props.index === 'number' ? props.index : 0;
  const label = data.question && data.question.length > 0
    ? data.question
    : `FAQ ${idx + 1}`;

  return <span>{label}</span>;
};

export default FAQRowLabel;
