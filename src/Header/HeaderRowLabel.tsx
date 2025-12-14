import React from 'react';

type Props = {
  data?: { label?: string };
  index?: number;
  [key: string]: any;
};

const HeaderRowLabel: React.FC<Props> = ({ data, index = 0 }) => {
  return <>{data?.label || `Menu Item ${index + 1}`}</>;
};

export default HeaderRowLabel;
