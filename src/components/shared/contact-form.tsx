'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  organization: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  action?: any;
}

export function ContactForm({ action = async () => ({ success: true }) }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    organization: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when typing
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrors({});

    try {
      // Validate form
      const validatedData = contactFormSchema.parse(formData);
      
      // Call server action
      const formDataObj = new FormData();
      Object.entries(validatedData).forEach(([key, value]) => {
        if (value) formDataObj.append(key, value);
      });
      
      const result = await action(null, formDataObj);
      
      if (result.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', organization: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.message || 'Something went wrong.');
        if (result.errors) {
          setErrors(result.errors as any);
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            formattedErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(formattedErrors);
      } else {
        setSubmitStatus('error');
        setErrorMessage('Something went wrong. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[14px] border border-[#E2E8F0] shadow-sm max-w-2xl mx-auto space-y-6">
      {submitStatus === 'success' && (
        <div className="flex items-center gap-3 bg-green-50 text-green-800 p-4 rounded-[10px] border border-green-200">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <p className="text-[15px] font-medium">Thank you for your message! We will get back to you soon.</p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="flex items-center gap-3 bg-red-50 text-red-800 p-4 rounded-[10px] border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-[15px] font-medium">{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-semibold text-[#0F172A]">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={cn(
              "w-full px-4 py-3 bg-[#F8FAFC] border rounded-[10px] text-[15px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0056D2] focus:bg-white transition-all",
              errors.name ? "border-red-500" : "border-[#E2E8F0]"
            )}
            placeholder="John Doe"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-[#0F172A]">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={cn(
              "w-full px-4 py-3 bg-[#F8FAFC] border rounded-[10px] text-[15px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0056D2] focus:bg-white transition-all",
              errors.email ? "border-red-500" : "border-[#E2E8F0]"
            )}
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="organization" className="block text-sm font-semibold text-[#0F172A]">
          Organization (Optional)
        </label>
        <input
          type="text"
          id="organization"
          name="organization"
          value={formData.organization}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[10px] text-[15px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0056D2] focus:bg-white transition-all"
          placeholder="Company or Institution"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="subject" className="block text-sm font-semibold text-[#0F172A]">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className={cn(
            "w-full px-4 py-3 bg-[#F8FAFC] border rounded-[10px] text-[15px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0056D2] focus:bg-white transition-all",
            errors.subject ? "border-red-500" : "border-[#E2E8F0]"
          )}
          placeholder="How can we help you?"
        />
        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-semibold text-[#0F172A]">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          className={cn(
            "w-full px-4 py-3 bg-[#F8FAFC] border rounded-[10px] text-[15px] text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0056D2] focus:bg-white transition-all resize-y",
            errors.message ? "border-red-500" : "border-[#E2E8F0]"
          )}
          placeholder="Your message here..."
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center bg-[#0056D2] text-white px-8 py-4 rounded-[10px] text-[16px] font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}
