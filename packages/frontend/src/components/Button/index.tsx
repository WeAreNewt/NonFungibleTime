import classnames from 'classnames';

export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
}

type ButtonProps = Pick<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
  'onClick' | 'className' | 'children'
> & {
  variant?: ButtonVariant;
};

const baseStyles = 'flex items-center gap-2 py-2 px-4 cursor-pointer font-medium rounded min-w-fit';

const variantStyles: Record<ButtonVariant, string> = {
  [ButtonVariant.PRIMARY]: classnames(
    baseStyles,
    'border border-transparent text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800'
  ),
  [ButtonVariant.SECONDARY]: classnames(
    baseStyles,
    'bg-white hover:bg-gray-200 active:bg-gray-300 text-gray-700 border border-gray-300'
  ),
};

export function Button({ variant = ButtonVariant.PRIMARY, className, ...props }: ButtonProps) {
  const variantClass = variantStyles[variant];

  return <button className={classnames(variantClass, className)} {...props} />;
}
