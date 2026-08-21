import React from "react";
import { Link } from "react-router-dom";
import { footerLinks, brandDetails } from "../data/navigation";

const Footer = () => {
  return (
    <footer className="pt-4 md:pt-14 pb-6 md:pb-10 border-t border-[rgba(131,37,78,0.1)] animate-fade-in relative z-10">
      {/* Official Brand Trust Ribbon */}
      <div className="border-y border-primary/15 py-2.5 px-3 text-center mb-6 md:mb-8 -mx-4 md:-mx-8">
        <p className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-widest">
          {brandDetails.badge}
        </p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-x-4 sm:gap-x-6 gap-y-6 md:gap-y-8 mb-6 md:mb-12">
        {/* Brand & Contact Header */}
        <div className="col-span-3 md:col-span-3 lg:col-span-2 flex flex-col items-center lg:items-start gap-2 md:gap-4 text-center lg:text-left border-b lg:border-b-0 border-[rgba(131,37,78,0.08)] pb-4 lg:pb-0">
          <h3 className="font-serif text-[1.35rem] md:text-[1.8rem] font-bold text-primary">
            {brandDetails.name}
          </h3>
          <p className="text-[0.8rem] md:text-[0.92rem] text-primary font-medium italic">
            "{brandDetails.tagline}"
          </p>
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1.5 mt-1 text-[0.75rem] md:text-[0.82rem] w-full">
            <a
              href={`mailto:${footerLinks.contactInfo.email}`}
              className="text-[rgba(131,37,78,0.85)] hover:text-accent transition-colors flex items-center gap-1.5 font-medium"
              title="Customer Care Support"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="shrink-0"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <span>{footerLinks.contactInfo.email}</span>
            </a>

            <a
              href={`mailto:${footerLinks.contactInfo.exportEmail}`}
              className="text-accent hover:text-primary transition-colors flex items-center gap-1.5 font-semibold"
              title="Global Export & Business Inquiry"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="shrink-0"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{footerLinks.contactInfo.exportEmail}</span>
            </a>
          </div>
        </div>

        {/* Quick Links (Col 1 of 3 on Mobile) */}
        <div className="col-span-1 flex flex-col gap-2 md:gap-5">
          <h4 className="font-bold text-primary uppercase tracking-wider text-[0.68rem] md:text-[0.85rem]">
            Quick Links
          </h4>
          <ul className="flex flex-col gap-1.5 md:gap-2.5">
            {footerLinks.quickLinks.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  className="text-[0.75rem] md:text-[0.92rem] text-[rgba(131,37,78,0.75)] hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service (Col 2 of 3 on Mobile) */}
        <div className="col-span-1 flex flex-col gap-2 md:gap-5">
          <h4 className="font-bold text-primary uppercase tracking-wider text-[0.68rem] md:text-[0.85rem]">
            Customer Service
          </h4>
          <ul className="flex flex-col gap-1.5 md:gap-2.5">
            {footerLinks.customerService.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  className="text-[0.75rem] md:text-[0.92rem] text-[rgba(131,37,78,0.75)] hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* About Links (Col 3 of 3 on Mobile) */}
        <div className="col-span-1 flex flex-col gap-2 md:gap-5">
          <h4 className="font-bold text-primary uppercase tracking-wider text-[0.68rem] md:text-[0.85rem]">
            About
          </h4>
          <ul className="flex flex-col gap-1.5 md:gap-2.5">
            {footerLinks.about.map((link, index) => (
              <li key={index}>
                <Link
                  to={link.path}
                  className="text-[0.75rem] md:text-[0.92rem] text-[rgba(131,37,78,0.75)] hover:text-accent transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Copyright & Legal Links */}
      <div className="border-t border-[rgba(131,37,78,0.08)] pt-4 md:pt-6 flex flex-col md:flex-row justify-between items-center gap-2.5 text-[0.75rem] md:text-[0.85rem] text-[rgba(131,37,78,0.6)]">
        <div className="flex flex-col items-center md:items-start gap-0.5 text-center md:text-left">
          <p>
            © 2026 Tiana Luxora<sup>TM</sup>. All rights reserved.
          </p>
          <p className="text-[10px] font-medium opacity-75">
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
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10px] md:text-xs">
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
