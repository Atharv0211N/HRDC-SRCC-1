'use server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  organization: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

export async function submitContactForm(prevState: any, formData: FormData) {
  try {
    const rawData = {
      name: formData.get('name'),
      email: formData.get('email'),
      organization: formData.get('organization') || undefined,
      subject: formData.get('subject'),
      message: formData.get('message')
};

    const validatedData = contactFormSchema.parse(rawData);

    // Save to database
    await prisma.contactMessage.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        organization: validatedData.organization,
        subject: validatedData.subject,
        message: validatedData.message,
        status: 'NEW'
}
});

    // In a real application, you would also send notification and confirmation emails here.
    // e.g. await sendContactNotification(validatedData);
    // e.g. await sendContactConfirmation(validatedData.email, validatedData.name);

    return {
      success: true,
      message: 'Thank you for your message! We will get back to you soon.'
};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: 'Please check your input and try again.',
        errors: error.flatten().fieldErrors
};
    }
    
    console.error('Contact form submission error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.'
};
  }
}
