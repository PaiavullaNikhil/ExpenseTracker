export default function TransactionCard({ item, onEdit, onDelete }) {
  return (
    <div className="p-4 border border-zinc-800 rounded-lg flex items-center justify-between">
      <div>
        <div className="font-medium">{item.title}</div>
        <div className="text-xs opacity-70">{new Date(item.date).toLocaleDateString()} • {item.category}</div>
      </div>
      <div className={`font-semibold ${item.type === 'expense' ? 'text-red-400' : 'text-green-400'}`}>
        {item.type === 'expense' ? '-' : '+'}₹{item.amount}
      </div>
      <div className="flex gap-2">
        <button className="text-xs px-2 py-1 border border-zinc-700 rounded" onClick={() => onEdit?.(item)}>Edit</button>
        <button className="text-xs px-2 py-1 border border-zinc-700 rounded" onClick={() => onDelete?.(item)}>Delete</button>
      </div>
    </div>
  );
}


