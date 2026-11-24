import { getPath } from "../utils/paths";

export const navLinks = [
  { name: "Home", path: getPath("/") },
  { name: "Shop", path: getPath("/shop") },
  { name: "Story", path: getPath("/story") },
  { name: "About", path: getPath("/about") },
  { name: "Contact", path: getPath("/contact") },
];

export const brandDetails = {
  name: "Tiana Luxora™",
  tagline: "Luxury in Every Breath",
  subTagline: "Luxury – Craftsmanship – Empowerment",
  badge: "Proudly Made in India | MSME Registered | Available for Global Export",
  qualityPromise: "Quality Checked | Batch Verified | Luxury Assured",
};

export const footerLinks = {
  quickLinks: [
    { name: "Shop Fragrances", path: getPath("/shop") },
    { name: "Brand Cinema", path: getPath("/story") },
    { name: "About Us", path: getPath("/about") },
    { name: "Contact Us", path: getPath("/contact") },
  ],
  customerService: [
    { name: "My Orders", path: getPath("/orders") },
    { name: "My Account", path: getPath("/profile") },
    { name: "Shipping & Delivery", path: getPath("/contact#faqs") },
    { name: "Returns & Replacements", path: getPath("/contact#faqs") },
    { name: "FAQs", path: getPath("/contact#faqs") },
  ],
  about: [
    { name: "Our Story", path: getPath("/story") },
    { name: "Our Founder", path: getPath("/about#founder") },
    { name: "Women Empowerment", path: getPath("/about#empowerment") },
    { name: "Global B2B Export", path: getPath("/contact#faqs") },
  ],
  contactInfo: {
    email: "tianacare6@gmail.com",
    exportEmail: "tianaluxora.global@gmail.com",
    phone: "",
    workingHours: "Mon – Sat, 10 AM – 6 PM",
    location: "New Delhi, India",
    gst: "07ADRPA1310K1ZU",
    msme: "MSME Registered & Trademark Recognized",
  },
  // Fill in real profile URLs to show icons in the footer, e.g.
  // { name: "instagram", url: "https://instagram.com/tianaluxora" }
  // Supported names: instagram, facebook, youtube, linkedin, whatsapp, x
  social: [],
  // Add Privacy Policy / Terms links here once those pages exist
  legal: [
    { name: "Shipping", path: getPath("/contact#faqs") },
    { name: "Returns & Refunds", path: getPath("/contact#faqs") },
    { name: "Contact", path: getPath("/contact") },
  ],
};
