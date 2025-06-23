import { Patient, Treatment } from '@/lib/supabase';

export const exportPatientToPDF = (patient: Patient, treatments: Treatment[] = []) => {
  // Kreiranje PDF sadržaja kao string
  const pdfContent = `
Su Jok Doktor - Profil Pacijenta

==================================

OSNOVNE INFORMACIJE
==================================
Ime i prezime: ${patient.name}
Datum rođenja: ${new Date(patient.date_of_birth).toLocaleDateString('sr-RS')}
Telefon: ${patient.phone}
Email: ${patient.email || 'Nije unet'}
Status: ${patient.is_active ? 'Aktivan' : 'Neaktivan'}
Kreiran: ${new Date(patient.created_at).toLocaleDateString('sr-RS')}

ZDRAVSTVENO STANJE
==================================
${patient.conditions || 'Nema zabeleženih napomena'}

ISTORIJA TRETMANA
==================================
${treatments.length > 0 ? treatments.map((treatment, index) => `
${index + 1}. ${new Date(treatment.date).toLocaleDateString('sr-RS')}
   Opis: ${treatment.description}
   Trajanje: ${treatment.duration} minuta
   Napomene: ${treatment.notes || 'Nema napomena'}
   ${treatment.photos.length > 0 ? `Fotografija: ${treatment.photos.length}` : 'Nema fotografija'}
`).join('\n') : 'Nema zabeleženih tretmana'}

==================================
Izvoz izvršen: ${new Date().toLocaleDateString('sr-RS')} u ${new Date().toLocaleTimeString('sr-RS')}
  `;

  // Kreiranje i preuzimanje datoteke
  const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${patient.name.replace(/\s+/g, '_')}_profil.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const exportAllDataToPDF = (patients: Patient[], sessions: any[]) => {
  const pdfContent = `
Su Jok Doktor - Kompletni Izvoz Podataka

==================================
STATISTIKE
==================================
Ukupno pacijenata: ${patients.length}
Aktivni pacijenti: ${patients.filter(p => p.is_active).length}
Neaktivni pacijenti: ${patients.filter(p => !p.is_active).length}
Ukupno sesija: ${sessions.length}
Završene sesije: ${sessions.filter(s => s.status === 'odrađena').length}
Zakazane sesije: ${sessions.filter(s => s.status === 'zakazana').length}

PACIJENTI
==================================
${patients.map((patient, index) => `
${index + 1}. ${patient.name}
   Status: ${patient.is_active ? 'Aktivan' : 'Neaktivan'}
   Telefon: ${patient.phone}
   Email: ${patient.email || 'Nije unet'}
   Kreiran: ${new Date(patient.created_at).toLocaleDateString('sr-RS')}
`).join('\n')}

TERAPIJSKE SESIJE
==================================
${sessions.map((session, index) => `
${index + 1}. ${session.patient?.name || 'Nepoznat pacijent'}
   Datum: ${new Date(session.date).toLocaleDateString('sr-RS')} u ${session.time}
   Tip: ${session.type}
   Status: ${session.status}
   Trajanje: ${session.duration} min
`).join('\n')}

==================================
Izvoz izvršen: ${new Date().toLocaleDateString('sr-RS')} u ${new Date().toLocaleTimeString('sr-RS')}
  `;

  const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SuJok_kompletan_izvoz_${new Date().toISOString().split('T')[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};