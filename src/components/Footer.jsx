import React from "react";
import { Link } from "react-router-dom";
import { footerLinks, brandDetails } from "../data/navigation";
import { getPath } from "../utils/paths";
import { ShieldCheck, Mail, Phone, MapPin, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-[#faf6f4] border-t border-primary/10 shadow-[0_-8px_30px_rgba(131,37,78,0.03)] animate-fade-in relative z-10">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 pt-8 md:pt-14 pb-8 md:pb-12">
        {/* Official Brand Trust Ribbon */}
        <div className="border border-primary/10 bg-white/80 backdrop-blur-xs py-3 px-6 text-center mb-8 md:mb-12 rounded-2xl shadow-xs flex flex-wrap items-center justify-center gap-2 sm:gap-6 text-[10px] sm:text-xs font-bold text-primary uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-accent" />
            Proudly Made in India
          </span>
          <span className="hidden sm:inline opacity-30">•</span>
          <span>MSME & Trademark Recognized</span>
          <span className="hidden sm:inline opacity-30">•</span>
          <span>Global Export Grade Formulations</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-8 mb-10 md:mb-14">
          {/* Brand & Contact Header */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 flex flex-col items-center lg:items-start gap-3 text-center lg:text-left border-b lg:border-b-0 border-primary/10 pb-6 lg:pb-0">
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-primary tracking-tight">
              Tiana Luxora<sup className="text-xs ml-1 opacity-70">TM</sup>
            </h3>
            <p className="text-xs sm:text-sm text-primary/75 font-serif italic max-w-sm">
              "{brandDetails.tagline}" — Handcrafted signature fragrances made for timeless distinction.
            </p>

            <div className="flex flex-col gap-2 mt-2 text-xs text-primary/80 w-full max-w-sm">
              <a
                href={`mailto:${footerLinks.contactInfo.email}`}
                className="hover:text-accent transition-colors flex items-center gap-2 justify-center lg:justify-start"
                title="Customer Care Support"
              >
                <Mail size={14} className="text-accent shrink-0" />
                <span>{footerLinks.contactInfo.email}</span>
              </a>

              <a
                href={`mailto:${footerLinks.contactInfo.exportEmail}`}
                className="hover:text-accent transition-colors flex items-center gap-2 justify-center lg:justify-start font-medium"
                title="Global Export & Business Inquiry"
              >
                <Globe size={14} className="text-accent shrink-0" />
                <span>{footerLinks.contactInfo.exportEmail} (B2B Export)</span>
              </a>

              <div className="flex items-center gap-2 justify-center lg:justify-start text-primary/60 text-[11px]">
                <MapPin size={13} className="shrink-0 text-accent" />
                <span>New Delhi, India • GSTIN: {footerLinks.contactInfo.gst}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3 md:gap-4">
            <h4 className="font-bold text-primary uppercase tracking-wider text-xs">
              Discovery
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              {footerLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-primary/75 hover:text-accent transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="flex flex-col gap-3 md:gap-4">
            <h4 className="font-bold text-primary uppercase tracking-wider text-xs">
              Client Concierge
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              {footerLinks.customerService.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-primary/75 hover:text-accent transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* House & Heritage */}
          <div className="flex flex-col gap-3 md:gap-4">
            <h4 className="font-bold text-primary uppercase tracking-wider text-xs">
              The House
            </h4>
            <ul className="flex flex-col gap-2 text-xs">
              {footerLinks.about.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-primary/75 hover:text-accent transition-colors font-medium"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment Methods Trust Bar */}
        <div className="border-t border-primary/10 pt-6 pb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] font-bold text-primary/60 uppercase tracking-wider">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>100% Safe & Encrypted Checkout</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["UPI / GPay / PhonePe", "Visa", "MasterCard", "RuPay", "NetBanking", "COD Available"].map((badge, idx) => (
              <span
                key={idx}
                className="bg-white border border-primary/10 rounded-lg px-2.5 py-1 text-[10px] font-bold text-primary/70 shadow-2xs"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Copyright & Legal Links */}
        <div className="border-t border-primary/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-primary/70">
          <div className="flex flex-col items-center md:items-start gap-1 text-center md:text-left">
            <p className="font-medium">
              © 2026 Tiana Luxora. All rights reserved.
            </p>
            <p className="text-[10px] text-primary/50">
              Handcrafted in India • Certified Batch Standard
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px]">
            {footerLinks.legal.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="hover:text-accent transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

