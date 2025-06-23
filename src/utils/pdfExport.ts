
export const exportPatientToPDF = (patient: any, treatments: any[] = []) => {
  // Kreiranje PDF sadržaja kao string
  const pdfContent = `
Su Jok Doktor - Profil Pacijenta

==================================

OSNOVNE INFORMACIJE
==================================
Ime i prezime: ${patient.name}
Datum rođenja: ${new Date(patient.dateOfBirth).toLocaleDateString('sr-RS')}
Telefon: ${patient.phone}
Email: ${patient.email}
Status: ${patient.isActive ? 'Aktivan' : 'Neaktivan'}
Ukupno sesija: ${patient.completedTherapies}
Poslednja poseta: ${new Date(patient.lastVisit).toLocaleDateString('sr-RS')}

ZDRAVSTVENO STANJE
==================================
${patient.conditions}

ISTORIJA TRETMANA
==================================
${treatments.map((treatment, index) => `
${index + 1}. ${new Date(treatment.date).toLocaleDateString('sr-RS')}
   Opis: ${treatment.description}
   Trajanje: ${treatment.duration} minuta
   Napomene: ${treatment.notes}
   ${treatment.photos.length > 0 ? `Fotografija: ${treatment.photos.length}` : ''}
`).join('\n')}

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

export const exportAllDataToPDF = (patients: any[], sessions: any[]) => {
  const pdfContent = `
Su Jok Doktor - Kompletni Izvoz Podataka

==================================
STATISTIKE
==================================
Ukupno pacijenata: ${patients.length}
Aktivni pacijenti: ${patients.filter(p => p.isActive).length}
Neaktivni pacijenti: ${patients.filter(p => !p.isActive).length}
Ukupno sesija: ${sessions.length}
Završene sesije: ${sessions.filter(s => s.status === 'completed').length}
Zakazane sesije: ${sessions.filter(s => s.status === 'scheduled').length}

PACIJENTI
==================================
${patients.map((patient, index) => `
${index + 1}. ${patient.name}
   Status: ${patient.isActive ? 'Aktivan' : 'Neaktivan'}
   Telefon: ${patient.phone}
   Email: ${patient.email}
   Sesije: ${patient.completedTherapies}
   Poslednja poseta: ${new Date(patient.lastVisit).toLocaleDateString('sr-RS')}
`).join('\n')}

TERAPIJSKE SESIJE
==================================
${sessions.map((session, index) => `
${index + 1}. ${session.patientName}
   Datum: ${new Date(session.date).toLocaleDateString('sr-RS')} u ${session.time}
   Tip: ${session.type}
   Status: ${session.status === 'completed' ? 'Završeno' : 'Zakazano'}
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
