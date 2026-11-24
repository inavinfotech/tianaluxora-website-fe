import React from "react";

/**
 * Local inline-SVG payment method marks (no external requests).
 * Simplified wordmarks, each sized to the same 52x30 chip.
 */
const Chip = ({ label, children }) => (
  <span
    role="img"
    aria-label={label}
    title={label}
    className="inline-flex items-center justify-center bg-white border border-primary/10 rounded-md shadow-2xs h-[30px] w-[52px] sm:w-[58px] overflow-hidden"
  >
    {children}
  </span>
);

const UPI = () => (
  <Chip label="UPI / GPay / PhonePe">
    <svg viewBox="0 0 52 30" className="w-full h-full">
      <text x="9" y="19" fontSize="12" fontWeight="800" fontStyle="italic" fill="#3d3d3d" fontFamily="Arial, sans-serif">UPI</text>
      <path d="M33 8l6 7-6 7z" fill="#097939" />
      <path d="M38 8l6 7-6 7z" fill="#ed752e" />
    </svg>
  </Chip>
);

const Visa = () => (
  <Chip label="Visa">
    <svg viewBox="0 0 52 30" className="w-full h-full">
      <text x="26" y="20" textAnchor="middle" fontSize="15" fontWeight="900" fontStyle="italic" fill="#1a1f71" fontFamily="Arial, sans-serif" letterSpacing="-0.5">VISA</text>
    </svg>
  </Chip>
);

const MasterCard = () => (
  <Chip label="MasterCard">
    <svg viewBox="0 0 52 30" className="w-full h-full">
      <circle cx="21" cy="15" r="9" fill="#eb001b" />
      <circle cx="31" cy="15" r="9" fill="#f79e1b" />
      <path d="M26 7.9a9 9 0 0 1 0 14.2 9 9 0 0 1 0-14.2z" fill="#ff5f00" />
    </svg>
  </Chip>
);

const RuPay = () => (
  <Chip label="RuPay">
    <svg viewBox="0 0 52 30" className="w-full h-full">
      <text x="6" y="19" fontSize="11" fontWeight="800" fontStyle="italic" fill="#1b3c87" fontFamily="Arial, sans-serif">Ru</text>
      <text x="19" y="19" fontSize="11" fontWeight="800" fontStyle="italic" fill="#f26b21" fontFamily="Arial, sans-serif">Pay</text>
      <path d="M44 9l4 6-4 6z" fill="#f26b21" />
    </svg>
  </Chip>
);

const NetBanking = () => (
  <Chip label="Net Banking">
    <svg viewBox="0 0 52 30" className="w-full h-full" fill="none" stroke="#83254e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M26 6l11 5H15z" fill="#83254e" fillOpacity="0.12" />
      <path d="M17 13v8M23 13v8M29 13v8M35 13v8M15 23h22" />
    </svg>
  </Chip>
);

const PaymentLogos = () => (
  <div className="flex flex-wrap items-center justify-center gap-2" aria-label="Accepted payment methods">
    <UPI />
    <Visa />
    <MasterCard />
    <RuPay />
    <NetBanking />
  </div>
);

export default PaymentLogos;
