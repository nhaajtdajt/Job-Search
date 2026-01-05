/**
 * useFormValidation Hook
 * Real-time form validation with debouncing and error management
 */
import { useState, useCallback, useRef } from 'react';

// Common validation rules
const validators = {
  required: (value, message = 'Trường này là bắt buộc') => {
    if (value === null || value === undefined || value === '') {
      return message;
    }
    if (typeof value === 'string' && value.trim() === '') {
      return message;
    }
    return null;
  },

  email: (value, message = 'Email không hợp lệ') => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : message;
  },

  phone: (value, message = 'Số điện thoại không hợp lệ') => {
    if (!value) return null;
    // Vietnamese phone number format
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    return phoneRegex.test(value.replace(/\s/g, '')) ? null : message;
  },

  minLength: (min) => (value, message = `Tối thiểu ${min} ký tự`) => {
    if (!value) return null;
    return value.length >= min ? null : message;
  },

  maxLength: (max) => (value, message = `Tối đa ${max} ký tự`) => {
    if (!value) return null;
    return value.length <= max ? null : message;
  },

  min: (minValue) => (value, message = `Giá trị tối thiểu là ${minValue}`) => {
    if (value === null || value === undefined || value === '') return null;
    return Number(value) >= minValue ? null : message;
  },

  max: (maxValue) => (value, message = `Giá trị tối đa là ${maxValue}`) => {
    if (value === null || value === undefined || value === '') return null;
    return Number(value) <= maxValue ? null : message;
  },

  pattern: (regex, message = 'Định dạng không hợp lệ') => (value) => {
    if (!value) return null;
    return regex.test(value) ? null : message;
  },

  match: (fieldName, message = 'Giá trị không khớp') => (value, allValues) => {
    if (!value) return null;
    return value === allValues[fieldName] ? null : message;
  },
};

/**
 * Custom hook for form validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules per field
 * @param {Object} options - Hook options
 * @returns {Object} Form state and helpers
 */
export function useFormValidation(
  initialValues = {},
  validationRules = {},
  options = {}
) {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    debounceMs = 300,
  } = options;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounceTimers = useRef({});

  // Validate a single field
  const validateField = useCallback((name, value, allValues = values) => {
    const rules = validationRules[name];
    if (!rules) return null;

    const ruleList = Array.isArray(rules) ? rules : [rules];
    
    for (const rule of ruleList) {
      const error = typeof rule === 'function' 
        ? rule(value, allValues)
        : null;
      if (error) return error;
    }
    
    return null;
  }, [validationRules, values]);

  // Validate all fields
  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(fieldName => {
      const error = validateField(fieldName, values[fieldName], values);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationRules, values, validateField]);

  // Handle field change
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));

    if (validateOnChange) {
      // Clear existing timer
      if (debounceTimers.current[name]) {
        clearTimeout(debounceTimers.current[name]);
      }

      // Debounce validation
      debounceTimers.current[name] = setTimeout(() => {
        const error = validateField(name, value, { ...values, [name]: value });
        setErrors(prev => ({
          ...prev,
          [name]: error,
        }));
      }, debounceMs);
    }
  }, [validateOnChange, validateField, values, debounceMs]);

  // Handle field blur
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));

    if (validateOnBlur) {
      const error = validateField(name, values[name]);
      setErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  }, [validateOnBlur, validateField, values]);

  // Clear error for a field
  const clearError = useCallback((name) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }, []);

  // Reset form
  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set field value manually
  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  // Set field error manually
  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({ ...prev, [name]: error }));
  }, []);

  // Get field props (for easy binding)
  const getFieldProps = useCallback((name) => ({
    value: values[name] ?? '',
    onChange: (e) => handleChange(name, e?.target?.value ?? e),
    onBlur: () => handleBlur(name),
  }), [values, handleChange, handleBlur]);

  // Get error state for a field
  const getFieldError = useCallback((name) => ({
    hasError: touched[name] && !!errors[name],
    errorMessage: touched[name] ? errors[name] : null,
  }), [errors, touched]);

  // Check if form is valid
  const isValid = Object.keys(errors).filter(k => errors[k]).length === 0;

  // Check if form is dirty (values changed from initial)
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    // State
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    isDirty,

    // Actions
    handleChange,
    handleBlur,
    validateField,
    validateAll,
    clearError,
    reset,
    setFieldValue,
    setFieldError,
    setIsSubmitting,
    setValues,

    // Helpers
    getFieldProps,
    getFieldError,
  };
}

// Export validators for use in components
export { validators };

export default useFormValidation;
