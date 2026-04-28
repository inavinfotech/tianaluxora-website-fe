import React, { useState } from "react";

const AddressForm = ({ initialData = {}, onSave, onCancel, isProcessing }) => {
  const [formData, setFormData] = useState({
    full_name: initialData.full_name || "",
    phone_number: initialData.phone_number || "",
    address_line: initialData.address_line || "",
    city: initialData.city || "",
    state: initialData.state || "",
    postal_code: initialData.postal_code || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-primary/40 tracking-widest px-1">
            Full Name
          </label>
          <input
            required
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-100 outline-none focus:ring-1 focus:ring-accent/20 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-primary/40 tracking-widest px-1">
            Phone Number
          </label>
          <input
            required
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="+91 XXXXX XXXXX"
            className="w-full bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-100 outline-none focus:ring-1 focus:ring-accent/20 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] uppercase font-bold text-primary/40 tracking-widest px-1">
          Address Line
        </label>
        <input
          required
          name="address_line"
          value={formData.address_line}
          onChange={handleChange}
          placeholder="Building, Street, Area"
          className="w-full bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-100 outline-none focus:ring-1 focus:ring-accent/20 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-primary/40 tracking-widest px-1">
            City
          </label>
          <input
            required
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="City"
            className="w-full bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-100 outline-none focus:ring-1 focus:ring-accent/20 text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-bold text-primary/40 tracking-widest px-1">
            State
          </label>
          <input
            required
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="State"
            className="w-full bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-100 outline-none focus:ring-1 focus:ring-accent/20 text-sm"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] uppercase font-bold text-primary/40 tracking-widest px-1">
          ZIP / Postal Code
        </label>
        <input
          required
          name="postal_code"
          value={formData.postal_code}
          onChange={handleChange}
          placeholder="XXXXXX"
          className="w-full bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-100 outline-none focus:ring-1 focus:ring-accent/20 text-sm"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isProcessing}
          style={{
            backgroundColor: isProcessing ? "#e5e5e5" : "#5a3232",
            color: isProcessing ? "#737373" : "white",
          }}
          className="flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:scale-[1.02] transition-all shadow-md disabled:shadow-none disabled:cursor-not-allowed"
        >
          {isProcessing ? "Saving..." : "Save & Continue"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="border-2 border-neutral-100 text-primary py-3 px-6 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-neutral-50 transition-all font-sans"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default AddressForm;
