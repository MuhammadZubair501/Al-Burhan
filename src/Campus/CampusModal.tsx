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
} from "lucide-react";

import CustomInputField from "../components/custom/CustomInputField";
import CustomLocationField from "../components/custom/CustomLocationField";
import CustomCheckboxGroup from "../components/custom/CustomCheckboxGroup";
import CustomRadioGroup from "../components/custom/CustomRadioGroup";
import Swal from "sweetalert2";
import ApiRoutes from "../services/ApiRoutes";

interface CampusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
  campus?: any; // ✅ EDIT MODE DATA
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

  const locationRef = useRef<HTMLInputElement | null>(null);

  // ---------------- PREFILL DATA FOR EDIT ----------------
  useEffect(() => {
    if (!campus) {
      setFormData(INITIAL_FORM_STATE);
      setShifts([]);
      return;
    }

    setFormData({
      campusName: campus.campus_name,
      address: campus.address,
      phone: campus.phone_number,
      location: campus.location,
      poc: campus.poc_name,
      campusType: campus.is_main_campus
        ? "Main Campus"
        : "Sub Campus",
      detail: campus.detail || "",
    });

    const s: string[] = [];
    if (campus.has_morning_shift) s.push("Morning");
    if (campus.has_evening_shift) s.push("Evening");

    setShifts(s);
  }, [campus]);

  // ---------------- GOOGLE MAPS ----------------
  useEffect(() => {
    if (!isOpen || !locationRef.current || !(window as any).google)
      return;

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
    if (digits.length > 2)
      formatted += " " + digits.slice(2, 5);
    if (digits.length > 5)
      formatted += " " + digits.slice(5);

    return formatted;
  }, []);

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
      digits.length < 12
        ? "Invalid phone number (+92 300 1234567)"
        : ""
    );
  };

  // ---------------- SUBMIT (CREATE + UPDATE) ----------------
 const handleSubmit = async () => {
  try {
    const payload = {
      campus_name: formData.campusName,
      address: formData.address,
      phone_number: formData.phone,
      location: formData.location,
      poc_name: formData.poc,
      has_morning_shift: shifts.includes("Morning"),
      has_evening_shift: shifts.includes("Evening"),
      is_main_campus: formData.campusType === "Main Campus",
      detail: formData.detail,
    };

    let url = ApiRoutes.CAMPUS;
    let method = "POST";

    // EDIT MODE
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
      });
    }
  } catch (error) {
    console.error(error);

    Swal.fire({
      title: "Error!",
      text: "Something went wrong. Please try again.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-3 sm:p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] rounded-[28px] bg-white/10 backdrop-blur-2xl border border-white/20">

        {/* CLOSE */}
        <button
          onClick={onClose}
          className="
            absolute top-4 right-4
            flex items-center justify-center
            w-10 h-10
            rounded-xl
            bg-white/10
            hover:bg-red-500/80
            text-white
            transition-all duration-200
            cursor-pointer
          "
        >
          <X size={18} strokeWidth={2.5} />
        </button>
        {/* HEADER */}
        <div className="px-8 pt-8 text-center">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center">
            <School size={38} className="text-green-950" />
          </div>

          <h2 className="mt-5 text-3xl font-bold text-white">
            {campus ? "Edit Campus" : "Add New Campus"}
          </h2>

          <p className="text-green-100 mt-2">
            Manage academy branches
          </p>
        </div>

        {/* FORM */}
        <div className="px-8 py-6 space-y-5 max-h-[56vh] overflow-y-auto">

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
            <p className="text-red-300 text-xs">
              {phoneError}
            </p>
          )}

          <CustomInputField
            value={formData.poc}
            onChange={handleInputChange("poc")}
            placeholder="POC Name"
            Icon={PocketKnife}
          />

          <div className="flex gap-10">
            <CustomCheckboxGroup
              selectedValues={shifts}
              onChange={setShifts}
              options={["Morning", "Evening"]}
              Icon={Sunrise}
            />

            <CustomRadioGroup
              selectedValue={formData.campusType}
              onChange={(val) =>
                setFormData((p) => ({
                  ...p,
                  campusType: val,
                }))
              }
              options={["Main Campus", "Sub Campus"]}
              name="campus_type"
              Icon={Caravan}
            />
          </div>

          {formData.campusType === "Sub Campus" && (
            <div className="relative">
              <ReceiptText className="absolute left-4 top-3 text-yellow-300" />
              <textarea
                value={formData.detail}
                onChange={handleInputChange("detail")}
                placeholder="Sub campus details"
                rows={3}
                className="w-full pl-12 py-3 rounded-2xl bg-white/10 text-white border border-white/20"
              />
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-8 py-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-2xl bg-white/10 text-white cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-400 to-amber-500 font-bold cursor-pointer"
          >
            {campus ? "Update Campus" : "Add Campus"}
          </button>
        </div>
      </div>
    </div>
  );
}