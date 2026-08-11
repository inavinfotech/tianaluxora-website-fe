import { getPath } from "../utils/paths";

export const navLinks = [
  { name: "Home", path: getPath("/") },
  { name: "Shop", path: getPath("/shop") },
  { name: "Collections", path: getPath("/collections") },
  { name: "About", path: getPath("/about") },
  // { name: "Blog", path: "#" },
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
    { name: "Shop", path: getPath("/shop") },
    { name: "Collections", path: getPath("/collections") },
    { name: "Best Sellers", path: getPath("/shop") },
    { name: "Contact", path: getPath("/contact") },
  ],
  customerService: [
    { name: "FAQs", path: getPath("/contact#faqs") },
    { name: "Shipping Policy", path: getPath("/contact#shipping") },
    { name: "Returns & Exchanges", path: getPath("/contact#returns") },
    { name: "Track Order", path: getPath("/orders") },
  ],
  about: [
    { name: "Our Story", path: getPath("/about") },
    { name: "Women Empowerment", path: getPath("/about#empowerment") },
    { name: "Why Choose Us", path: getPath("/about#purpose") },
  ],
  contactInfo: {
    email: "tianacare6@gmail.com",
    exportEmail: "tianaluxora.global@gmail.com",
    phone: "+91 98765 43210",
    workingHours: "Mon – Sat, 10 AM – 6 PM",
    location: "Delhi, India",
    gst: "07ADRPA1310K1ZU",
    msme: "MSME Registered & Trademark Recognized",
  },
  social: [
    // Add social links if needed
  ],
  legal: [
    { name: "Privacy Policy", path: getPath("/contact#privacy") },
    { name: "Terms & Conditions", path: getPath("/contact#terms") },
    { name: "Refund Policy", path: getPath("/contact#refund") },
    { name: "Shipping Policy", path: getPath("/contact#shipping") },
  ],
};
