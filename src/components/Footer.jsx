import React from "react";
import { Link } from "react-router-dom";
import { footerLinks, brandDetails } from "../data/navigation";
import { getPath } from "../utils/paths";
import PaymentLogos from "./PaymentLogos";
import { ShieldCheck, Mail, MapPin, Globe, ArrowUp, Clock } from "lucide-react";

const TRUST_BADGES = [
  { src: "/images/badges/made-in-india.svg", alt: "Proudly Made in India" },
  { src: "/images/badges/msme.svg", alt: "MSME Registered" },
  { src: "/images/badges/trademark.svg", alt: "Trademark Recognized" },
  { src: "/images/badges/export-grade.svg", alt: "Global Export Grade Formulations" },
];

const LINK_GROUPS = [
  { title: "Explore", links: footerLinks.quickLinks },
  { title: "Customer Care", links: footerLinks.customerService },
  { title: "The House", links: footerLinks.about },
];

// Brand icons (lucide v1 ships no brand marks) — simple monochrome glyphs
const SOCIAL_ICONS = {
  instagram: (
    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm0 2a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM17.5 5.8a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z" />
  ),
  facebook: <path d="M14 8V6.5c0-.8.5-1.5 1.5-1.5H17V2h-2.5C11.9 2 11 3.9 11 6v2H8.5v3H11v11h3V11h2.6l.4-3H14z" />,
  youtube: (
    <path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8zM10 15V9l5.2 3L10 15z" />
  ),
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.5h4V21H3V9.5zm6.5 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-5.2c0-1.2 0-2.8-1.7-2.8s-2 1.3-2 2.7V21h-4V9.5z" />
  ),
  whatsapp: (
    <path d="M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2zm5.6 14.1c-.2.7-1.4 1.3-1.9 1.3-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5-4.5-.2-.2-1.2-1.6-1.2-3s.7-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.1.1.7-.1 1.4z" />
  ),
  x: <path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5z" />,
};

const LinkGroup = ({ title, links }) => (
  <div className="col-span-2 lg:col-span-1 md:order-2 lg:order-none min-w-0">
    <h4 className="font-bold text-primary uppercase tracking-[0.15em] text-[11px] sm:text-xs mb-3 sm:mb-4">{title}</h4>
    <ul className="flex flex-col gap-2 sm:gap-2.5 text-[12px] sm:text-[13px]">
      {links.map((link) => (
        <li key={link.name}>
          <Link
            to={link.path}
            className="text-primary/70 hover:text-accent hover:translate-x-0.5 inline-block transition-all font-medium leading-snug"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

const Footer = () => {
  const { contactInfo, social, legal } = footerLinks;
  const socials = (social || []).filter((s) => s.url && SOCIAL_ICONS[s.name]);

  const scrollTop = () => {
    if (window.lenis) window.lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const contactRows = [
    { icon: Mail, label: contactInfo.email, href: `mailto:${contactInfo.email}` },
    { icon: Globe, label: contactInfo.exportEmail, href: `mailto:${contactInfo.exportEmail}`, tag: "B2B" },
    { icon: Clock, label: contactInfo.workingHours },
    { icon: MapPin, label: contactInfo.location },
  ];

  return (
    <footer className="w-full bg-[#faf6f4] border-t border-primary/10 relative z-10 pb-[env(safe-area-inset-bottom)]">
      {/* Trust strip */}
      <div className="border-b border-primary/10 bg-white/60">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-4 md:py-6 flex flex-nowrap items-center justify-between sm:justify-center gap-1.5 sm:gap-4">
          {TRUST_BADGES.map((b) => (
            <img
              key={b.src}
              src={b.src}
              alt={b.alt}
              title={b.alt}
              loading="lazy"
              width="140"
              height="56"
              className="flex-1 min-w-0 max-w-[140px] h-auto select-none"
              draggable={false}
            />
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Main */}
        <div className="grid grid-cols-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.3fr] gap-x-4 md:gap-x-10 gap-y-8 py-8 md:py-14">
          {/* Brand */}
          <div className="col-span-6 md:col-span-3 lg:col-span-1 flex flex-col items-start gap-3">
            <Link to={getPath("/")} className="font-serif text-2xl md:text-3xl font-bold text-primary tracking-tight">
              Tiana Luxora<sup className="text-xs ml-1 opacity-70">TM</sup>
            </Link>
            <p className="text-sm text-primary/70 font-serif italic max-w-sm leading-relaxed">
              "{brandDetails.tagline}" — handcrafted signature fragrances made for timeless distinction.
            </p>
            {socials.length > 0 && (
              <div className="flex items-center gap-2.5 pt-1">
                {socials.map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    className="w-9 h-9 rounded-full bg-white border border-primary/15 flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-colors"
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                      {SOCIAL_ICONS[s.name]}
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {LINK_GROUPS.map((g) => (
            <LinkGroup key={g.title} title={g.title} links={g.links} />
          ))}

          {/* Get in touch */}
          <div className="col-span-6 md:col-span-3 lg:col-span-1 md:order-1 lg:order-none min-w-0 pt-6 md:pt-0 border-t md:border-0 border-primary/10">
            <h4 className="font-bold text-primary uppercase tracking-[0.15em] text-[11px] sm:text-xs mb-3 sm:mb-4">Get in Touch</h4>
            <ul className="grid grid-cols-1 min-[420px]:grid-cols-2 md:grid-cols-1 gap-x-6 gap-y-2.5 text-[13px] text-primary/75">
              {contactRows.map((row) => {
                const { label, href, tag } = row;
                const Icon = row.icon;
                const body = (
                  <>
                    <Icon size={14} className="text-accent shrink-0 mt-0.5" />
                    <span className="min-w-0 break-words leading-snug">
                      {label}
                      {tag && (
                        <span className="ml-1.5 text-[9px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-1 py-0.5 rounded align-middle">
                          {tag}
                        </span>
                      )}
                    </span>
                  </>
                );
                return (
                  <li key={label}>
                    {href ? (
                      <a href={href} className="flex items-start gap-2 hover:text-accent transition-colors">{body}</a>
                    ) : (
                      <div className="flex items-start gap-2">{body}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Secure payments */}
        <div className="border-t border-primary/10 py-5 md:py-6 flex flex-col items-center text-center gap-3">
          <div className="flex items-center gap-2 text-[11px] font-bold text-primary/65 uppercase tracking-wider">
            <ShieldCheck size={15} className="text-emerald-600" />
            <span>100% Secure Checkout via Razorpay</span>
          </div>
          <PaymentLogos />
        </div>

        {/* Bottom bar (centered) */}
        <div className="border-t border-primary/10 py-6 flex flex-col items-center text-center gap-3 text-[11px] text-primary/60">
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1" aria-label="Policies">
            {legal.map((link) => (
              <Link key={link.name} to={link.path} className="hover:text-accent transition-colors font-medium">
                {link.name}
              </Link>
            ))}
          </nav>

          <p className="font-medium">
            © {new Date().getFullYear()} Tiana Luxora. All rights reserved.
            <span className="block sm:inline sm:ml-1.5">
              <span className="hidden sm:inline mr-1.5">•</span>GSTIN {contactInfo.gst}
            </span>
          </p>

          <p>
            Designed &amp; Developed by{" "}
            <a
              href="https://inexarum.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline underline-offset-2 decoration-primary/40 hover:text-accent hover:decoration-accent transition-colors"
            >
              iNexarum Private Limited
            </a>
          </p>

          <button
            type="button"
            onClick={scrollTop}
            aria-label="Back to top"
            className="mt-1 w-9 h-9 rounded-full bg-white border border-primary/15 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer"
          >
            <ArrowUp size={15} />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
