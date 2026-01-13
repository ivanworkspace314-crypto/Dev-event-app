export default function TextInput({
  label,
  htmlFor,
  type = 'text',
  isTextarea = false,
  name,
  value,
  onChange,
  required = false,
  placeholder = '',
  rows = 4,
}) {
  const baseClasses = 'w-full px-4 py-2 bg-slate-700 border border-slate-600 text-slate-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none placeholder:text-slate-400';

  return (
    <div>
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-200 mb-2">
          {label}
          {required && ' *'}
        </label>
      )}
      {isTextarea ? (
        <textarea
          id={htmlFor}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          rows={rows}
          className={baseClasses}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          id={htmlFor}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={baseClasses}
          placeholder={placeholder}
        />
      )}
    </div>
  );
}
