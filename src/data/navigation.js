export const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Collections', path: '/collections' },
  { name: 'About', path: '#' },
  { name: 'Blog', path: '#' },
  { name: 'Contact', path: '#' },
];

export const footerLinks = {
  quickLinks: [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Collections', path: '/collections' },
    { name: 'Best Sellers', path: '#' },
    { name: 'About Us', path: '#' },
    { name: 'Blog', path: '#' },
    { name: 'Contact', path: '#' },
  ],
  customerService: [
    { name: 'FAQs', path: '#' },
    { name: 'Shipping Information', path: '#' },
    { name: 'Returns & Exchanges', path: '#' },
    { name: 'Track Order', path: '#' },
    { name: 'Order History', path: '#' },
  ],
  about: [
    { name: 'Our Story', path: '#' },
    { name: 'Women Empowerment', path: '#' },
    { name: 'Why Choose Us', path: '#' },
  ],
  contactInfo: {
    email: import.meta.env.VITE_CONTACT_EMAIL || 'info@tianaluxora.com',
    phone: import.meta.env.VITE_CONTACT_PHONE || '+91 98765 43210',
  },
  social: [
    // Add social links if needed
  ],
  legal: [
    { name: 'Privacy Policy', path: '#' },
    { name: 'Terms & Conditions', path: '#' },
    { name: 'Refund Policy', path: '#' },
    { name: 'Shipping Policy', path: '#' },
  ]
};
