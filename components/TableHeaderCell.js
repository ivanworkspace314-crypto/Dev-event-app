export default function TableHeaderCell({ children, className = '' }) {
  return (
    <th
      className={`px-6 py-3 text-left text-xs font-medium text-slate-200 uppercase tracking-wider ${className}`}
      scope="col"
    >
      {children}
    </th>
  );
}
