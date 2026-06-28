import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Search, FileSpreadsheet, FileText, Printer } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  keyField: string;
  searchPlaceholder?: string;
  showFooter?: boolean;
  footerRenderer?: (data: any[]) => React.ReactNode;
}

export function DataTable({
  columns,
  data,
  keyField,
  searchPlaceholder = 'Search...',
  showFooter = false,
  footerRenderer,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row =>
      columns.some(col =>
        String(row[col.key]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm, columns]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return sortDirection === 'asc'
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredData, sortKey, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'report.xlsx');
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [columns.map(c => c.label)],
      body: data.map(row => columns.map(c => row[c.key])),
    });
    doc.save('report.pdf');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-4 gap-3 border-b border-white/10">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-200" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/10 text-white rounded-xl pl-10 pr-4 py-2 border border-white/20 focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-green-200"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportExcel}
            className="px-3 py-2 bg-green-500/20 text-green-300 rounded-xl hover:bg-green-500/30 transition flex items-center gap-1"
          >
            <FileSpreadsheet size={16} /> Excel
          </button>
          <button
            onClick={exportPDF}
            className="px-3 py-2 bg-red-500/20 text-red-300 rounded-xl hover:bg-red-500/30 transition flex items-center gap-1"
          >
            <FileText size={16} /> PDF
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-blue-500/20 text-blue-300 rounded-xl hover:bg-blue-500/30 transition flex items-center gap-1"
          >
            <Printer size={16} /> Print
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 z-10 bg-emerald-900/80 backdrop-blur">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="p-4 text-left text-yellow-300 font-semibold text-sm uppercase tracking-wider cursor-pointer hover:text-yellow-200"
                  onClick={() => handleSort(col.key)}
                >
                  {col.label}
                  {sortKey === col.key && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr key={row[keyField]} className="border-t border-white/5 hover:bg-white/5 transition">
                {columns.map((col) => (
                  <td key={col.key} className="p-4 text-white">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-green-100">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
          {showFooter && footerRenderer && (
            <tfoot className="bg-emerald-900/50 backdrop-blur">
              <tr>{footerRenderer(sortedData)}</tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10">
          <div className="text-sm text-green-100">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 transition"
            >
              <ChevronLeft size={18} className="text-white" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5) {
                if (currentPage > 3) pageNum = Math.min(currentPage - 2 + i, totalPages - 4 + i);
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-lg transition ${
                    currentPage === pageNum ? 'bg-yellow-400 text-green-950' : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-50 transition"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}