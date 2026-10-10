export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { Hero } from '@/components/shared/hero';
import { ContactForm } from '@/components/shared/contact-form';
import { ScrollReveal } from '@/components/motion/scroll-reveal';
import { SITE_CONFIG } from '@/lib/constants';
import { Mail, MapPin, ExternalLink as Linkedin, Camera as Instagram } from 'lucide-react';
import Link from 'next/link';
import { submitContactForm } from '@/actions/contact';

export const metadata: Metadata = {
  title: 'Contact',
  description: `Get in touch with the ${SITE_CONFIG.orgName} for collaborations, queries, or to learn more about our work.`,
};

export default function ContactPage() {
  return (
    <main className="flex min-h-screen flex-col w-full">
      <Hero
        title="Contact Us"
        description="We're always open to new collaborations, questions, and conversations."
        compact
      />

      <section className="section-padding bg-surface">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
            
            {/* Contact Information */}
            <ScrollReveal direction="left" className="space-y-12">
              <div>
                <h2 className="text-3xl font-bold text-text-primary mb-6">Let's Connect</h2>
                <p className="text-lg text-text-secondary leading-relaxed">
                  Whether you're an industry professional looking to collaborate, a student interested in our initiatives, or an organization seeking partnership, we'd love to hear from you.
                </p>
              </div>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-full shrink-0 mt-1">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-1">Email Us</h3>
                    <a 
                      href={`mailto:${SITE_CONFIG.email}`}
                      className="text-text-secondary hover:text-primary transition-colors text-lg"
                    >
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-full shrink-0 mt-1">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary mb-1">Visit Us</h3>
                    <p className="text-text-secondary text-lg leading-relaxed max-w-sm">
                      {SITE_CONFIG.address}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Follow Our Journey</h3>
                <div className="flex gap-4">
                  <Link 
                    href="#" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-white border border-border rounded-full text-text-secondary hover:text-primary hover:border-primary/50 hover:shadow-hover transition-all"
                  >
                    <Linkedin className="w-5 h-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                  <Link 
                    href="#" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-white border border-border rounded-full text-text-secondary hover:text-primary hover:border-primary/50 hover:shadow-hover transition-all"
                  >
                    <Instagram className="w-5 h-5" />
                    <span className="sr-only">Instagram</span>
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            {/* Contact Form */}
            <ScrollReveal direction="right" delay={0.2} className="relative z-10 lg:-mt-24">
              <div className="bg-white rounded-xl shadow-modal overflow-hidden">
                <div className="p-8 pb-6 border-b border-border bg-surface">
                  <h3 className="text-2xl font-bold text-text-primary mb-2">Send a Message</h3>
                  <p className="text-text-secondary">Fill out the form below and our team will get back to you promptly.</p>
                </div>
                <div className="p-2 sm:p-4">
                  <ContactForm action={submitContactForm} />
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>
    </main>
  );
}
