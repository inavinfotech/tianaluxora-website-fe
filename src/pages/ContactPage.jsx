import React, { useState } from "react";
import Footer from "../components/Footer";
import { footerLinks } from "../data/navigation";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate with backend API
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const faqs = [
    {
      q: "What are your shipping timelines?",
      a: "We ship within 2–5 business days across India. International orders may take 7–14 business days depending on your location.",
    },
    {
      q: "Do you offer returns or exchanges?",
      a: "Yes! We accept returns within 7 days of delivery for unopened products. Please contact us with your order number to initiate a return.",
    },
    {
      q: "Are your fragrances cruelty-free?",
      a: "Absolutely. All Tiana Luxora products are 100% cruelty-free and never tested on animals.",
    },
    {
      q: "How can I track my order?",
      a: "Once your order ships, you'll receive a tracking link via email and SMS. You can also check your order status from your profile page.",
    },
  ];

  const contactMethods = [
    {
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
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
      description: "We typically respond within 24 hours",
    },
    {
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      title: "Call Us",
      value: footerLinks.contactInfo.phone,
      href: `tel:${footerLinks.contactInfo.phone.replace(/\s/g, "")}`,
      description: "Mon – Sat, 10 AM – 7 PM IST",
    },
    {
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
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
      <div className="max-w-[1200px] mx-auto space-y-16 mt-8 px-4">
        {/* Page Title */}
        <div className="text-center" id="contact-header">
          <h1 className="font-serif text-4xl md:text-5xl text-primary font-bold tracking-tight">
            Get In Touch
          </h1>
          <p className="text-primary/60 mt-4 text-lg font-light max-w-xl mx-auto">
            We'd love to hear from you. Whether it's a question, feedback, or
            just to say hello — reach out anytime.
          </p>
          <div className="w-24 h-1 bg-accent mx-auto mt-6 rounded-full opacity-50"></div>
        </div>

        {/* Contact Methods Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6" id="contact-methods">
          {contactMethods.map((method, idx) => (
            <div
              key={idx}
              className="bg-white/40 backdrop-blur-sm rounded-[2rem] border border-accent/10 p-8 flex flex-col items-center text-center shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-accent/10 group"
            >
              <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-5 transition-all duration-500 group-hover:bg-accent group-hover:text-white group-hover:scale-110">
                {method.icon}
              </div>
              <h3 className="font-serif text-xl text-primary font-bold mb-1">
                {method.title}
              </h3>
              {method.href ? (
                <a
                  href={method.href}
                  className="text-accent hover:text-primary transition-colors font-medium text-[0.95rem]"
                >
                  {method.value}
                </a>
              ) : (
                <span className="text-accent font-medium text-[0.95rem]">
                  {method.value}
                </span>
              )}
              <p className="text-primary/50 text-sm mt-2 font-light">
                {method.description}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Form + Map Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8" id="contact-form-section">
          {/* Contact Form */}
          <div className="bg-white/40 backdrop-blur-sm rounded-[2rem] border border-accent/10 p-8 md:p-10 shadow-xl shadow-accent/5">
            <h2 className="font-serif text-3xl text-primary font-bold mb-2 relative inline-block">
              Send Us a Message
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-accent"></span>
            </h2>
            <p className="text-primary/60 font-light mb-8 mt-4">
              Fill in the form below and we'll get back to you as soon as
              possible.
            </p>

            {submitted && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-2xl px-6 py-4 flex items-center gap-3 animate-fade-in">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="font-medium">
                  Thank you! Your message has been sent successfully.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" id="contact-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-medium text-primary/70 mb-1.5"
                  >
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Jane Doe"
                    className="w-full bg-white/60 border border-accent/15 rounded-xl px-5 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all text-[0.95rem] placeholder:text-primary/30"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-medium text-primary/70 mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="jane@example.com"
                    className="w-full bg-white/60 border border-accent/15 rounded-xl px-5 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all text-[0.95rem] placeholder:text-primary/30"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="contact-subject"
                  className="block text-sm font-medium text-primary/70 mb-1.5"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help?"
                  className="w-full bg-white/60 border border-accent/15 rounded-xl px-5 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all text-[0.95rem] placeholder:text-primary/30"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-primary/70 mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Tell us more about your inquiry..."
                  className="w-full bg-white/60 border border-accent/15 rounded-xl px-5 py-3 outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all text-[0.95rem] placeholder:text-primary/30 resize-none"
                />
              </div>
              <button
                type="submit"
                id="contact-submit"
                className="w-full sm:w-auto bg-primary text-white px-10 py-3.5 rounded-full font-medium tracking-wide hover:bg-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 active:scale-[0.97] flex items-center justify-center gap-2"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
                Send Message
              </button>
            </form>
          </div>

          {/* Map / Illustration Side */}
          <div className="bg-white/40 backdrop-blur-sm rounded-[2rem] border border-accent/10 overflow-hidden shadow-xl shadow-accent/5 flex flex-col">
            {/* Decorative Map Placeholder */}
            <div className="flex-1 relative min-h-[300px] bg-gradient-to-br from-[#fff5f0] to-[#ffe4d6] flex items-center justify-center">
              <div className="absolute inset-0 opacity-[0.04]">
                {/* Decorative grid pattern */}
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
                        stroke="var(--primary, #5a3232)"
                        strokeWidth="1"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              <div className="relative z-10 text-center p-8">
                {/* Animated location pin */}
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 mb-6 animate-bounce-slow">
                  <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--accent, #d48c6a)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                </div>

                <h3 className="font-serif text-2xl text-primary font-bold mb-2">
                  Tiana Luxora<sup>TM</sup>
                </h3>
                <p className="text-primary/60 font-light text-sm leading-relaxed max-w-xs mx-auto">
                  New Delhi, India
                  <br />
                  Crafting luxury fragrances with love
                </p>

                {/* Decorative rings */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-accent/10 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-accent/5 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full border border-accent/[0.03] pointer-events-none"></div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="p-6 md:p-8 border-t border-accent/10">
              <h4 className="font-serif text-lg text-primary font-bold mb-4 flex items-center gap-2">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Business Hours
              </h4>
              <div className="space-y-2 text-sm">
                {[
                  { day: "Monday – Friday", time: "10:00 AM – 7:00 PM" },
                  { day: "Saturday", time: "10:00 AM – 4:00 PM" },
                  { day: "Sunday", time: "Closed" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center py-1.5 border-b border-accent/5 last:border-0"
                  >
                    <span className="text-primary/70 font-medium">
                      {item.day}
                    </span>
                    <span
                      className={`font-medium ${
                        item.time === "Closed"
                          ? "text-red-400"
                          : "text-accent"
                      }`}
                    >
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-20">
        <Footer />
      </div>

      {/* Inline animation for the bounce-slow on location pin */}
      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ContactPage;
