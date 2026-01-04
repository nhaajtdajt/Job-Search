import { forwardRef, useState, useCallback, memo } from 'react';
import { Eye, EyeOff, AlertCircle, Check, Info } from 'lucide-react';

/**
 * FormInput Component
 * Enhanced input with inline validation, error/success states, and accessibility
 */
export const FormInput = forwardRef(function FormInput({
  type = 'text',
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error = null,
  success = null,
  helperText = null,
  required = false,
  disabled = false,
  readOnly = false,
  icon: Icon = null,
  className = '',
  inputClassName = '',
  ...props
}, ref) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  
  const hasError = !!error;
  const hasSuccess = !!success;

  // Border color based on state
  const borderColor = hasError 
    ? 'border-red-500 focus:ring-red-500' 
    : hasSuccess 
      ? 'border-green-500 focus:ring-green-500'
      : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500';

  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback((e) => {
    setIsFocused(false);
    onBlur?.(e);
  }, [onBlur]);

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        {/* Input */}
        <input
          ref={ref}
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          aria-invalid={hasError}
          aria-describedby={error ? `${name}-error` : helperText ? `${name}-helper` : undefined}
          className={`
            w-full px-4 py-2.5 rounded-lg border transition-all duration-200
            ${borderColor}
            ${Icon ? 'pl-10' : ''}
            ${isPassword ? 'pr-10' : ''}
            ${hasError || hasSuccess ? 'pr-10' : ''}
            ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}
            ${readOnly ? 'bg-gray-50' : ''}
            focus:outline-none focus:ring-2
            ${inputClassName}
          `}
          {...props}
        />
        
        {/* Right Icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {/* Password Toggle */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          )}
          
          {/* Status Icons */}
          {hasError && !isPassword && (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          {hasSuccess && !isPassword && (
            <Check className="w-5 h-5 text-green-500" />
          )}
        </div>
      </div>
      
      {/* Error Message */}
      {hasError && (
        <p id={`${name}-error`} className="text-sm text-red-600 flex items-center gap-1 animate-fadeIn">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
      
      {/* Success Message */}
      {hasSuccess && !hasError && (
        <p className="text-sm text-green-600 flex items-center gap-1 animate-fadeIn">
          <Check className="w-4 h-4" />
          {success}
        </p>
      )}
      
      {/* Helper Text */}
      {helperText && !hasError && !hasSuccess && (
        <p id={`${name}-helper`} className="text-sm text-gray-500 flex items-center gap-1">
          <Info className="w-4 h-4" />
          {helperText}
        </p>
      )}
    </div>
  );
});

/**
 * FormTextarea Component
 * Enhanced textarea with validation
 */
export const FormTextarea = forwardRef(function FormTextarea({
  label,
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error = null,
  success = null,
  helperText = null,
  required = false,
  disabled = false,
  rows = 4,
  maxLength = null,
  className = '',
  ...props
}, ref) {
  const hasError = !!error;
  const hasSuccess = !!success;
  const charCount = value?.length || 0;

  const borderColor = hasError 
    ? 'border-red-500 focus:ring-red-500' 
    : hasSuccess 
      ? 'border-green-500 focus:ring-green-500'
      : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500';

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Textarea */}
      <textarea
        ref={ref}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={hasError}
        className={`
          w-full px-4 py-2.5 rounded-lg border transition-all duration-200
          ${borderColor}
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}
          focus:outline-none focus:ring-2 resize-none
        `}
        {...props}
      />
      
      {/* Character Count */}
      {maxLength && (
        <div className="flex justify-end">
          <span className={`text-xs ${charCount >= maxLength ? 'text-red-500' : 'text-gray-400'}`}>
            {charCount}/{maxLength}
          </span>
        </div>
      )}
      
      {/* Error Message */}
      {hasError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
      
      {/* Success Message */}
      {hasSuccess && !hasError && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <Check className="w-4 h-4" />
          {success}
        </p>
      )}
      
      {/* Helper Text */}
      {helperText && !hasError && !hasSuccess && (
        <p className="text-sm text-gray-500 flex items-center gap-1">
          <Info className="w-4 h-4" />
          {helperText}
        </p>
      )}
    </div>
  );
});

/**
 * FormSelect Component
 * Enhanced select with validation
 */
export const FormSelect = forwardRef(function FormSelect({
  label,
  name,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = 'Chọn...',
  error = null,
  success = null,
  helperText = null,
  required = false,
  disabled = false,
  className = '',
  ...props
}, ref) {
  const hasError = !!error;
  const hasSuccess = !!success;

  const borderColor = hasError 
    ? 'border-red-500 focus:ring-red-500' 
    : hasSuccess 
      ? 'border-green-500 focus:ring-green-500'
      : 'border-gray-300 focus:ring-orange-500 focus:border-orange-500';

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={name}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Select */}
      <select
        ref={ref}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        aria-invalid={hasError}
        className={`
          w-full px-4 py-2.5 rounded-lg border transition-all duration-200
          ${borderColor}
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white'}
          focus:outline-none focus:ring-2
        `}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      
      {/* Error Message */}
      {hasError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" />
          {error}
        </p>
      )}
      
      {/* Success/Helper */}
      {hasSuccess && !hasError && (
        <p className="text-sm text-green-600 flex items-center gap-1">
          <Check className="w-4 h-4" />
          {success}
        </p>
      )}
      
      {helperText && !hasError && !hasSuccess && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

export default FormInput;
