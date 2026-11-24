let razorpayPromise = null;

/** Load Razorpay checkout.js once and reuse it for every payment attempt. */
export const loadRazorpayScript = () => {
  if (typeof window !== "undefined" && window.Razorpay) return Promise.resolve(true);
  if (razorpayPromise) return razorpayPromise;

  razorpayPromise = new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      razorpayPromise = null; // allow a retry
      script.remove();
      resolve(false);
    };
    document.body.appendChild(script);
  });
  return razorpayPromise;
};
