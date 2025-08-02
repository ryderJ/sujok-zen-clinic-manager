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
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Serbian text support
    doc.setLanguage('sr');
    
    // Header
    doc.setFontSize(20);
    doc.text('Su Jok Therapy Manager', 20, 30);
    doc.setFontSize(16);
    doc.text('Izveštaj o pacijentu', 20, 40);
    
    // Patient info
    doc.setFontSize(14);
    doc.text(`Ime: ${patient.name}`, 20, 60);
    doc.text(`Datum rođenja: ${new Date(patient.date_of_birth).toLocaleDateString('sr-RS')}`, 20, 70);
    doc.text(`Telefon: ${patient.phone}`, 20, 80);
    doc.text(`Email: ${patient.email || 'Nije unet'}`, 20, 90);
    doc.text(`Status: ${patient.is_active ? 'Aktivan' : 'Neaktivan'}`, 20, 100);
    
    if (patient.notes) {
      doc.text('Napomene:', 20, 120);
      const splitNotes = doc.splitTextToSize(patient.notes, 170);
      doc.text(splitNotes, 20, 130);
    }
    
    // Sessions summary
    const completedSessions = sessions.filter(s => s.status === 'odrađena').length;
    const cancelledSessions = sessions.filter(s => s.status === 'otkazana').length;
    
    let yPosition = patient.notes ? 160 : 130;
    
    doc.setFontSize(16);
    doc.text('Statistike sesija:', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(12);
    doc.text(`Ukupno sesija: ${sessions.length}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Završene sesije: ${completedSessions}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Otkazane sesije: ${cancelledSessions}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Stopa završenih: ${sessions.length > 0 ? Math.round((completedSessions / sessions.length) * 100) : 0}%`, 20, yPosition);
    yPosition += 20;
    
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
      sortedTreatments.forEach((treatment, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 30;
        }
        
        const date = new Date(treatment.date).toLocaleDateString('sr-RS');
        doc.text(`${index + 1}. ${date} - ${treatment.type}`, 20, yPosition);
        yPosition += 10;
        
        const splitDescription = doc.splitTextToSize(`   Opis: ${treatment.description}`, 170);
        doc.text(splitDescription, 20, yPosition);
        yPosition += splitDescription.length * 8 + 10;
      });
    }
    
    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Strana ${i} od ${pageCount}`, 20, 290);
      doc.text(`Generisano: ${new Date().toLocaleDateString('sr-RS')}`, 150, 290);
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