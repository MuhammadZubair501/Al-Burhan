// hooks/useClassModal.js
import { useState, useEffect } from "react";
import { classService } from "../../services/ClassService";

interface UseClassModalProps {
  isOpen: boolean;
  onSave: (data: {
    className: string;
    department: string;
    batch: string;
    shift: string;
  }) => void;
  onClose: () => void;
  editData?: any;
  mode?: 'create' | 'edit';
}

export function useClassModal({ isOpen, onSave, onClose, editData, mode = 'create' }: UseClassModalProps) {
  const [className, setClassName] = useState("");
  const [department, setDepartment] = useState("");
  const [batch, setBatch] = useState("");
  const [shift, setShift] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [campus, setCampus] = useState<any>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const isValid = className && department && batch && shift;

  // Fetch campus data (you can adjust this based on your actual campus data source)
  useEffect(() => {
    if (isOpen) {
      fetchCampusData();
   
      if (mode === 'edit' && editData) {
        populateEditData();
      }
    }
  }, [isOpen, mode, editData]);

  const fetchCampusData = async () => {
    try {
      // Fetch campus data - adjust according to your API
      const campusData = await classService.getClasses();
      setCampus(campusData);
    } catch (error) {
      console.error('Error fetching campus:', error);
      // Set default campus if API fails
      setCampus({ campus_name: "Jamia Masjid Bilal" });
    }
  };


  const populateEditData = () => {
    if (editData) {
      setClassName(editData.class_name || "");
      setDepartment(editData.department_name || "");
      setBatch(editData.batch_name || "");
      setShift(editData.shift || "");
    }
  };

  const handleDropdownToggle = (dropdownName: string) => {
    if (openDropdown === dropdownName) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(dropdownName);
    }
  };

  const handleSubmit = async () => {
    if (!isValid) return;

    setLoading(true);
    try {
      let result;
      const classData = {
        className,
        department,
        batch,
        shift,
      };

      if (mode === 'edit' && editData?.class_id) {
        result = await classService.updateClass(editData.class_id, classData);
        onSave({ ...result, mode: 'edit' });
      } else {
        result = await classService.createClass(classData);
        onSave({ ...result, mode: 'create' });
      }

      // Reset form
      setClassName("");
      setDepartment("");
      setBatch("");
      setShift("");
      onClose();
    } catch (error) {
      console.error('Error saving class:', error);
    //   alert(error.message || 'Failed to save class');
    } finally {
      setLoading(false);
    }
  };

  return {
    className,
    setClassName,
    department,
    setDepartment,
    batch,
    setBatch,
    shift,
    setShift,
    openDropdown,
    setOpenDropdown,
    campus,
    departments,
    batches,
    loading,
    isValid,
    handleSubmit,
    handleDropdownToggle,
  };
}