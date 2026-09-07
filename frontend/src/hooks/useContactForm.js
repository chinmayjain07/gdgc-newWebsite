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

export function useContactForm(onSuccess) {
  const [formData, setFormData] = useState(INITIAL_CONTACT_FORM);
  const [submitStatus, setSubmitStatus] = useState(null); // 'loading' | 'success' | 'error' | null
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      }, 4000);
      return;
    }

    setSubmitStatus('loading');
    setErrorMessage('');

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

  const resetForm = () => {
    setFormData(INITIAL_CONTACT_FORM);
    setSubmitStatus(null);
    setErrorMessage('');
  };

  return {
    formData,
    submitStatus,
    errorMessage,
    handleChange,
    handleSubmit,
    resetForm,
    setFormData,
  };
}
