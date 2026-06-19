import React, { useEffect } from 'react';
import { type LucideIcon, ExternalLink , MapIcon } from 'lucide-react';

interface CustomLocationProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  Icon: LucideIcon;
}

const CustomLocationField: React.FC<CustomLocationProps> = ({ 
  value, 
  onChange, 
  placeholder, 
}) => {

  useEffect(() => {
    const handleUrlCheck = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sharedLink = urlParams.get('picked_location');
      
      if (sharedLink) {
        onChange(decodeURIComponent(sharedLink));
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    };

    handleUrlCheck();
  }, [onChange]);

  // 🌍 Cleared the old layout to resolve the error entirely
  const handleOpenPicker = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Official Google search API format using clean comma string variables
          const mapSearchUrl = "https://www.google.com/maps/search/?api=1&query=" + lat + "," + lng;
          
          window.open(mapSearchUrl, "_blank");
        },
        (error) => {
          console.warn("GPS tracking failed:", error);
          window.open("https://www.google.com/maps", "_blank");
        }
      );
    } else {
      window.open("https://www.google.com/maps", "_blank");
    }
  };

  return (
    <div className="w-full space-y-2">
      <div className="relative w-full">
      <MapIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-300" />
        <input 
          type="text"
          value={value}  
          onChange={(e) => onChange(e.target.value)} 
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 sm:py-4 rounded-2xl bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
        />

        <button
          type="button"
          onClick={handleOpenPicker}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-red-400 hover:text-red-500 transition-colors cursor-pointer"
          title="Open Google Maps at my location"
        >
          <ExternalLink size={20} />
        </button>
      </div>
    </div>
  );
};

export default CustomLocationField;
