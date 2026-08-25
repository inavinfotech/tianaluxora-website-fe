import React, { useState } from "react";
import { footerLinks } from "../data/navigation";

const customStyles = `
  @keyframes bounce-slow {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  .animate-bounce-slow {
    animation: bounce-slow 3s ease-in-out infinite;
  }
`;

const ContactPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: "What is your return & replacement policy?",
      a: "Due to personal care & hygiene standards, opened fragrance items are non-returnable. If your order arrives damaged, defective, or missing an item, a replacement will be issued ONLY if reported within 48 hours of delivery. A continuous, unedited Unboxing Video + photo proof is MANDATORY and must be emailed to tianacare6@gmail.com.",
    },
    {
      q: "What are the requirements for the Unboxing Video?",
      a: "The unboxing video must be continuous and unedited, clearly showing the outer box parcel label, the unbroken security seal before opening, and the damaged/defective product inside. Requests without an unedited unboxing video cannot be processed.",
    },
    {
      q: "What are your shipping timelines across India & Internationally?",
      a: "Domestic orders across India are dispatched within 2–5 business days via premium express couriers. International export consignments take 7–14 business days depending on destination customs clearance.",
    },
    {
      q: "How can I place Global B2B Export or Bulk Orders?",
      a: "We welcome international trade, corporate gifting packages, and overseas dealership inquiries! Please reach out to our dedicated global export concierge team at tianaluxora.global@gmail.com.",
    },
    {
      q: "Is Tiana Luxora™ GST registered and MSME recognized?",
      a: "Yes! Tiana Luxora™ is a Trademark Registered and MSME-recognized Indian luxury fragrance house. Our official GST Identification Number is 07ADRPA1310K1ZU.",
    },
    {
      q: "Are your fragrances 100% Made in India & Cruelty-Free?",
      a: "Yes, every bottle is proudly Made in India by skilled Indian artisans and hardworking women, supporting the vision of Viksit Bharat. All products are 100% cruelty-free.",
    },
  ];

  const contactMethods = [
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      title: "Email Us",
      value: footerLinks.contactInfo.email,
      href: `mailto:${footerLinks.contactInfo.email}`,
      description: "Response within 24 hours",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      title: "Call Us",
      value: footerLinks.contactInfo.phone,
      href: `tel:${footerLinks.contactInfo.phone.replace(/\s/g, "")}`,
      description: "Mon – Sat, 10 AM – 7 PM",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      title: "Visit Us",
      value: "New Delhi, India",
      href: null,
      description: "By appointment only",
    },
  ];

  return (
    <div className="animate-fade-in pb-10">
      <div className="max-w-[1050px] mx-auto space-y-8 md:space-y-10 mt-6 px-4">
        {/* Page Title - Compact */}
        <div className="text-center" id="contact-header">
          <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] text-accent block mb-1">
            Customer Concierge & Care
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-primary font-bold tracking-tight">
            Get In Touch
          </h1>
          <p className="text-primary/70 mt-2 text-sm md:text-base font-light max-w-lg mx-auto">
            We'd love to hear from you. Reach out anytime for inquiries, orders, or support.
          </p>
        </div>

        {/* Contact Methods - Compact Single Card Panel */}
        <div
          className="bg-white/70 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/80 shadow-xs p-3.5 sm:p-5 md:p-6"
          id="contact-methods"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-primary/10">
            {contactMethods.map((method, idx) => (
              <div
                key={idx}
                className="flex items-center md:flex-col md:items-center text-left md:text-center gap-3.5 md:gap-2.5 py-3 md:py-1 px-2 md:px-5 group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-accent/10 flex items-center justify-center text-accent shrink-0 group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-xs">
                  {method.icon}
                </div>
                <div className="min-w-0 flex-1 md:flex-initial">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-primary/50 block">
                    {method.title}
                  </span>
                  {method.href ? (
                    <a
                      href={method.href}
                      className="text-[0.92rem] sm:text-[0.96rem] font-serif font-bold text-primary hover:text-accent transition-colors block truncate mt-0.5"
                    >
                      {method.value}
                    </a>
                  ) : (
                    <span className="text-[0.92rem] sm:text-[0.96rem] font-serif font-bold text-primary block truncate mt-0.5">
                      {method.value}
                    </span>
                  )}
                  <p className="text-[11px] text-primary/55 mt-0.5 font-light">
                    {method.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location & Business Hours Card - Compact */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/80 overflow-hidden shadow-xs flex flex-col md:flex-row">
          {/* Left: Location & Headquarters */}
          <div className="flex-1 relative min-h-[160px] md:min-h-[180px] bg-gradient-to-br from-[#fff0f5] to-[#ffe4ec] flex items-center justify-center p-6 text-center">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
              <svg width="100%" height="100%">
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="var(--primary, #83254e)"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-accent/15 text-accent mb-2.5 animate-bounce-slow shadow-xs">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--accent, #d97398)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>

              <h3 className="font-serif text-xl md:text-2xl text-primary font-bold mb-0.5">
                Tiana Luxora<sup>TM</sup> Headquarters
              </h3>
              <p className="text-primary/70 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
                New Delhi, India • MSME & Trademark Registered
              </p>
            </div>
          </div>

          {/* Right: Business Hours */}
          <div className="p-5 md:p-6 flex-1 border-t md:border-t-0 md:border-l border-primary/10 flex flex-col justify-center">
            <h4 className="font-serif text-base font-bold text-primary mb-2.5 flex items-center gap-2">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Operating Concierge Hours
            </h4>
            <div className="space-y-1.5 text-xs sm:text-sm">
              {[
                { day: "Monday – Friday", time: "10:00 AM – 7:00 PM IST" },
                { day: "Saturday", time: "10:00 AM – 4:00 PM IST" },
                { day: "Sunday", time: "Closed" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-1 border-b border-primary/5 last:border-0"
                >
                  <span className="text-primary/70 font-medium">
                    {item.day}
                  </span>
                  <span
                    className={`font-semibold ${
                      item.time === "Closed"
                        ? "text-red-400"
                        : "text-primary"
                    }`}
                  >
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions Section */}
        <div id="faqs" className="bg-white/70 backdrop-blur-md rounded-2xl md:rounded-3xl border border-white/80 p-5 sm:p-8 md:p-10 shadow-xs">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="font-serif text-2xl md:text-3xl text-primary font-bold">
              Frequently Asked Questions & Policies
            </h2>
            <p className="text-primary/60 text-xs sm:text-sm mt-1.5 max-w-xl mx-auto">
              Everything you need to know about our shipping, replacements, unboxing video requirements, and global export.
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white/85 rounded-xl border border-primary/10 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full text-left p-4 flex items-center justify-between font-serif font-bold text-primary text-sm sm:text-base cursor-pointer hover:text-accent transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-accent text-lg font-bold ml-3 shrink-0">
                    {openFaq === idx ? "−" : "+"}
                  </span>
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs sm:text-sm text-[rgba(131,37,78,0.8)] leading-relaxed border-t border-primary/5 pt-2.5 bg-neutral-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Business & GST Trust Banner */}
          <div className="mt-8 pt-5 border-t border-primary/10 text-center text-[11px] sm:text-xs text-primary/70 flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-medium">
            <span>
              <strong>GSTIN:</strong> 07ADRPA1310K1ZU
            </span>
            <span>•</span>
            <span>
              <strong>Brand Status:</strong> Trademark Registered & MSME Recognized
            </span>
            <span>•</span>
            <span>
              <strong>Support Email:</strong> tianacare6@gmail.com
            </span>
          </div>
        </div>
      </div>

      {/* Inline animation for the bounce-slow on location pin */}
      <style>{customStyles}</style>
    </div>
  );
};

export default ContactPage;
