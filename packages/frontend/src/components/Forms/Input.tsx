import { baseInputClassNames } from './common';



interface InputProps {
  error?: string
}

type Props = InputProps & React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export const Input = ({
  type = 'text',
  error,
  ...props
}: Props) => {
  return (
    <>
      <input type={type} className={baseInputClassNames} placeholder={props.placeholder} {...props} />
      {error && <span className="absolute text-xs text-red-500 pt-1">{error}</span>}
    </>
  );
};
