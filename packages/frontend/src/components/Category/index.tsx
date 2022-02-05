type Props = {
  children: React.ReactNode;
};

export function CategoryDisplay({ children }: Props) {
  return (
    <div className="bg-blue-100 text-blue-800 px-2 py-1  text-xs rounded-xl inline-block dark:bg-blue-800 dark:text-white">
      {children}
    </div>
  );
}
