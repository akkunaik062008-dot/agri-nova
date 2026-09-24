import React, { useState } from 'react';
import { Download, Loader2, FileText } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function PDFExportButton({ targetRef, fileName = 'AgriVision_Report', title = 'Export PDF Report' }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!targetRef.current) return;
    setExporting(true);

    try {
      const element = targetRef.current;
      
      // Capture element with html2canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#090d16'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${fileName}_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('[PDF Export Error]:', err);
      alert('Unable to generate PDF report. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={exporting}
      className="agri-btn-secondary text-xs"
      title="Download printable field extension PDF report"
    >
      {exporting ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
          <span>Generating PDF...</span>
        </>
      ) : (
        <>
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>{title}</span>
        </>
      )}
    </button>
  );
}
