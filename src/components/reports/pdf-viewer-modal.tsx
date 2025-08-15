"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Download, ZoomIn, ZoomOut, RotateCw, Maximize2, X } from "lucide-react";
import { toast } from "sonner";

interface PDFViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  reportTitle: string;
}

export const PDFViewerModal = ({ isOpen, onClose, reportId, reportTitle }: PDFViewerModalProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen && reportId) {
      loadPDF();
    }
    return () => {
      // Cleanup blob URL
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [isOpen, reportId]);

  const loadPDF = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/reports/${reportId}/download`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error('Erreur lors du chargement du PDF:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      toast.error("Impossible de charger le PDF");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/reports/${reportId}/download`);
      if (!response.ok) throw new Error('Erreur de téléchargement');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("PDF téléchargé avec succès");
    } catch (err) {
      toast.error("Erreur lors du téléchargement");
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  
  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  const handleClose = () => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    setZoom(1);
    setRotation(0);
    setIsFullscreen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className={`${
          isFullscreen 
            ? "max-w-[100vw] max-h-[100vh] w-full h-full m-0 p-0" 
            : "max-w-6xl max-h-[90vh] w-full p-6"
        } transition-all duration-300 [&>button]:hidden`}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className={isFullscreen ? "p-4 border-b" : ""}>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold truncate">
              {reportTitle}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {/* Contrôles de zoom */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                title="Zoom arrière"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              
              <span className="text-sm min-w-[4rem] text-center">
                {Math.round(zoom * 100)}%
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                title="Zoom avant"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>

              {/* Rotation */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRotate}
                title="Faire tourner"
              >
                <RotateCw className="w-4 h-4" />
              </Button>

              {/* Plein écran */}
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Quitter le plein écran" : "Plein écran"}
                className="flex-shrink-0"
              >
                <Maximize2 className={`w-4 h-4 ${isFullscreen ? 'rotate-180' : ''}`} />
              </Button>

              {/* Téléchargement */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                title="Télécharger"
              >
                <Download className="w-4 h-4" />
              </Button>

              {/* Fermer - toujours affiché */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className={`${isFullscreen ? "flex-1" : "h-[70vh]"} relative overflow-hidden`}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Chargement du PDF...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
              <div className="text-center max-w-md">
                <div className="text-red-500 mb-2">❌</div>
                <h3 className="font-semibold mb-2">Erreur de chargement</h3>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button onClick={loadPDF} variant="outline">
                  Réessayer
                </Button>
              </div>
            </div>
          )}

          {pdfUrl && !isLoading && !error && (
            <div className="w-full h-full overflow-auto bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              <iframe
                src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
                className="border-0 bg-white"
                style={{
                  width: `${zoom * 100}%`,
                  height: `${zoom * 100}%`,
                  transform: `rotate(${rotation}deg)`,
                  minWidth: "100%",
                  minHeight: "100%",
                }}
                title={`PDF Viewer - ${reportTitle}`}
              />
            </div>
          )}
        </div>

      </DialogContent>
    </Dialog>
  );
};