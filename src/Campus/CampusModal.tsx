import { useState } from "react";
import { X, School, MapPin, Phone } from "lucide-react";

interface CampusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: {
    campusName: string;
    address: string;
    phone: string;
  }) => void;
}

export default function CampusModal({
  isOpen,
  onClose,
  onSave,
}: CampusModalProps) {
  const [campusName, setCampusName] = useState("");
  const [address, setAddress] = useState("");
const [phone, setPhone] = useState("");
const [phoneError, setPhoneError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!campusName || !address || !phone) return;

    onSave?.({
      campusName,
      address,
      phone,
    });

    setCampusName("");
    setAddress("");
    setPhone("");

    onClose();
  };
const formatPakPhone = (value: string) => {
  // Remove everything except numbers
  let digits = value.replace(/\D/g, "");

  // Ensure starts with 92
  if (!digits.startsWith("92")) {
    if (digits.startsWith("0")) {
      digits = "92" + digits.slice(1);
    }
  }

  // Limit to 12 digits (92 + 10 digits)
  digits = digits.slice(0, 12);

  // Format: +92 300 1234567
  let formatted = "+";
  if (digits.length > 0) {
    formatted += digits.slice(0, 2);
  }
  if (digits.length > 2) {
    formatted += " " + digits.slice(2, 5);
  }
  if (digits.length > 5) {
    formatted += " " + digits.slice(5);
  }

  return formatted;
};
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="
          relative
          w-full
          max-w-xl
          overflow-hidden
          rounded-[32px]
          bg-white/10
          backdrop-blur-2xl
          border
          border-white/20
          shadow-[0_20px_60px_rgba(0,0,0,0.45)]
          animate-[modalPop_0.25s_ease-out]
        "
      >
        {/* Decorative Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="
            absolute
            top-5
            right-5
            z-20
            w-10
            h-10
            rounded-xl
            bg-white/10
            text-white
            hover:bg-red-500/20
            transition
            flex
            items-center
            justify-center
          "
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="relative z-10 px-8 pt-8 pb-6 text-center">
          <div
            className="
              mx-auto
              w-20
              h-20
              rounded-3xl
              bg-gradient-to-r
              from-yellow-400
              to-amber-500
              flex
              items-center
              justify-center
              shadow-xl
            "
          >
            <School size={40} className="text-green-950" />
          </div>

          <h2 className="mt-5 text-3xl font-bold text-white">
            Add New Campus
          </h2>

          <p className="text-green-100 mt-2">
            Create and manage academy branches
          </p>
        </div>

        {/* Form */}
        <div className="relative z-10 px-8 space-y-5">
          {/* Campus Name */}
          <div>
            <label className="block text-green-100 text-sm mb-2">
              Campus Name
            </label>

            <div className="relative">
              <School
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300"
              />

              <input
                type="text"
                value={campusName}
                onChange={(e) => setCampusName(e.target.value)}
                placeholder="Enter campus name"
                className="
                  w-full
                  pl-12
                  pr-4
                  py-4
                  rounded-2xl
                  bg-white/10
                  border
                  border-white/20
                  text-white
                  placeholder-green-200
                  focus:outline-none
                  focus:ring-2
                  focus:ring-yellow-400
                  transition
                "
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-green-100 text-sm mb-2">
              Address
            </label>

            <div className="relative">
              <MapPin
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300"
              />

              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter campus address"
                className="
                  w-full
                  pl-12
                  pr-4
                  py-4
                  rounded-2xl
                  bg-white/10
                  border
                  border-white/20
                  text-white
                  placeholder-green-200
                  focus:outline-none
                  focus:ring-2
                  focus:ring-yellow-400
                "
              />
            </div>
          </div>

        {/* Phone */}
<div>
  <label className="block text-green-100 text-sm mb-2">
    Phone Number
  </label>

  <div className="relative">
    <Phone
      size={18}
      className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300"
    />

    <input
      type="text"
      value={phone}
      onChange={(e) => {
        const formatted = formatPakPhone(e.target.value);
        setPhone(formatted);

        const digits = formatted.replace(/\D/g, "");
        if (digits.length < 12) {
          setPhoneError("Invalid phone number (format: +92 300 1234567)");
        } else {
          setPhoneError("");
        }
      }}
      placeholder="+92 300 1234567"
      className="
        w-full
        pl-12
        pr-4
        py-4
        rounded-2xl
        bg-white/10
        border
        border-white/20
        text-white
        placeholder-green-200
        focus:outline-none
        focus:ring-2
        focus:ring-yellow-400
      "
    />
  </div>

  {/* 👇 ADD ERROR MESSAGE HERE (RIGHT UNDER INPUT) */}
  {phoneError && (
    <p className="text-red-300 text-xs mt-2">
      {phoneError}
    </p>
  )}
</div>
        </div>

        {/* Footer */}
        <div className="relative z-10 px-8 py-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="
              px-6
              py-3
              rounded-2xl
              bg-white/10
              border
              border-white/20
              text-white
              hover:bg-white/20
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="
              px-8
              py-3
              rounded-2xl
              bg-gradient-to-r
              from-yellow-400
              to-amber-500
              text-green-950
              font-bold
              hover:scale-105
              transition-all
              shadow-xl
            "
          >
            Add Campus
          </button>
        </div>
      </div>
    </div>
  );
}

