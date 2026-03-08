import { useState } from 'react';

export default function Input({
  label,
  type = 'text',
  placeholder = '',
  error,
  icon: Icon,
  value,
  onChange,
  name,
  required = false,
  disabled = false,
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label
          className={`
            block text-sm font-medium mb-1.5 transition-md-fast
            ${error ? 'text-error' : focused ? 'text-primary' : 'text-text-muted'}
          `}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon
              className={`w-5 h-5 transition-md-fast ${
                error ? 'text-error' : focused ? 'text-primary' : 'text-text-muted'
              }`}
            />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={`
            w-full rounded-lg border bg-surface
            px-4 py-3 text-text
            placeholder:text-text-disabled
            transition-md
            outline-none
            disabled:opacity-[0.38] disabled:cursor-not-allowed
            ${Icon ? 'pl-11' : ''}
            ${
              error
                ? 'border-error focus:border-error focus:ring-2 focus:ring-error/[0.12]'
                : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/[0.12]'
            }
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-error animate-slide-up">{error}</p>
      )}
    </div>
  );
}
