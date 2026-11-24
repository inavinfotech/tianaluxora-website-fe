import React, { useState } from "react";
import THEME_COLORS from "../styles/theme";

const INDIAN_STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const normalizePhone = (v) => v.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");

const validate = (d) => {
  const e = {};
  if (d.full_name.trim().length < 2) e.full_name = "Enter the recipient's name";
  if (!/^[6-9]\d{9}$/.test(normalizePhone(d.phone_number)))
    e.phone_number = "Enter a valid 10-digit mobile number";
  if (d.address_line.trim().length < 5) e.address_line = "Enter house no., street and area";
  if (!/^[1-9]\d{5}$/.test(d.postal_code.trim())) e.postal_code = "Enter a valid 6-digit pincode";
  if (d.city.trim().length < 2) e.city = "Enter your city";
  if (!d.state) e.state = "Select your state";
  return e;
};

const inputBase =
  "w-full bg-neutral-50 px-4 py-3 rounded-xl border outline-none focus:bg-white focus:border-accent focus:ring-1 focus:ring-accent/30 text-sm text-primary transition-colors";

const Field = ({ label, error, children }) => (
  <label className="block space-y-1">
    <span className="text-[10px] uppercase font-bold text-primary/60 tracking-widest px-1">
      {label}
    </span>
    {children}
    {error && <span className="block text-[11px] font-semibold text-rose-600 px-1">{error}</span>}
  </label>
);

const AddressForm = ({ initialData = {}, defaultName = "", onSave, onCancel, isProcessing, serverError }) => {
  const [formData, setFormData] = useState({
    full_name: initialData.full_name || defaultName || "",
    phone_number: initialData.phone_number || "",
    address_line: initialData.address_line || "",
    city: initialData.city || "",
    state: initialData.state || "",
    postal_code: initialData.postal_code || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(formData);
    setErrors(found);
    if (Object.keys(found).length) return;
    onSave({
      ...formData,
      full_name: formData.full_name.trim(),
      phone_number: normalizePhone(formData.phone_number),
      address_line: formData.address_line.trim(),
      city: formData.city.trim(),
      postal_code: formData.postal_code.trim(),
    });
  };

  const cls = (name) => `${inputBase} ${errors[name] ? "border-rose-300" : "border-neutral-200"}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4 animate-fade-in" autoComplete="on">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name" error={errors.full_name}>
          <input name="full_name" autoComplete="name" value={formData.full_name} onChange={handleChange} placeholder="Recipient's name" className={cls("full_name")} />
        </Field>
        <Field label="Mobile Number" error={errors.phone_number}>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-primary/50">+91</span>
            <input name="phone_number" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={14} value={formData.phone_number} onChange={handleChange} placeholder="98765 43210" className={`${cls("phone_number")} pl-12`} />
          </div>
        </Field>
      </div>

      <Field label="Address (House No., Street, Area)" error={errors.address_line}>
        <input name="address_line" autoComplete="street-address" value={formData.address_line} onChange={handleChange} placeholder="Flat 12B, Rose Apartments, MG Road" className={cls("address_line")} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Pincode" error={errors.postal_code}>
          <input name="postal_code" inputMode="numeric" autoComplete="postal-code" maxLength={6} value={formData.postal_code} onChange={(e) => handleChange({ target: { name: "postal_code", value: e.target.value.replace(/\D/g, "") } })} placeholder="110001" className={cls("postal_code")} />
        </Field>
        <Field label="City" error={errors.city}>
          <input name="city" autoComplete="address-level2" value={formData.city} onChange={handleChange} placeholder="City" className={cls("city")} />
        </Field>
      </div>

      <Field label="State" error={errors.state}>
        <select name="state" autoComplete="address-level1" value={formData.state} onChange={handleChange} className={`${cls("state")} appearance-none`}>
          <option value="">Select state</option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
          {formData.state && !INDIAN_STATES.includes(formData.state) && (
            <option value={formData.state}>{formData.state}</option>
          )}
        </select>
      </Field>

      {serverError && (
        <p className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
          {serverError}
        </p>
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={isProcessing}
          style={{
            backgroundColor: isProcessing ? "#e5e5e5" : THEME_COLORS.primary,
            color: isProcessing ? "#737373" : "white",
          }}
          className="flex-1 py-3.5 rounded-xl font-bold uppercase tracking-widest text-[11px] transition-all shadow-md disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
        >
          {isProcessing ? "Saving..." : "Deliver Here"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border-2 border-neutral-200 text-primary py-3 px-6 rounded-xl font-bold uppercase tracking-widest text-[11px] hover:bg-neutral-50 transition-all cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddressForm;
