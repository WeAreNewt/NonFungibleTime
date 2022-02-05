type NFTGridProps = {
  children: React.ReactNode;
};

export function NFTGrid({ children }: NFTGridProps) {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      }}
    >
      {children}
    </div>
  );
}
