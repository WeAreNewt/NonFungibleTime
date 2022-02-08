import { baseInputClassNames } from './common';

export const Select = (
  props: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>
) => {
  return <select className={baseInputClassNames} {...props} />;
};
