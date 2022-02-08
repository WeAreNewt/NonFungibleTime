import { baseInputClassNames } from './common';

export const Input = ({
  type = 'text',
  ...props
}: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) => {
  return (
    <input type={type} className={baseInputClassNames} placeholder={props.placeholder} {...props} />
  );
};
