export default function TableCell({ children, className = '' }) {
  return (
    <td className={`px-6 py-4 whitespace-nowrap ${className}`}>
      <div className="text-sm text-slate-300">{children}</div>
    </td>
  );
}
