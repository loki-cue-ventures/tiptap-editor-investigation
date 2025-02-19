import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Necesario para que pdfjs funcione correctamente
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs`;

interface PdfViewerProps {
  pdfData: string;
}

const PdfViewer = ({ pdfData }: PdfViewerProps) => {
  const canvasRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<any>(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        // Convertir base64 a Uint8Array
        const pdfDataUri = atob(pdfData);
        const pdfArray = new Uint8Array(pdfDataUri.length);
        for (let i = 0; i < pdfDataUri.length; i++) {
          pdfArray[i] = pdfDataUri.charCodeAt(i);
        }

        const pdf = await pdfjsLib.getDocument({ data: pdfArray }).promise;
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPdf();
  }, [pdfData]);

  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDoc || !canvasRef.current) return;

      const page = await pdfDoc.getPage(currentPage);
      const canvas = canvasRef.current as HTMLCanvasElement;
      const context = canvas.getContext('2d');
      
      const viewport = page.getViewport({ scale: 1.5 });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
    };

    renderPage();
  }, [currentPage, pdfDoc]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="pdf-viewer">
      <canvas ref={canvasRef}></canvas>
      <div className="controls">
        <button onClick={prevPage} disabled={currentPage <= 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={nextPage} disabled={currentPage >= totalPages}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default PdfViewer; 