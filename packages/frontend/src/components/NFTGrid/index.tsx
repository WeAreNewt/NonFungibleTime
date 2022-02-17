import { useViewportProvider } from "../../lib/providers/viewport-provider";

type NFTGridProps = {
  children: React.ReactNode;
};

export function NFTGrid({ children }: NFTGridProps) {
  const { width } = useViewportProvider();
  // Threshold to abandon grid and style cards as single column
  const threshold = 400;
  return (
    <div
      className="grid gap-4"
      style={{
        // TODO: Figure out how to use this prop with tailwind
        gridTemplateColumns: width > threshold ? 'repeat(auto-fit, minmax(320px, 1fr))' : 'none',
      }}
    >
      {children}
    </div>
  );
}
