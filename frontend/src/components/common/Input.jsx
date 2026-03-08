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
            block text-sm font-medium mb-1.5 transition-colors duration-200
            ${focused ? 'text-primary' : 'text-text-muted'}
            ${error ? 'text-error' : ''}
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
              className={`w-5 h-5 transition-colors duration-200 ${
                focused ? 'text-primary' : 'text-text-muted'
              } ${error ? 'text-error' : ''}`}
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
            w-full rounded-xl border-2 bg-white
            px-4 py-3 text-text
            placeholder:text-text-muted/50
            transition-all duration-200
            outline-none
            disabled:opacity-50 disabled:cursor-not-allowed
            ${Icon ? 'pl-11' : ''}
            ${
              error
                ? 'border-error focus:border-error focus:ring-2 focus:ring-error/20'
                : 'border-border focus:border-primary focus:ring-2 focus:ring-primary/20'
            }
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-error animate-slide-up">{error}</p>
      )}
    </div>
  );
}
