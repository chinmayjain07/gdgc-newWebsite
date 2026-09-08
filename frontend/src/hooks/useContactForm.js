import { useState } from 'react';

export const INITIAL_CONTACT_FORM = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export const SUBJECT_OPTIONS = [
  { value: '', label: 'Select a topic' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'membership', label: 'Join GDGC' },
  { value: 'events', label: 'Event Question' },
  { value: 'partnership', label: 'Partnership/Sponsorship' },
  { value: 'speaking', label: 'Speak at Event' },
  { value: 'media', label: 'Media/Press' },
  { value: 'other', label: 'Other' },
];

export function validateEmail(email) {
  const trimmed = (email || '').trim();
  if (!trimmed) {
    return { isValid: false, message: 'Please enter your email address.' };
  }
  if (!trimmed.includes('@')) {
    return {
      isValid: false,
      message: "Email is incorrect: missing '@' symbol (e.g. yourname@gmail.com).",
    };
  }
  if (trimmed.startsWith('@')) {
    return {
      isValid: false,
      message: "Email is incorrect: missing username before '@'.",
    };
  }
  const parts = trimmed.split('@');
  if (parts.length > 2) {
    return {
      isValid: false,
      message: "Email is incorrect: multiple '@' symbols found.",
    };
  }
  const domain = parts[1];
  if (!domain || !domain.includes('.')) {
    return {
      isValid: false,
      message: "Email is incorrect: missing valid domain extension (e.g. .com, .edu).",
    };
  }
  if (domain.endsWith('.')) {
    return {
      isValid: false,
      message: "Email is incorrect: domain cannot end with a period.",
    };
  }
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      message: 'Incorrect email entered: please provide a valid email format.',
    };
  }
  return { isValid: true, message: '' };
}

export function useContactForm(onSuccess) {
  const [formData, setFormData] = useState(INITIAL_CONTACT_FORM);
  const [submitStatus, setSubmitStatus] = useState(null); // 'loading' | 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'email' && emailError) {
      setEmailError('');
    }
  };

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setSubmitStatus('error');
      setErrorMessage('Please fill in all required fields.');
      setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage('');
      }, 5000);
      return;
    }

    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.isValid) {
      setSubmitStatus('error');
      setErrorMessage(emailCheck.message);
      setEmailError(emailCheck.message);
      setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage('');
      }, 6000);
      return;
    }

    setSubmitStatus('loading');
    setErrorMessage('');
    setEmailError('');

    try {
      // Simulate network submission delay (or replace with live API endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1200));

      setSubmitStatus('success');
      setFormData(INITIAL_CONTACT_FORM);
      if (onSuccess) onSuccess();

      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    } catch (err) {
      setSubmitStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
      setTimeout(() => {
        setSubmitStatus(null);
        setErrorMessage('');
      }, 5000);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'email' && value.trim()) {
      const check = validateEmail(value);
      if (!check.isValid) {
        setSubmitStatus('error');
        setErrorMessage(check.message);
        setEmailError(check.message);
      }
    }
  };

  const clearError = () => {
    setSubmitStatus(null);
    setErrorMessage('');
    setEmailError('');
  };

  const resetForm = () => {
    setFormData(INITIAL_CONTACT_FORM);
    setSubmitStatus(null);
    setErrorMessage('');
    setEmailError('');
  };

  return {
    formData,
    submitStatus,
    errorMessage,
    emailError,
    setEmailError,
    handleChange,
    handleBlur,
    handleSubmit,
    clearError,
    resetForm,
    setFormData,
  };
}
