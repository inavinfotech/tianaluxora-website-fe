import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { CheckCircle2, MapPin, Package, Truck } from "lucide-react";
import { getPath } from "../utils/paths";
import { formatAddress } from "../hooks/useCheckout";

const inr = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const OrderSuccessPage = () => {
  const { state } = useLocation();

  // Reached directly (refresh / bookmark): nothing to show
  if (!state) return <Navigate to={getPath("/orders")} replace />;

  const { orderId, paymentId, items = [], total, discount, address } = state;
  const shortId = orderId ? String(orderId).split("-")[0].toUpperCase() : null;

  return (
    <div className="min-h-[80dvh] bg-white py-8 sm:py-12 px-4 animate-fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-4">
            <CheckCircle2 size={34} className="text-emerald-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-primary mb-2">Thank you!</h1>
          <p className="text-sm sm:text-base text-primary/70">
            Your order has been placed and payment received.
          </p>
          <p className="text-xs text-primary/55 mt-2 space-x-3">
            {shortId && <span>Order <strong className="text-primary">#{shortId}</strong></span>}
            {paymentId && <span>Payment ID {paymentId}</span>}
          </p>
        </div>

        <div className="border border-primary/10 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-5 sm:p-6 border-b border-primary/10 flex items-start gap-3 bg-[#faf5f8]/70">
            <Truck size={18} className="text-accent shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-bold text-primary">What happens next</p>
              <p className="text-primary/70 mt-0.5">
                We'll pack your order with care and dispatch it shortly. You can follow its status from My Orders.
              </p>
            </div>
          </div>

          {address && (
            <div className="p-5 sm:p-6 border-b border-primary/10 flex items-start gap-3">
              <MapPin size={18} className="text-accent shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-bold text-primary">Delivering to {address.full_name}</p>
                <p className="text-primary/70 mt-0.5">{formatAddress(address)}</p>
              </div>
            </div>
          )}

          <div className="p-5 sm:p-6">
            <p className="flex items-center gap-2 text-sm font-bold text-primary mb-3">
              <Package size={16} className="text-accent" /> Items
            </p>
            <ul className="divide-y divide-primary/10">
              {items.map((it, i) => (
                <li key={i} className="py-3 flex items-center gap-3">
                  {it.image && (
                    <img src={it.image} alt="" className="w-12 h-14 rounded-lg object-cover border border-primary/10 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0 text-sm">
                    <p className="font-serif font-bold text-primary truncate">{it.name}</p>
                    <p className="text-xs text-primary/60">{it.variant_name} × {it.quantity}</p>
                  </div>
                  <span className="text-sm font-bold text-primary">{inr(it.unit_price * it.quantity)}</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-primary/10 pt-3 mt-1 space-y-1 text-sm">
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Discount</span>
                  <span>−{inr(discount)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-primary">
                <span className="font-serif">Total paid</span>
                <span className="price text-lg">{inr(total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to={orderId ? getPath(`/orders/${orderId}`) : getPath("/orders")}
            style={{ backgroundColor: "#83254e", color: "#ffffff" }}
            className="py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-center shadow-md hover:opacity-95"
          >
            View Order
          </Link>
          <Link
            to={getPath("/shop")}
            className="py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider text-center border-2 border-primary/20 text-primary hover:bg-[#faf6f4]"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
