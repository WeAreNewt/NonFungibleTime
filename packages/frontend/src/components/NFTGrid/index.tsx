type NFTGridProps = {
  children: React.ReactNode;
};

export function NFTGrid({ children }: NFTGridProps) {
  return (
    <div
      className="grid gap-4"
      style={{
        // TODO: Figure out how to use this prop with tailwind
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      }}
    >
      {children}
    </div>
  );
}
