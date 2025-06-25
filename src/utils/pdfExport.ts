
import { Patient, Treatment } from '@/lib/localDatabase';
import { localDB } from '@/lib/localDatabase';

export const exportPatientToPDF = (patient: Patient, treatments: Treatment[]) => {
  // Kreiranje HTML sadržaja za PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Profil pacijenta - ${patient.name}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
        .patient-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
        .info-item { margin-bottom: 10px; }
        .label { font-weight: bold; color: #64748b; }
        .treatments { margin-top: 30px; }
        .treatment { border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 15px; }
        .treatment-date { font-weight: bold; color: #3b82f6; }
        .treatment-desc { margin: 10px 0; }
        .treatment-notes { color: #64748b; font-style: italic; }
        h1 { color: #1e293b; margin: 0; }
        h2 { color: #475569; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Su Jok Doktor - Profil pacijenta</h1>
        <p>Izvoz podataka - ${new Date().toLocaleDateString('sr-RS')}</p>
      </div>
      
      <div class="patient-info">
        <div>
          <div class="info-item">
            <span class="label">Ime:</span> ${patient.name}
          </div>
          <div class="info-item">
            <span class="label">Datum rođenja:</span> ${new Date(patient.date_of_birth).toLocaleDateString('sr-RS')}
          </div>
          <div class="info-item">
            <span class="label">Telefon:</span> ${patient.phone}
          </div>
        </div>
        <div>
          <div class="info-item">
            <span class="label">Email:</span> ${patient.email || 'Nije unet'}
          </div>
          <div class="info-item">
            <span class="label">Status:</span> ${patient.is_active ? 'Aktivan' : 'Neaktivan'}
          </div>
          <div class="info-item">
            <span class="label">Pacijent od:</span> ${new Date(patient.created_at).toLocaleDateString('sr-RS')}
          </div>
        </div>
      </div>
      
      ${patient.conditions ? `
        <h2>Zdravstveno stanje i napomene</h2>
        <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 15px;">
          ${patient.conditions}
        </div>
      ` : ''}
      
      <div class="treatments">
        <h2>Istorija tretmana (${treatments.length} tretmana)</h2>
        ${treatments.length > 0 ? treatments.map(treatment => `
          <div class="treatment">
            <div class="treatment-date">${new Date(treatment.date).toLocaleDateString('sr-RS')}</div>
            <div class="treatment-desc"><strong>${treatment.description}</strong></div>
            <div style="font-size: 14px; color: #64748b;">Trajanje: ${treatment.duration} minuta</div>
            ${treatment.notes ? `<div class="treatment-notes">${treatment.notes}</div>` : ''}
            ${treatment.photos.length > 0 ? `<div style="margin-top: 10px; font-size: 12px; color: #64748b;">Fotografije: ${treatment.photos.length}</div>` : ''}
          </div>
        `).join('') : '<p>Nema zabeleženih tretmana za ovog pacijenta.</p>'}
      </div>
    </body>
    </html>
  `;

  // Kreiranje Blob-a i download linka
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${patient.name.replace(/\s+/g, '_')}_profil.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportAllDataToPDF = () => {
  const patients = localDB.getPatients();
  const sessions = localDB.getTherapySessions();
  const treatments = localDB.getTreatments();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Su Jok Doktor - Kompletan izvoz podataka</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
        .section { margin-bottom: 40px; }
        .patient { border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .session, .treatment { border-left: 4px solid #3b82f6; padding: 10px 15px; margin: 10px 0; background: #f8fafc; }
        h1 { color: #1e293b; margin: 0; }
        h2 { color: #475569; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
        h3 { color: #64748b; margin-top: 20px; }
        .status { padding: 2px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
        .status-active { background: #dcfce7; color: #166534; }
        .status-inactive { background: #f1f5f9; color: #475569; }
        .session-completed { background: #dcfce7; border-left-color: #22c55e; }
        .session-scheduled { background: #fef3c7; border-left-color: #eab308; }
        .session-missed { background: #f1f5f9; border-left-color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Su Jok Doktor - Kompletan izvoz podataka</h1>
        <p>Izvoz podataka - ${new Date().toLocaleDateString('sr-RS')}</p>
        <p>Ukupno: ${patients.length} pacijenata, ${sessions.length} sesija, ${treatments.length} tretmana</p>
      </div>
      
      <div class="section">
        <h2>Pacijenti</h2>
        ${patients.map(patient => {
          const patientSessions = sessions.filter(s => s.patient_id === patient.id);
          const patientTreatments = treatments.filter(t => t.patient_id === patient.id);
          return `
            <div class="patient">
              <h3>${patient.name} <span class="status ${patient.is_active ? 'status-active' : 'status-inactive'}">${patient.is_active ? 'Aktivan' : 'Neaktivan'}</span></h3>
              <p><strong>Rođen:</strong> ${new Date(patient.date_of_birth).toLocaleDateString('sr-RS')} | 
                 <strong>Telefon:</strong> ${patient.phone} | 
                 <strong>Email:</strong> ${patient.email || 'Nije unet'}</p>
              ${patient.conditions ? `<p><strong>Zdravstveno stanje:</strong> ${patient.conditions}</p>` : ''}
              
              ${patientSessions.length > 0 ? `
                <h4>Sesije (${patientSessions.length})</h4>
                ${patientSessions.map(session => `
                  <div class="session session-${session.status === 'odrađena' ? 'completed' : session.status === 'zakazana' ? 'scheduled' : 'missed'}">
                    <strong>${new Date(session.date).toLocaleDateString('sr-RS')} u ${session.time}</strong> - ${session.type} (${session.duration} min) - <em>${session.status}</em>
                    ${session.notes ? `<br><small>${session.notes}</small>` : ''}
                  </div>
                `).join('')}
              ` : '<p>Nema sesija</p>'}
              
              ${patientTreatments.length > 0 ? `
                <h4>Tretmani (${patientTreatments.length})</h4>
                ${patientTreatments.map(treatment => `
                  <div class="treatment">
                    <strong>${new Date(treatment.date).toLocaleDateString('sr-RS')}</strong> - ${treatment.description} (${treatment.duration} min)
                    ${treatment.notes ? `<br><small>${treatment.notes}</small>` : ''}
                    ${treatment.photos.length > 0 ? `<br><small>Fotografije: ${treatment.photos.length}</small>` : ''}
                  </div>
                `).join('')}
              ` : '<p>Nema tretmana</p>'}
            </div>
          `;
        }).join('')}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Su_Jok_Doktor_svi_podaci_${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
