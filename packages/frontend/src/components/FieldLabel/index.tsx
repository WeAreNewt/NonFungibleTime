import classnames from 'classnames';

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function FieldLabel({ children, className }: Props) {
  return (
    <div className={classnames('text-sm leading-5 font-semibold text-gray-500', className)}>
      {children}
    </div>
  );
}
