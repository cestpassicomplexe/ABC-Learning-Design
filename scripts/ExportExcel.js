function exporter() {
  // On sélectionne uniquement les lignes qui contiennent des données
  const lignesDeDonnees = document.querySelectorAll('#dropzone tr.ligne');

  // On vérifie s'il y a quelque chose à exporter
  if (lignesDeDonnees.length === 0) {
      alert('Merci de remplir le tableau avant d\'exporter !');
      return; // Stoppe la fonction
  }

  // Création du classeur Excel
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'DRANE GE';
  workbook.created = new Date();
  const worksheet = workbook.addWorksheet('Déroulé Pédagogique');

  // --- CONFIGURATION DES EN-TÊTES ET LARGUEURS DE COLONNES ---
  // On définit un tableau d'en-têtes pour rendre le code plus clair
  const headers = [
      { header: 'Type d\'Apprentissage', key: 'type', width: 25 },
      { header: 'Objectif(s) Visé(s)', key: 'objectif', width: 40 },
      { header: 'Outil', key: 'outil', width: 30 },
      { header: 'Consignes', key: 'consignes', width: 40 },
      { header: 'Durée (min)', key: 'duree', width: 15 },
      { header: 'Modalité', key: 'modalite', width: 35 },
      { header: 'Évaluation & Feedback', key: 'evaluation', width: 30 },
      { header: 'Ressources', key: 'ressources', width: 40 },
  ];
  worksheet.columns = headers;

  // Style pour les en-têtes
  worksheet.getRow(1).font = { name: 'Calibri', size: 14, bold: true };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };


  // --- REMPLISSAGE DES DONNÉES ---
  lignesDeDonnees.forEach(row => {
      // Récupération des données de la ligne de manière robuste
      const typeApprentissage = row.cells[1]?.querySelector('h6')?.innerText || '';
      const objectif = row.cells[2]?.querySelector('textarea')?.value || '';
      const outil = row.cells[3]?.innerText || '';
      const consignes = row.cells[4]?.querySelector('textarea')?.value || '';
      const duree = row.cells[5]?.querySelector('input')?.value || '0';
      const modalite = row.cells[6]?.querySelector('select')?.value || '';
      const evaluation = row.cells[7]?.querySelector('select')?.value || '';
      const ressources = row.cells[8]?.querySelector('textarea')?.value || '';

      // Ajout de la ligne au fichier Excel
      const newRow = worksheet.addRow({
          type: typeApprentissage,
          objectif: objectif,
          outil: outil,
          consignes: consignes,
          duree: parseInt(duree),
          modalite: modalite,
          evaluation: evaluation,
          ressources: ressources,
      });

      // Application de la couleur de fond sur la cellule "Type"
      const typeCell = newRow.getCell('type');
      switch (typeApprentissage) {
          case 'Acquisition':             typeCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF16B1A2' } }; break;
          case 'Collaboration':           typeCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF39200' } }; break;
          case 'Discussion':              typeCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1D71B8' } }; break;
          case 'Enquête':                 typeCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFBE1622' } }; break;
          case 'Pratique - Entrainement': typeCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF662483' } }; break;
          case 'Production':              typeCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3AAA35' } }; break;
      }
      // Style pour centrer le texte dans les cellules
      newRow.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
  });

  // --- TÉLÉCHARGEMENT DU FICHIER ---
  workbook.xlsx.writeBuffer().then(function (buffer) {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'deroule_pedagogique.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  });
}