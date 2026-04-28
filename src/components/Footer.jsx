import React from "react";
import { Link } from "react-router-dom";
import { footerLinks } from "../data/navigation";

const Footer = () => {
  return (
    <footer className="pt-12 md:pt-20 pb-8 md:pb-10 border-t border-[rgba(90,50,50,0.1)] animate-fade-in relative z-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 md:gap-12 mb-12 md:mb-16">
        <div className="col-span-2 md:col-span-3 lg:col-span-1 flex flex-col items-center lg:items-start gap-4 md:gap-6 text-center lg:text-left">
          <h3 className="font-serif text-[1.5rem] md:text-[1.8rem] font-bold text-primary">
            Tiana Luxora<sup>TM</sup>
          </h3>
          <p className="text-[0.9rem] md:text-[0.95rem] text-[rgba(90,50,50,0.7)] leading-relaxed">
            Elevating your senses, embracing elegance.
          </p>
          <div className="flex flex-col gap-2 md:gap-3">
            <h4 className="font-bold text-primary text-[0.9rem] md:text-base">
              Contact Us
            </h4>
            <a
              href={`mailto:${footerLinks.contactInfo.email}`}
              className="text-[0.85rem] md:text-[0.9rem] text-[rgba(90,50,50,0.8)] hover:text-accent transition-colors flex items-center justify-center lg:justify-start gap-2"
            >
              <svg
                width="14"
                height="14"
                md:width="16"
                md:height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              {footerLinks.contactInfo.email}
            </a>
            <a
              href={`tel:${footerLinks.contactInfo.phone.replace(/\s/g, "")}`}
              className="text-[0.85rem] md:text-[0.9rem] text-[rgba(90,50,50,0.8)] hover:text-accent transition-colors flex items-center justify-center lg:justify-start gap-2"
            >
              <svg
                width="14"
                height="14"
                md:width="16"
                md:height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {footerLinks.contactInfo.phone}
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:gap-6">
          <h4 className="font-bold text-primary uppercase tracking-wider text-[0.75rem] md:text-[0.85rem]">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-2 md:gap-3">
            {footerLinks.quickLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  className="text-[0.85rem] md:text-[0.95rem] text-[rgba(90,50,50,0.7)] hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 md:gap-6">
          <h4 className="font-bold text-primary uppercase tracking-wider text-[0.75rem] md:text-[0.85rem]">
            Customer Service
          </h4>
          <ul className="flex flex-col gap-2 md:gap-3">
            {footerLinks.customerService.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  className="text-[0.85rem] md:text-[0.95rem] text-[rgba(90,50,50,0.7)] hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-4 md:gap-6">
          <h4 className="font-bold text-primary uppercase tracking-wider text-[0.75rem] md:text-[0.85rem]">
            About
          </h4>
          <ul className="flex flex-col gap-2 md:gap-3">
            {footerLinks.about.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  className="text-[0.85rem] md:text-[0.95rem] text-[rgba(90,50,50,0.7)] hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 md:col-span-3 lg:col-span-1 flex flex-col gap-4 md:gap-6 mt-4 lg:mt-0">
          <h4 className="font-bold text-primary uppercase tracking-wider text-[0.75rem] md:text-[0.85rem]">
            Newsletter
          </h4>
          <p className="text-[0.85rem] md:text-[0.9rem] text-[rgba(90,50,50,0.7)]">
            Join Our Newsletter Subscribe for exclusive updates & offers
          </p>
          <div className="relative mt-1 md:mt-2">
            <input
              type="email"
              placeholder="Your email address"
              className="w-full bg-white/50 border border-[rgba(90,50,50,0.1)] rounded-full px-5 md:px-6 py-2.5 md:py-3 outline-none focus:border-accent transition-colors text-[0.9rem]"
            />
            <button className="absolute right-1.5 md:right-2 top-1 md:top-1.5 bg-primary text-white p-1.5 md:p-2 rounded-full hover:bg-accent transition-colors">
              <svg
                width="18"
                height="18"
                md:width="20"
                md:height="20"
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
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-[rgba(90,50,50,0.05)] pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[0.85rem] text-[rgba(90,50,50,0.5)]">
        <div className="flex flex-col items-center md:items-start gap-1">
          <p>
            © 2026 Tiana Luxora<sup>TM</sup>. All rights reserved.
          </p>
          <p className="text-[10px] md:text-[11px] font-medium opacity-70">
            Designed & Developed by{" "}
            <a
              href="https://inexarum.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-bold hover:text-accent transition-colors"
            >
              iNexarum Private Limited
            </a>
          </p>
        </div>
        <div className="flex gap-6">
          {footerLinks.legal.map((link, index) => (
            <Link
              key={index}
              to={link.path}
              className="hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
