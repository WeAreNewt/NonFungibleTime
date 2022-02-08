import classnames from 'classnames';
type Props = {
  children: React.ReactNode;
  className?: string;
};

export function CategoryDisplay({ children, className }: Props) {
  return (
    <div
      className={classnames(
        'bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-xl inline-block dark:bg-blue-800 dark:text-white',
        className
      )}
    >
      {children}
    </div>
  );
}
