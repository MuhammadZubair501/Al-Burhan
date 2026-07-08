import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ChangeEvent,
} from "react";
import {
  X,
  School,
  MapPin,
  University,
  Phone,
  PocketKnife,
  Caravan,
  Sunrise,
  ReceiptText,
  Moon,
  Sun,
  Building2,
  Building,
} from "lucide-react";

import CustomInputField from "../components/custom/CustomInputField";
import CustomLocationField from "../components/custom/CustomLocationField";
import Swal from "sweetalert2";
import ApiRoutes from "../services/ApiRoutes";

interface CampusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  campus?: any;
}

const INITIAL_FORM_STATE = {
  campusName: "",
  address: "",
  phone: "",
  location: "",
  poc: "",
  campusType: "Main Campus",
  detail: "",
};

export default function CampusModal({
  isOpen,
  onClose,
  onSave,
  campus,
}: CampusModalProps) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [shifts, setShifts] = useState<string[]>([]);
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const locationRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // ---------------- PREFILL DATA FOR EDIT ----------------
  useEffect(() => {
    if (!campus) {
      setFormData(INITIAL_FORM_STATE);
      setShifts([]);
      return;
    }

    setFormData({
      campusName: campus.campus_name || "",
      address: campus.address || "",
      phone: campus.phone_number || "",
      location: campus.location || "",
      poc: campus.poc_name || "",
      campusType: campus.is_main_campus ? "Main Campus" : "Sub Campus",
      detail: campus.detail || "",
    });

    const s: string[] = [];
    if (campus.has_morning_shift) s.push("Morning");
    if (campus.has_evening_shift) s.push("Evening");
    setShifts(s);
  }, [campus]);

  // ---------------- GOOGLE MAPS ----------------
  useEffect(() => {
    if (!isOpen || !locationRef.current || !(window as any).google) return;

    const autocomplete = new (window as any).google.maps.places.Autocomplete(
      locationRef.current,
      { fields: ["geometry"] }
    );

    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place?.geometry?.location) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      setFormData((prev) => ({
        ...prev,
        location: `https://www.google.com/maps?q=${lat},${lng}`,
      }));
    });

    return () => listener?.remove?.();
  }, [isOpen]);

  // ---------------- PHONE FORMAT ----------------
  const formatPakPhone = useCallback((value: string) => {
    let digits = value.replace(/\D/g, "");

    if (!digits.startsWith("92") && digits.startsWith("0")) {
      digits = "92" + digits.slice(1);
    }

    digits = digits.slice(0, 12);

    let formatted = "+";
    if (digits.length > 0) formatted += digits.slice(0, 2);
    if (digits.length > 2) formatted += " " + digits.slice(2, 5);
    if (digits.length > 5) formatted += " " + digits.slice(5);

    return formatted;
  }, []);

  // ---------------- KEYBOARD SHORTCUTS ----------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // ---------------- PREVENT BODY SCROLL ----------------
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // ---------------- INPUT HANDLERS ----------------
  const handleInputChange =
    (field: keyof typeof INITIAL_FORM_STATE) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPakPhone(e.target.value);

    setFormData((prev) => ({
      ...prev,
      phone: formatted,
    }));

    const digits = formatted.replace(/\D/g, "");
    setPhoneError(
      digits.length < 12 && digits.length > 0
        ? "Invalid phone number (+92 300 1234567)"
        : ""
    );
  };

  // ---------------- TOGGLE SHIFT ----------------
  const toggleShift = (shift: string) => {
    setShifts((prev) =>
      prev.includes(shift)
        ? prev.filter((s) => s !== shift)
        : [...prev, shift]
    );
  };

  // ---------------- VALIDATION ----------------
  const validateForm = (): boolean => {
    if (!formData.campusName.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Campus Name is required",
        icon: "warning",
        confirmButtonColor: "#f59e0b",
        background: "#14532d",
        color: "#fff",
        confirmButtonText: "OK",
      });
      return false;
    }

    if (!formData.address.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Address is required",
        icon: "warning",
        confirmButtonColor: "#f59e0b",
        background: "#14532d",
        color: "#fff",
        confirmButtonText: "OK",
      });
      return false;
    }

    if (!formData.phone.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "Phone number is required",
        icon: "warning",
        confirmButtonColor: "#f59e0b",
        background: "#14532d",
        color: "#fff",
        confirmButtonText: "OK",
      });
      return false;
    }

    if (phoneError) {
      Swal.fire({
        title: "Validation Error",
        text: "Please enter a valid phone number (+92 300 1234567)",
        icon: "warning",
        confirmButtonColor: "#f59e0b",
        background: "#14532d",
        color: "#fff",
        confirmButtonText: "OK",
      });
      return false;
    }

    if (!formData.poc.trim()) {
      Swal.fire({
        title: "Validation Error",
        text: "POC Name is required",
        icon: "warning",
        confirmButtonColor: "#f59e0b",
        background: "#14532d",
        color: "#fff",
        confirmButtonText: "OK",
      });
      return false;
    }

    return true;
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        campus_name: formData.campusName.trim(),
        address: formData.address.trim(),
        phone_number: formData.phone.trim(),
        location: formData.location.trim(),
        poc_name: formData.poc.trim(),
        has_morning_shift: shifts.includes("Morning"),
        has_evening_shift: shifts.includes("Evening"),
        is_main_campus: formData.campusType === "Main Campus",
        detail: formData.detail.trim(),
      };

      let url = ApiRoutes.CAMPUS;
      let method = "POST";

      if (campus?.campus_id) {
        url = ApiRoutes.campusById(campus.campus_id);
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        await Swal.fire({
          title: "Success!",
          text: campus?.campus_id
            ? "Campus Updated Successfully"
            : "Campus Added Successfully",
          icon: "success",
          confirmButtonText: "OK",
          confirmButtonColor: "#f59e0b",
          background: "#14532d",
          color: "#fff",
        });

        onSave?.();
        onClose();
      } else {
        Swal.fire({
          title: "Failed!",
          text: data.message || "Operation failed.",
          icon: "error",
          confirmButtonColor: "#f59e0b",
          background: "#14532d",
          color: "#fff",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error(error);

      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#f59e0b",
        background: "#14532d",
        color: "#fff",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <div
        ref={modalRef}
        className="relative w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] rounded-2xl sm:rounded-[28px] bg-white/10 backdrop-blur-2xl border border-white/20 overflow-hidden mx-2 sm:mx-0 shadow-2xl shadow-black/20"
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="
            absolute top-3 right-3 sm:top-4 sm:right-4
            flex items-center justify-center
            w-8 h-8 sm:w-10 sm:h-10
            rounded-xl
            bg-white/10
            hover:bg-red-500/80
            text-white
            transition-all duration-200
            cursor-pointer
            z-10
            group
          "
          aria-label="Close modal"
        >
          <X
            size={16}
            className="sm:w-[18px] sm:h-[18px] group-hover:rotate-90 transition-transform duration-200"
            strokeWidth={2.5}
          />
        </button>

        {/* HEADER */}
        <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-8 text-center">
          <div className="mx-auto w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
            <School
              size={28}
              className="sm:w-8 sm:h-8 md:w-[38px] md:h-[38px] text-green-950"
            />
          </div>

          <h2 className="mt-4 sm:mt-5 text-xl sm:text-2xl md:text-3xl font-bold text-white">
            {campus ? "Edit Campus" : "Add New Campus"}
          </h2>

          <p className="text-green-100 text-sm sm:text-base mt-1 sm:mt-2">
            {campus ? "Update academy branch details" : "Add a new academy branch"}
          </p>
        </div>

        {/* FORM */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 space-y-4 sm:space-y-5 max-h-[50vh] sm:max-h-[56vh] overflow-y-auto">
          <CustomInputField
            value={formData.campusName}
            onChange={handleInputChange("campusName")}
            placeholder="Campus Name"
            Icon={University}
          />

          <CustomInputField
            value={formData.address}
            onChange={handleInputChange("address")}
            placeholder="Address"
            Icon={MapPin}
          />

          <CustomLocationField
            value={formData.location}
            onChange={(val) =>
              setFormData((p) => ({ ...p, location: val }))
            }
            placeholder="Google Map Link"
            Icon={MapPin}
          />

          <CustomInputField
            value={formData.phone}
            onChange={handlePhoneChange}
            placeholder="+92 300 1234567"
            Icon={Phone}
          />

          {phoneError && (
            <p className="text-red-300 text-xs sm:text-sm -mt-2">
              {phoneError}
            </p>
          )}

          <CustomInputField
            value={formData.poc}
            onChange={handleInputChange("poc")}
            placeholder="POC Name"
            Icon={PocketKnife}
          />

          {/* Shifts Section - Beautiful Mobile Design */}
          <div className="space-y-2">
            <label className="text-green-100 text-sm font-medium flex items-center gap-2">
              <Sunrise size={16} className="text-yellow-400" />
              Shifts
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => toggleShift("Morning")}
                className={`
                  flex items-center justify-center gap-2
                  px-3 sm:px-4 py-3 sm:py-3.5
                  rounded-xl sm:rounded-2xl
                  border-2 transition-all duration-200
                  text-sm sm:text-base font-medium
                  ${
                    shifts.includes("Morning")
                      ? "bg-yellow-400/20 border-yellow-400 text-yellow-300 shadow-lg shadow-yellow-500/10"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20"
                  }
                `}
              >
                <Sun size={16} className={shifts.includes("Morning") ? "text-yellow-400" : "text-white/40"} />
                <span>Morning</span>
                {shifts.includes("Morning") && (
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                )}
              </button>

              <button
                type="button"
                onClick={() => toggleShift("Evening")}
                className={`
                  flex items-center justify-center gap-2
                  px-3 sm:px-4 py-3 sm:py-3.5
                  rounded-xl sm:rounded-2xl
                  border-2 transition-all duration-200
                  text-sm sm:text-base font-medium
                  ${
                    shifts.includes("Evening")
                      ? "bg-purple-400/20 border-purple-400 text-purple-300 shadow-lg shadow-purple-500/10"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20"
                  }
                `}
              >
                <Moon size={16} className={shifts.includes("Evening") ? "text-purple-400" : "text-white/40"} />
                <span>Evening</span>
                {shifts.includes("Evening") && (
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* Campus Type Section - Beautiful Mobile Design */}
          <div className="space-y-2">
            <label className="text-green-100 text-sm font-medium flex items-center gap-2">
              <Caravan size={16} className="text-yellow-400" />
              Campus Type
            </label>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData((p) => ({ ...p, campusType: "Main Campus" }))
                }
                className={`
                  flex items-center justify-center gap-2
                  px-3 sm:px-4 py-3 sm:py-3.5
                  rounded-xl sm:rounded-2xl
                  border-2 transition-all duration-200
                  text-sm sm:text-base font-medium
                  ${
                    formData.campusType === "Main Campus"
                      ? "bg-emerald-400/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/10"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20"
                  }
                `}
              >
                <Building2 size={16} className={formData.campusType === "Main Campus" ? "text-emerald-400" : "text-white/40"} />
                <span>Main</span>
                {formData.campusType === "Main Campus" && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>

              <button
                type="button"
                onClick={() =>
                  setFormData((p) => ({ ...p, campusType: "Sub Campus" }))
                }
                className={`
                  flex items-center justify-center gap-2
                  px-3 sm:px-4 py-3 sm:py-3.5
                  rounded-xl sm:rounded-2xl
                  border-2 transition-all duration-200
                  text-sm sm:text-base font-medium
                  ${
                    formData.campusType === "Sub Campus"
                      ? "bg-blue-400/20 border-blue-400 text-blue-300 shadow-lg shadow-blue-500/10"
                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20"
                  }
                `}
              >
                <Building size={16} className={formData.campusType === "Sub Campus" ? "text-blue-400" : "text-white/40"} />
                <span>Sub</span>
                {formData.campusType === "Sub Campus" && (
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {formData.campusType === "Sub Campus" && (
            <div className="relative animate-slide-down">
              <ReceiptText
                className="absolute left-3 sm:left-4 top-3 text-yellow-300"
                size={18}
              />
              <textarea
                value={formData.detail}
                onChange={handleInputChange("detail")}
                placeholder="Sub campus details (optional)"
                rows={3}
                className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-green-200/50 text-sm sm:text-base resize-none transition-all duration-200"
              />
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 border-t border-white/10 bg-white/5">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="
              px-4 sm:px-5 py-2.5 sm:py-3
              rounded-xl sm:rounded-2xl
              bg-white/10 text-white
              hover:bg-white/20
              transition-all duration-200
              cursor-pointer
              text-sm sm:text-base
              font-medium
              disabled:opacity-50 disabled:cursor-not-allowed
              order-2 sm:order-1
              w-full sm:w-auto
            "
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="
              px-5 sm:px-6 py-2.5 sm:py-3
              rounded-xl sm:rounded-2xl
              bg-gradient-to-r from-yellow-400 to-amber-500
              text-green-950 font-bold
              hover:scale-[1.02]
              transition-all duration-200
              cursor-pointer
              text-sm sm:text-base
              disabled:opacity-50 disabled:cursor-not-allowed
              order-1 sm:order-2
              w-full sm:w-auto
              shadow-lg shadow-yellow-500/20
              hover:shadow-yellow-500/40
            "
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-green-950"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {campus ? "Updating..." : "Adding..."}
              </span>
            ) : campus ? (
              "Update Campus"
            ) : (
              "Add Campus"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}