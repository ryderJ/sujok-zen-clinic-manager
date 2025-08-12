import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Patient, TherapySession, Treatment } from "@/lib/database";
import jsPDF from 'jspdf';

interface PDFExportProps {
  patient: Patient;
  sessions: TherapySession[];
  treatments: Treatment[];
}

export const PDFExport = ({ patient, sessions, treatments }: PDFExportProps) => {
  const generatePDF = async () => {
    const doc = new jsPDF();
    
    // Load and register Roboto fonts (Latin with diacritics)
    const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const len = bytes.byteLength;
      for (let i = 0; i < len; i++) binary += String.fromCharCode(bytes[i]);
      return btoa(binary);
    };
    const loadFont = async (url: string) => {
      const res = await fetch(url);
      const buf = await res.arrayBuffer();
      return arrayBufferToBase64(buf);
    };
    try {
      const [regularB64, boldB64] = await Promise.all([
        loadFont('/fonts/Roboto-Regular.ttf'),
        loadFont('/fonts/Roboto-Bold.ttf')
      ]);
      // @ts-ignore
      doc.addFileToVFS('Roboto-Regular.ttf', regularB64);
      // @ts-ignore
      doc.addFileToVFS('Roboto-Bold.ttf', boldB64);
      // @ts-ignore
      doc.addFont('Roboto-Regular.ttf', 'Roboto', 'normal');
      // @ts-ignore
      doc.addFont('Roboto-Bold.ttf', 'Roboto', 'bold');
      // @ts-ignore
      doc.setFont('Roboto', 'normal');
    } catch (e) {
      console.warn('Font load failed, using default font', e);
    }
    
    // Serbian text support
    doc.setLanguage('sr');
    
    // Professional header with styling
    doc.setFillColor(59, 130, 246); // Blue background
    doc.rect(0, 0, 210, 50, 'F');
    
    // Logo/Icon area
    doc.setFillColor(255, 255, 255);
    doc.circle(25, 25, 8, 'F');
    
    // Main header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    // @ts-ignore
    doc.setFont('Roboto', 'bold');
    doc.text('NEUTRO', 40, 20);
    
    doc.setFontSize(12);
    doc.setFont(undefined, 'normal');
    doc.text('Goran Topalovic', 40, 28);
    doc.text('neutro.rs', 40, 35);
    
    // Report title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    // @ts-ignore
    doc.setFont('Roboto', 'bold');
    doc.text('IZVEŠTAJ O PACIJENTU', 20, 70);
    
    // Patient information section
    doc.setFillColor(248, 250, 252); // Light gray background
    doc.rect(15, 80, 180, 40, 'F');
    
    doc.setFontSize(14);
    // @ts-ignore
    doc.setFont('Roboto', 'bold');
    doc.text('PODACI O PACIJENTU', 20, 90);
    
    // @ts-ignore
    doc.setFont('Roboto', 'normal');
    doc.setFontSize(11);
    doc.text(`Ime i prezime: ${patient.name}`, 20, 100);
    doc.text(`Datum rodjenja: ${new Date(patient.date_of_birth).toLocaleDateString('sr-RS')}`, 20, 107);
    doc.text(`Telefon: ${patient.phone}`, 20, 114);
    doc.text(`Email: ${patient.email || 'Nije unet'}`, 105, 114);
    doc.text(`Status: ${patient.is_active ? 'Aktivan' : 'Neaktivan'}`, 105, 107);
    
    let yPosition = 130;
    
    if (patient.notes) {
      yPosition += 10;
      doc.setFont(undefined, 'bold');
      doc.text('NAPOMENE:', 20, yPosition);
      yPosition += 7;
      doc.setFont(undefined, 'normal');
      const splitNotes = doc.splitTextToSize(patient.notes, 170);
      doc.text(splitNotes, 20, yPosition);
      yPosition += splitNotes.length * 5 + 10;
    }
    
    // Sessions summary with styling
    const completedSessions = sessions.filter(s => s.status === 'odrađena').length;
    const cancelledSessions = sessions.filter(s => s.status === 'otkazana').length;
    
    yPosition += 10;
    
    // Statistics section with professional styling
    doc.setFillColor(59, 130, 246);
    doc.rect(15, yPosition, 180, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('STATISTIKE SESIJA', 20, yPosition + 5);
    yPosition += 15;
    
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(11);
    
    // Statistics in a grid layout
    doc.text(`Ukupno sesija: ${sessions.length}`, 20, yPosition);
    doc.text(`Završene: ${completedSessions}`, 105, yPosition);
    yPosition += 7;
    doc.text(`Otkazane: ${cancelledSessions}`, 20, yPosition);
    doc.text(`Uspešnost: ${sessions.length > 0 ? Math.round((completedSessions / sessions.length) * 100) : 0}%`, 105, yPosition);
    yPosition += 15;
    
    // Sessions list
    if (sessions.length > 0) {
      doc.setFontSize(14);
      doc.text('Hronologija sesija:', 20, yPosition);
      yPosition += 15;
      
      const sortedSessions = sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      doc.setFontSize(10);
      sortedSessions.forEach((session, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
        
        const date = new Date(session.date).toLocaleDateString('sr-RS');
        doc.text(`${index + 1}. ${date} - ${session.status}`, 20, yPosition);
        yPosition += 8;
        
        if (session.notes) {
          const splitSessionNotes = doc.splitTextToSize(`   Napomena: ${session.notes}`, 170);
          doc.text(splitSessionNotes, 20, yPosition);
          yPosition += splitSessionNotes.length * 8;
        }
        yPosition += 5;
      });
    }
    
    // Treatments
    if (treatments.length > 0) {
      yPosition += 10;
      if (yPosition > 230) {
        doc.addPage();
        yPosition = 30;
      }
      
      doc.setFontSize(14);
      doc.text('Istorija tretmana:', 20, yPosition);
      yPosition += 15;
      
      const sortedTreatments = treatments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      
      doc.setFontSize(10);
      let treatmentIndex = 0;

      // Helper to fetch image as data URL
      const fetchAsDataURL = async (url: string) => {
        try {
          const res = await fetch(url);
          const blob = await res.blob();
          return await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        } catch (e) {
          console.warn('Could not load image for PDF', e);
          return '';
        }
      };

      for (const treatment of sortedTreatments) {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
        const index = ++treatmentIndex;
        const date = new Date(treatment.date).toLocaleDateString('sr-RS');
        doc.text(`${index}. ${date} - ${treatment.type}`, 20, yPosition);
        yPosition += 8;

        const splitDescription = doc.splitTextToSize(`   Opis: ${treatment.description}`, 170);
        doc.text(splitDescription, 20, yPosition);
        yPosition += splitDescription.length * 6 + 6;

        if (treatment.images && treatment.images.length > 0) {
          // Images label
          doc.setFont(undefined, 'bold');
          doc.text('Slike:', 20, yPosition);
          doc.setFont(undefined, 'normal');
          yPosition += 6;

          const thumbSize = 30;
          const gap = 5;
          let x = 20;

          for (const imgUrl of treatment.images.slice(0, 6)) {
            if (yPosition + thumbSize > 260) {
              doc.addPage();
              yPosition = 30;
            }
            const dataUrl = await fetchAsDataURL(imgUrl);
            if (dataUrl) {
              const isPng = dataUrl.startsWith('data:image/png');
              doc.addImage(dataUrl, isPng ? 'PNG' : 'JPEG', x, yPosition, thumbSize, thumbSize);
              x += thumbSize + gap;
              if (x > 180) {
                x = 20;
                yPosition += thumbSize + gap;
              }
            }
          }
          yPosition += thumbSize + 6;
        }

        yPosition += 4;
      }
    }
    
    // Professional footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Footer line
      doc.setDrawColor(59, 130, 246);
      doc.line(15, 285, 195, 285);
      
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`Strana ${i} od ${pageCount}`, 20, 290);
      doc.text(`Generisano: ${new Date().toLocaleDateString('sr-RS')} - Neutro.rs`, 130, 290);
    }
    
    // Save PDF
    const fileName = `${patient.name.replace(/\s+/g, '_')}_izvestaj_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <Button 
      onClick={generatePDF}
      variant="outline"
      className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
    >
      <Download className="w-4 h-4 mr-2" />
      Izvezi PDF
    </Button>
  );
};