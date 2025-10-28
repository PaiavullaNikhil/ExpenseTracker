export default function ChartCard({ title, children }) {
  return (
    <div className="p-4 border border-zinc-800 rounded-lg">
      <div className="text-sm opacity-70 mb-2">{title}</div>
      {children}
    </div>
  );
}


