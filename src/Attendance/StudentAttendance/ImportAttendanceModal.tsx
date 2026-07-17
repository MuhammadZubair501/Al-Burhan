// components/student/ImportAttendanceModal.tsx

import React, { useState, useEffect } from 'react';
import { X, Upload, FileSpreadsheet, Loader2 } from 'lucide-react';
import { studentAttendanceService } from '../../services/StudentAttendanceService';
import Swal from 'sweetalert2';

interface ImportAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  campusId: number;
  onImportSuccess: () => void;
}

const ImportAttendanceModal: React.FC<ImportAttendanceModalProps> = ({
  isOpen,
  onClose,
  campusId,
  onImportSuccess
}) => {
  const [sections, setSections] = useState<any[]>([]);
  const [selectedSection, setSelectedSection] = useState<number | ''>('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingSections, setFetchingSections] = useState(false);

  useEffect(() => {
    if (isOpen && campusId) {
      fetchSections();
    }
  }, [isOpen, campusId]);

  const fetchSections = async () => {
    setFetchingSections(true);
    try {
      const data = await studentAttendanceService.getSectionsByCampus(campusId);
      setSections(data);
    } catch (error) {
      console.error('Error fetching sections:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load sections',
        icon: 'error',
        confirmButtonColor: '#fbbf24',
        background: '#1a2e2a',
        color: '#fff',
      });
    } finally {
      setFetchingSections(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      const ext = selected.name.split('.').pop()?.toLowerCase();
      if (ext !== 'xlsx' && ext !== 'xls') {
        Swal.fire({
          title: 'Invalid File',
          text: 'Please upload an Excel file (.xlsx or .xls)',
          icon: 'warning',
          confirmButtonColor: '#fbbf24',
          background: '#1a2e2a',
          color: '#fff',
        });
        e.target.value = '';
        setFile(null);
        return;
      }
      setFile(selected);
    }
  };

  const handleImport = async () => {
    if (!selectedSection) {
      Swal.fire({
        title: 'Section Required',
        text: 'Please select a section',
        icon: 'warning',
        confirmButtonColor: '#fbbf24',
        background: '#1a2e2a',
        color: '#fff',
      });
      return;
    }
    if (!file) {
      Swal.fire({
        title: 'File Required',
        text: 'Please upload an Excel file',
        icon: 'warning',
        confirmButtonColor: '#fbbf24',
        background: '#1a2e2a',
        color: '#fff',
      });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sectionId', String(selectedSection));

      const result = await studentAttendanceService.importAttendance(formData);

      let message = `Imported successfully!\nInserted: ${result.data.inserted}, Updated: ${result.data.updated}`;
      if (result.data.skipped > 0) {
        message += `\nSkipped: ${result.data.skipped} students not found.`;
      }
      if (result.data.errors && result.data.errors.length > 0) {
        const errorList = result.data.errors.map((e: any) => 
          `- ${e.name} ${e.phone ? `(${e.phone})` : ''}`
        ).join('\n');
        message += `\n\nSkipped students:\n${errorList}`;
        console.warn('Import errors:', result.data.errors);
      }

      await Swal.fire({
        title: 'Import Complete',
        text: message,
        icon: 'success',
        confirmButtonColor: '#fbbf24',
        background: '#1a2e2a',
        color: '#fff',
      });

      onImportSuccess();
      onClose();
      setSelectedSection('');
      setFile(null);
      (document.getElementById('fileInput') as HTMLInputElement).value = '';
    } catch (error) {
      console.error('Import error:', error);
      Swal.fire({
        title: 'Import Failed',
        text: error instanceof Error ? error.message : 'Unknown error',
        icon: 'error',
        confirmButtonColor: '#fbbf24',
        background: '#1a2e2a',
        color: '#fff',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-3xl border border-white/20 shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white transition"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <FileSpreadsheet className="text-yellow-400" />
          Import Attendance
        </h2>

        <div className="mb-5">
          <label className="block text-green-100 text-sm font-medium mb-1.5">
            Select Section
          </label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(Number(e.target.value))}
            className="w-full bg-white/10 text-white rounded-xl px-4 py-2.5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            disabled={fetchingSections}
          >
            <option value="" className="bg-emerald-900">-- Choose Section --</option>
            {sections.map((sec) => (
              <option key={sec.section_id} value={sec.section_id} className="bg-emerald-900">
                {sec.class_name} - {sec.section_name}
              </option>
            ))}
          </select>
          {fetchingSections && (
            <p className="text-green-200 text-xs mt-1">Loading sections...</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-green-100 text-sm font-medium mb-1.5">
            Upload Excel File (.xlsx)
          </label>
          <div className="relative">
            <input
              id="fileInput"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="w-full bg-white/10 text-white rounded-xl px-4 py-2.5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-yellow-400 file:text-green-950 file:font-semibold hover:file:bg-yellow-300 transition"
            />
          </div>
          {file && (
            <p className="text-green-200 text-xs mt-1 flex items-center gap-1">
              <Upload size={14} /> {file.name}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleImport}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-yellow-400 to-amber-500 text-green-950 font-bold py-2.5 rounded-xl hover:shadow-lg hover:shadow-yellow-500/30 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload size={20} />
                Import
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 text-white py-2.5 rounded-xl hover:bg-white/20 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportAttendanceModal;