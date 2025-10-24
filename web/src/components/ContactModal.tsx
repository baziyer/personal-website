/**
 * Contact Modal Component
 * Modal for scheduling calls with form validation and spam prevention
 */

'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Mail, Calendar, CheckCircle } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: string;
}

interface FormData {
  name: string;
  email: string;
  company: string;
  intent: string;
  services: string[];
  reason: string;
  timeline: string;
  honeypot: string; // Spam prevention
}

export function ContactModal({ isOpen, onClose, preselectedService }: ContactModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    intent: '',
    services: preselectedService ? [preselectedService] : [],
    reason: '',
    timeline: '',
    honeypot: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const intentOptions = [
    { value: 'hire', label: 'Hire' },
    { value: 'project', label: 'Project' },
    { value: 'help', label: 'I want to help' },
    { value: 'other', label: 'Other' }
  ];

  const availableServices = [
    'Product - Fractional CPO',
    'Product - Product Leadership Sprint',
    'Product - Product Audit',
    'Product - Product Clinic',
    'Business - Fractional Strategy Leader',
    'Business - Go-To-Market Build',
    'Data & Analytics - Fractional Data Leader',
    'Data & Analytics - Analytics Sprint',
    'General Consultation'
  ];

  const timelineOptions = [
    'ASAP',
    'Within 1 week',
    'Within 2-4 weeks',
    'Within 1-2 months',
    'Just exploring options'
  ];

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Preselect service when entrypoint provides one
  useEffect(() => {
    if (!isOpen) return;
    if (preselectedService && !formData.services.includes(preselectedService)) {
      setFormData(prev => ({ ...prev, services: [...prev.services, preselectedService] }));
      // Auto-set intent based on preselected service
      if (preselectedService.includes('Fractional') || preselectedService.includes('Full time')) {
        setFormData(prev => ({ ...prev, intent: 'hire' }));
      } else {
        setFormData(prev => ({ ...prev, intent: 'project' }));
      }
    }
  // include formData.services to satisfy exhaustive-deps; guard maintains idempotence
  }, [isOpen, preselectedService, formData.services]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.intent) newErrors.intent = 'Please select your intent';
    if (!formData.reason.trim()) newErrors.reason = 'Please explain what you\'d like to discuss';
    
    // Services required only for hire/project intents
    if ((formData.intent === 'hire' || formData.intent === 'project') && formData.services.length === 0) {
      newErrors.services = ['Please select at least one engagement option'];
    }
    
    // Spam prevention - honeypot should be empty
    if (formData.honeypot) {
      newErrors.honeypot = 'Spam detected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // POST to API
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data?.errors) setErrors(data.errors);
        throw new Error('Failed to submit');
      }

      setIsSubmitted(true);

      // Redirect to Calendly on success
      window.location.href = 'https://calendly.com/baz-iyer/30-min-catchup';
      
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        ref={modalRef}
        className="bg-background border border-accent1-200/30 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent1-200/20 rounded-lg">
                <Calendar className="w-5 h-5 text-accent1" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Schedule a Call</h2>
                <p className="text-sm text-foreground/60">Let&apos;s discuss how I can help</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {isSubmitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Submitted!</h3>
              <p className="text-foreground/70 mb-4">
                Thanks — I&apos;ve received your details. You&apos;re being redirected to Calendly to pick a time.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot field (hidden) */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={(e) => setFormData(prev => ({ ...prev, honeypot: e.target.value }))}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-accent1-200/30 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent1-400 focus:border-transparent"
                  placeholder="Your full name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-accent1-200/30 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent1-400 focus:border-transparent"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-accent1-200/30 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent1-400 focus:border-transparent"
                  placeholder="Your company name"
                />
              </div>

              {/* Intent Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  What are you looking for? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {intentOptions.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="intent"
                        value={option.value}
                        checked={formData.intent === option.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, intent: e.target.value }))}
                        className="w-4 h-4 text-accent1 border-gray-300 focus:ring-accent1"
                      />
                      <span className="text-sm text-foreground">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.intent && <p className="text-red-500 text-sm mt-1">{errors.intent}</p>}
              </div>

              {/* Services (conditional dropdown) */}
              {(formData.intent === 'hire' || formData.intent === 'project') && (
                <div className="relative">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Engagement Options *
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsServicesOpen(o => !o)}
                    className="w-full px-4 py-3 bg-white/5 border border-accent1-200/30 rounded-lg text-left text-foreground focus:outline-none focus:ring-2 focus:ring-accent1-400 focus:border-transparent"
                  >
                    {formData.services.length > 0 ? formData.services.join(', ') : 'Select engagement options'}
                  </button>
                  {isServicesOpen && (
                    <div className="absolute z-10 mt-2 w-full bg-background border border-accent1-200/30 rounded-lg shadow-lg max-h-56 overflow-auto">
                      {availableServices.map(service => {
                        const selected = formData.services.includes(service);
                        return (
                          <button
                            key={service}
                            type="button"
                            onClick={() => handleServiceToggle(service)}
                            className={`w-full px-4 py-2 text-left hover:bg-white/10 ${selected ? 'bg-white/10' : ''}`}
                          >
                            <span className="inline-flex items-center gap-2">
                              <span className={`w-3 h-3 inline-block rounded-sm border ${selected ? 'bg-accent1 border-accent1-500' : 'border-foreground/30'}`}></span>
                              {service}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {errors.services && <p className="text-red-500 text-sm mt-1">{errors.services}</p>}
                </div>
              )}

              {/* Reason (conditional based on intent) */}
              {(formData.intent === 'hire' || formData.intent === 'project') && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    What would you like to discuss? *
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-accent1-200/30 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent1-400 focus:border-transparent resize-none"
                    placeholder="Please describe your current challenges, goals, or what you&apos;d like to explore..."
                  />
                  {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
                </div>
              )}

              {/* Message field for help/other intents */}
              {(formData.intent === 'help' || formData.intent === 'other') && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/5 border border-accent1-200/30 rounded-lg text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent1-400 focus:border-transparent"
                    placeholder="Tell me more about how you'd like to help or what you're interested in..."
                    rows={4}
                  />
                  {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
                </div>
              )}

              {/* Timeline */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Timeline
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/5 border border-accent1-200/30 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent1-400 focus:border-transparent"
                >
                  <option value="">Select timeline</option>
                  {timelineOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-white/10 text-foreground rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Submit & Continue to Calendly
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
