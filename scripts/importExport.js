/**
 * ===================================================================================
 * FONCTION CENTRALE : Récupération des données du tableau
 * ===================================================================================
 * Parcourt le tableau et retourne un array d'objets, chaque objet représentant une ligne.
 * C'est le "cerveau" qui alimente toutes les fonctions d'export et de copie.
 */
function getTableData() {
    const data = [];
    const rows = document.querySelectorAll('#dropzone tr.ligne');

    const typeMapping = {
        'card-acquisition': 'Acquisition',
        'card-collaboration': 'Collaboration',
        'card-discussion': 'Discussion',
        'card-enquete': 'Enquête',
        'card-pratique': 'Pratique - Entrainement',
        'card-production': 'Production'
    };

    rows.forEach(row => {
        const firstCell = row.cells[0];
        const typeClass = firstCell ? Array.from(firstCell.classList).find(c => c.startsWith('card-')) : '';

        // Extraction du mot-clé depuis la cellule 2 (index 1)
        const keywordInput = row.cells[1]?.querySelector('.keyword-input');
        const keyword = keywordInput ? keywordInput.value : '';

        data.push({
            typeApprentissage: typeMapping[typeClass] || 'Inconnu',
            keyword: keyword,
            objectifs: row.cells[2]?.querySelector('textarea')?.value || '',
            outil: row.cells[3]?.innerText || '',
            consignes: row.cells[4]?.querySelector('textarea')?.value || '',
            duree: row.cells[5]?.querySelector('input')?.value || '0',
            modalite: row.cells[6]?.querySelector('select')?.value || '',
            evaluation: row.cells[7]?.querySelector('select')?.value || '',
            ressources: row.cells[8]?.querySelector('textarea')?.value || '',
        });
    });

    return data;
}

/**
 * Récupère les informations de la séquence pour les exports
 * Retourne un objet avec toutes les métadonnées de la séquence
 */
function getSequenceInfoForExport() {
    if (!sequenceInfo) {
        return {
            name: '',
            level: '',
            duration: '',
            objectives: '',
            audience: '',
            prerequisites: ''
        };
    }
    return sequenceInfo.getData();
}

/**
 * Génère une section d'en-tête avec les informations de la séquence
 * Format texte brut pour TXT et Markdown
 */
function generateSequenceInfoText(seqInfo) {
    let text = '';
    if (seqInfo.summary) text += `Résumé (140 car.) : ${seqInfo.summary}\n`;
    if (seqInfo.name) text += `Nom de la séquence : ${seqInfo.name}\n`;
    if (seqInfo.level) text += `Niveau : ${seqInfo.level}\n`;
    if (seqInfo.duration) text += `Durée totale : ${seqInfo.duration}\n`;
    if (seqInfo.objectives) text += `Objectifs d'apprentissage :\n${seqInfo.objectives}\n`;
    if (seqInfo.audience) text += `Public cible : ${seqInfo.audience}\n`;
    if (seqInfo.prerequisites) text += `Prérequis : ${seqInfo.prerequisites}\n`;
    if (text) text += '\n' + '='.repeat(80) + '\n\n';
    return text;
}

/**
 * ===================================================================================
 * FONCTIONS D'EXPORT (Génération de fichiers)
 * ===================================================================================
 */

// --- Fonctions utilitaires ---
function downloadFile(filename, content, mimeType) {
    const a = document.createElement('a');
    const blob = new Blob([content], { type: mimeType });
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
}

// --- Fonctions par format ---

function exportJSON() {
    const data = getTableData();
    const sequenceData = {
        sequenceInfo: sequenceInfo ? sequenceInfo.getData() : {},
        activites: data
    };
    const content = JSON.stringify(sequenceData, null, 2);
    const filename = sequenceInfo?.getData().name ?
        `${sequenceInfo.getData().name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json` :
        'scenario_pedagogique.json';
    downloadFile(filename, content, 'application/json');
}

function exportExcel() {
    try {
        // Détection robuste de la bibliothèque (peut varier selon le CDN/Version)
        const LibExcel = window.ExcelJS || window.exceljs;

        if (!LibExcel) {
            alert("La bibliothèque ExcelJS n'a pas pu être chargée.\n\nCauses possibles :\n1. Connexion internet requise pour charger la librairie.\n2. Le chargement est encore en cours (merci de patienter quelques secondes).");
            return;
        }

        const data = getTableData();
        const seqInfo = getSequenceInfoForExport();
        const workbook = new LibExcel.Workbook();
        const worksheet = workbook.addWorksheet('Scénario Pédagogique');

        let currentRow = 1;

        // Ajout des informations de la séquence
        if (seqInfo.summary) {
            worksheet.getCell(`A${currentRow}`).value = 'Résumé (140 car.) :';
            worksheet.getCell(`A${currentRow}`).font = { bold: true };
            worksheet.getCell(`B${currentRow}`).value = seqInfo.summary;
            currentRow++;
        }
        if (seqInfo.name) {
            worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
            const titleCell = worksheet.getCell(`A${currentRow}`);
            titleCell.value = seqInfo.name;
            titleCell.font = { bold: true, size: 16 };
            currentRow++;
        }

        if (seqInfo.level || seqInfo.duration) {
            if (seqInfo.level) {
                worksheet.getCell(`A${currentRow}`).value = 'Niveau :';
                worksheet.getCell(`A${currentRow}`).font = { bold: true };
                worksheet.getCell(`B${currentRow}`).value = seqInfo.level;
                currentRow++;
            }
            if (seqInfo.duration) {
                worksheet.getCell(`A${currentRow}`).value = 'Durée totale :';
                worksheet.getCell(`A${currentRow}`).font = { bold: true };
                worksheet.getCell(`B${currentRow}`).value = seqInfo.duration;
                currentRow++;
            }
        }

        if (seqInfo.objectives) {
            worksheet.getCell(`A${currentRow}`).value = 'Objectifs d\'apprentissage :';
            worksheet.getCell(`A${currentRow}`).font = { bold: true };
            currentRow++;
            worksheet.mergeCells(`A${currentRow}:I${currentRow}`);
            worksheet.getCell(`A${currentRow}`).value = seqInfo.objectives;
            worksheet.getCell(`A${currentRow}`).alignment = { wrapText: true };
            currentRow++;
        }

        if (currentRow > 1) currentRow++; // Ligne vide avant le tableau

        // Configuration des colonnes (avec en-têtes)
        worksheet.columns = [
            { header: 'Type d\'Apprentissage', key: 'typeApprentissage', width: 25 },
            { header: 'Note / Rappel', key: 'keyword', width: 20 },
            { header: 'Objectif(s) Visé(s)', key: 'objectifs', width: 40 },
            { header: 'Outil', key: 'outil', width: 20 },
            { header: 'Consignes', key: 'consignes', width: 40 },
            { header: 'Durée (min)', key: 'duree', width: 15 },
            { header: 'Modalité', key: 'modalite', width: 30 },
            { header: 'Évaluation & Feedback', key: 'evaluation', width: 30 },
            { header: 'Ressources', key: 'ressources', width: 30 },
        ];

        // Style pour la ligne d'en-tête
        const headerRow = worksheet.getRow(worksheet.columns[0].header ? currentRow : currentRow);
        worksheet.getRow(worksheet.lastRow.number).font = { bold: true };
        worksheet.getRow(worksheet.lastRow.number).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD3D3D3' }
        };

        // Ajout des données
        data.forEach(row => {
            worksheet.addRow(row);
        });

        // Génération du fichier
        const filename = seqInfo.name ?
            `${seqInfo.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.xlsx` :
            'scenario_pedagogique.xlsx';

        workbook.xlsx.writeBuffer().then(buffer => {
            downloadFile(filename, buffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        });
    } catch (error) {
        console.error('Erreur export Excel:', error);
        alert('Une erreur est survenue lors de l\'export Excel : ' + error.message);
    }
}

/* Génère une chaîne de caractères complète représentant le tableau au format Markdown.
*/
function generateMarkdownTable(data) {
    // Les en-têtes complets
    let headers = [
        'Type d\'Apprentissage', 'Note / Rappel', 'Objectif(s) Visé(s)', 'Outil',
        'Consignes', 'Durée (min)', 'Modalité',
        'Évaluation & Feedback', 'Ressources'
    ];

    // Création de la ligne d'en-têtes et de la ligne de séparation
    let content = `| ${headers.join(' | ')} |\n`;
    content += `|${headers.map(() => ':---').join('|')}|\n`;

    // Ajout de chaque ligne de données
    data.forEach(row => {
        const cleanKeyword = row.keyword.replace(/\n/g, ' ');
        const cleanObjectives = row.objectifs.replace(/\n/g, ' ');
        const cleanConsignes = row.consignes.replace(/\n/g, ' ');
        const cleanRessources = row.ressources.replace(/\n/g, ' ');

        const rowData = [
            row.typeApprentissage, cleanKeyword, cleanObjectives, row.outil,
            cleanConsignes, row.duree, row.modalite,
            row.evaluation, cleanRessources
        ];

        content += `| ${rowData.join(' | ')} |\n`;
    });

    return content;
}

function exportMarkdown() {
    const data = getTableData();
    const seqInfo = getSequenceInfoForExport();

    // En-tête avec les informations de la séquence
    let content = '';
    if (seqInfo.summary) content += `**Résumé (140 car.)** : ${seqInfo.summary}\n\n`;
    if (seqInfo.name) content += `# ${seqInfo.name}\n\n`;
    if (seqInfo.level || seqInfo.duration) {
        content += '**Informations générales**\n\n';
        if (seqInfo.level) content += `- **Niveau** : ${seqInfo.level}\n`;
        if (seqInfo.duration) content += `- **Durée totale** : ${seqInfo.duration}\n`;
        content += '\n';
    }
    if (seqInfo.objectives) content += `**Objectifs d'apprentissage**\n\n${seqInfo.objectives}\n\n`;
    if (seqInfo.audience) content += `**Public cible** : ${seqInfo.audience}\n\n`;
    if (seqInfo.prerequisites) content += `**Prérequis** : ${seqInfo.prerequisites}\n\n`;
    if (content) content += '---\n\n';

    // Tableau des activités
    content += '## Activités pédagogiques\n\n';
    content += generateMarkdownTable(data);

    const filename = seqInfo.name ?
        `${seqInfo.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md` :
        'scenario_pedagogique.md';
    downloadFile(filename, content, 'text/markdown');
}

function exportHTML() {
    const data = getTableData();
    const seqInfo = getSequenceInfoForExport();

    // Section d'informations de la séquence
    let seqInfoHtml = '';
    if (seqInfo.summary || seqInfo.name || seqInfo.level || seqInfo.duration || seqInfo.objectives || seqInfo.audience || seqInfo.prerequisites) {
        seqInfoHtml = '<div class="sequence-info" style="margin-bottom: 30px;">';
        if (seqInfo.summary) seqInfoHtml += `<p><strong>Résumé (140 car.) :</strong> ${seqInfo.summary}</p>`;
        if (seqInfo.name || seqInfo.level || seqInfo.duration) {
            seqInfoHtml += '<div style="margin-bottom: 15px;">';
            if (seqInfo.level) seqInfoHtml += `<p><strong>Niveau :</strong> ${seqInfo.level}</p>`;
            if (seqInfo.duration) seqInfoHtml += `<p><strong>Durée totale :</strong> ${seqInfo.duration}</p>`;
            seqInfoHtml += '</div>';
        }
        if (seqInfo.objectives) seqInfoHtml += `<div style="margin-bottom: 15px;"><strong>Objectifs d'apprentissage :</strong><br>${seqInfo.objectives.replace(/\n/g, '<br>')}</div>`;
        if (seqInfo.audience) seqInfoHtml += `<p><strong>Public cible :</strong> ${seqInfo.audience}</p>`;
        if (seqInfo.prerequisites) seqInfoHtml += `<p><strong>Prérequis :</strong> ${seqInfo.prerequisites}</p>`;
        seqInfoHtml += '<hr style="margin: 20px 0;">';
        seqInfoHtml += '</div>';
    }

    // On construit une table HTML propre à partir des données réelles
    let tableHtml = `
        <table style="border-collapse: collapse; width: 100%;">
            <thead>
                <tr style="background-color: #f2f2f2;">
                    <th style="border: 1px solid #ddd; padding: 8px;">Type d'Apprentissage</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Note / Rappel</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Objectif(s) Visé(s)</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Outil</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Consignes</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Durée (min)</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Modalité</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Évaluation & Feedback</th>
                    <th style="border: 1px solid #ddd; padding: 8px;">Ressources</th>
                </tr>
            </thead>
            <tbody>
    `;
    data.forEach(row => {
        tableHtml += `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">${row.typeApprentissage}</td>
                <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">${row.keyword}</td>
                <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">${row.objectifs.replace(/\n/g, '<br>')}</td>
                <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">${row.outil}</td>
                <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">${row.consignes.replace(/\n/g, '<br>')}</td>
                <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top; text-align: center;">${row.duree}</td>
                <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">${row.modalite}</td>
                <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">${row.evaluation}</td>
                <td style="border: 1px solid #ddd; padding: 8px; vertical-align: top;">${row.ressources.replace(/\n/g, '<br>')}</td>
            </tr>
        `;
    });
    tableHtml += `</tbody></table>`;

    // On enveloppe cette table dans une structure de page HTML complète
    const title = seqInfo.name || 'Scénario Pédagogique';
    let content = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <style>
                body { font-family: sans-serif; max-width: 1200px; margin: 20px auto; padding: 0 20px; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
                thead { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            ${seqInfoHtml}
            <h2>Activités pédagogiques</h2>
            ${tableHtml}
        </body>
        </html>`;

    const filename = seqInfo.name ?
        `${seqInfo.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html` :
        'scenario_pedagogique.html';
    downloadFile(filename, content, 'text/html');
}

function exportTXT() {
    const data = getTableData();
    const seqInfo = getSequenceInfoForExport();

    const title = seqInfo.name || 'Scénario Pédagogique';
    let content = `${title}\n${'='.repeat(title.length)}\n\n`;

    // Informations de la séquence
    content += generateSequenceInfoText(seqInfo);

    // Activités
    content += 'ACTIVITÉS PÉDAGOGIQUES\n';
    content += '='.repeat(80) + '\n\n';
    data.forEach((row, index) => {
        content += `--- ÉTAPE ${index + 1} ---\n`;
        content += `Type d'Apprentissage: ${row.typeApprentissage}\n`;
        if (row.keyword) content += `Note / Rappel: ${row.keyword}\n`;
        content += `Objectif(s) Visé(s): ${row.objectifs}\n`;
        content += `Outil: ${row.outil}\n`;
        content += `Consignes: ${row.consignes}\n`;
        content += `Durée: ${row.duree} minutes\n`;
        content += `Modalité: ${row.modalite}\n`;
        content += `Évaluation & Feedback: ${row.evaluation}\n`;
        content += `Ressources: ${row.ressources}\n\n`;
    });

    const filename = seqInfo.name ?
        `${seqInfo.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt` :
        'scenario_pedagogique.txt';
    downloadFile(filename, content, 'text/plain');
}

function exportDOCX() {
    const data = getTableData();
    const seqInfo = getSequenceInfoForExport();

    // Vérifier que la bibliothèque html-docx-js est chargée
    if (typeof htmlDocx === 'undefined' || typeof htmlDocx.asBlob === 'undefined') {
        alert('Erreur : La bibliothèque html-docx-js n\'est pas chargée. Vérifiez votre connexion Internet.');
        console.error('html-docx-js library not found. Check if the CDN script loaded correctly.');
        return;
    }

    // Construire le HTML pour la conversion
    const title = seqInfo.name || 'Scénario Pédagogique';
    let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <style>
                body { font-family: Calibri, Arial, sans-serif; }
                h1 { color: #2E75B6; font-size: 24pt; }
                h2 { color: #2E75B6; font-size: 18pt; margin-top: 20pt; }
                p { margin: 6pt 0; }
                table { border-collapse: collapse; width: 100%; margin-top: 10pt; }
                th, td { border: 1px solid #000; padding: 8pt; text-align: left; vertical-align: top; }
                th { background-color: #D9E2F3; font-weight: bold; }
                .info-label { font-weight: bold; }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
    `;

    // Informations de la séquence
    if (seqInfo.summary || seqInfo.level || seqInfo.duration || seqInfo.objectives || seqInfo.audience || seqInfo.prerequisites) {
        if (seqInfo.summary) {
            htmlContent += `<p><span class="info-label">Résumé (140 car.) :</span> ${seqInfo.summary}</p>`;
        }
        if (seqInfo.level) {
            htmlContent += `<p><span class="info-label">Niveau :</span> ${seqInfo.level}</p>`;
        }
        if (seqInfo.duration) {
            htmlContent += `<p><span class="info-label">Durée totale :</span> ${seqInfo.duration}</p>`;
        }
        if (seqInfo.objectives) {
            htmlContent += `<p><span class="info-label">Objectifs d'apprentissage :</span></p>`;
            htmlContent += `<p>${seqInfo.objectives.replace(/\n/g, '<br>')}</p>`;
        }
        if (seqInfo.audience) {
            htmlContent += `<p><span class="info-label">Public cible :</span> ${seqInfo.audience}</p>`;
        }
        if (seqInfo.prerequisites) {
            htmlContent += `<p><span class="info-label">Prérequis :</span> ${seqInfo.prerequisites}</p>`;
        }
    }

    // Tableau des activités
    htmlContent += `
        <h2>Activités pédagogiques</h2>
        <table>
            <thead>
                <tr>
                    <th>Type d'Apprentissage</th>
                    <th>Note / Rappel</th>
                    <th>Objectif(s) Visé(s)</th>
                    <th>Outil</th>
                    <th>Consignes</th>
                    <th>Durée (min)</th>
                    <th>Modalité</th>
                    <th>Évaluation & Feedback</th>
                    <th>Ressources</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(row => {
        htmlContent += `
            <tr>
                <td>${row.typeApprentissage}</td>
                <td>${row.keyword}</td>
                <td>${row.objectifs.replace(/\n/g, '<br>')}</td>
                <td>${row.outil}</td>
                <td>${row.consignes.replace(/\n/g, '<br>')}</td>
                <td>${row.duree}</td>
                <td>${row.modalite}</td>
                <td>${row.evaluation}</td>
                <td>${row.ressources.replace(/\n/g, '<br>')}</td>
            </tr>
        `;
    });

    htmlContent += `
            </tbody>
        </table>
        </body>
        </html>
    `;

    // Convertir HTML en DOCX
    try {
        const converted = htmlDocx.asBlob(htmlContent);
        const filename = seqInfo.name ?
            `${seqInfo.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.docx` :
            'scenario_pedagogique.docx';
        downloadFile(filename, converted, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    } catch (err) {
        console.error('Erreur lors de la génération du DOCX :', err);
        alert('Erreur lors de la génération du fichier DOCX : ' + err.message);
    }
}


/**
 * ===================================================================================
 * FONCTIONS DE COPIE (Presse-papiers)
 * ===================================================================================
 */

function copyHTML() {
    const data = getTableData();
    const seqInfo = getSequenceInfoForExport();

    // Section d'informations de la séquence
    let seqInfoHtml = '';
    if (seqInfo.summary || seqInfo.name || seqInfo.level || seqInfo.duration || seqInfo.objectives || seqInfo.audience || seqInfo.prerequisites) {
        seqInfoHtml = '<div style="margin-bottom: 20px;">';
        if (seqInfo.summary) seqInfoHtml += `<p><strong>Résumé (140 car.) :</strong> ${seqInfo.summary}</p>`;
        if (seqInfo.name) seqInfoHtml += `<h2>${seqInfo.name}</h2>`;
        if (seqInfo.level) seqInfoHtml += `<p><strong>Niveau :</strong> ${seqInfo.level}</p>`;
        if (seqInfo.duration) seqInfoHtml += `<p><strong>Durée totale :</strong> ${seqInfo.duration}</p>`;
        if (seqInfo.objectives) seqInfoHtml += `<p><strong>Objectifs d'apprentissage :</strong><br>${seqInfo.objectives.replace(/\n/g, '<br>')}</p>`;
        if (seqInfo.audience) seqInfoHtml += `<p><strong>Public cible :</strong> ${seqInfo.audience}</p>`;
        if (seqInfo.prerequisites) seqInfoHtml += `<p><strong>Prérequis :</strong> ${seqInfo.prerequisites}</p>`;
        seqInfoHtml += '<hr>';
        seqInfoHtml += '</div>';
    }

    // On construit une table HTML propre sous forme de chaîne de caractères
    let htmlContent = `
        <style>
            table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            thead { background-color: #f2f2f2; font-weight: bold; }
        </style>
        ${seqInfoHtml}
        <table>
            <thead>
                <tr>
                    <th>Type d'Apprentissage</th>
                    <th>Note / Rappel</th>
                    <th>Objectif(s) Visé(s)</th>
                    <th>Outil</th>
                    <th>Consignes</th>
                    <th>Durée (min)</th>
                    <th>Modalité</th>
                    <th>Évaluation & Feedback</th>
                    <th>Ressources</th>
                </tr>
            </thead>
            <tbody>
    `;

    // On ajoute chaque ligne de données
    data.forEach(row => {
        htmlContent += `
            <tr>
                <td>${row.typeApprentissage}</td>
                <td>${row.keyword}</td>
                <td>${row.objectifs}</td>
                <td>${row.outil}</td>
                <td>${row.consignes}</td>
                <td>${row.duree}</td>
                <td>${row.modalite}</td>
                <td>${row.evaluation}</td>
                <td>${row.ressources}</td>
            </tr>
        `;
    });

    htmlContent += `</tbody></table>`;

    // On utilise l'API Clipboard pour copier ce HTML "riche"
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const clipboardItem = new ClipboardItem({ 'text/html': blob });

    navigator.clipboard.write([clipboardItem]).then(() => {
        alert('Tableau copié dans le presse-papiers ! Vous pouvez le coller dans Word, Google Docs, etc.');
    }).catch(err => {
        console.error('Erreur lors de la copie HTML :', err);
        alert('La copie a échoué.');
    });
}

function copyMarkdown() {
    const data = getTableData();
    const seqInfo = getSequenceInfoForExport();

    // En-tête avec les informations de la séquence
    let content = '';
    if (seqInfo.summary) content += `**Résumé (140 car.)** : ${seqInfo.summary}\n\n`;
    if (seqInfo.name) content += `# ${seqInfo.name}\n\n`;
    if (seqInfo.level || seqInfo.duration) {
        content += '**Informations générales**\n\n';
        if (seqInfo.level) content += `- **Niveau** : ${seqInfo.level}\n`;
        if (seqInfo.duration) content += `- **Durée totale** : ${seqInfo.duration}\n`;
        content += '\n';
    }
    if (seqInfo.objectives) content += `**Objectifs d'apprentissage**\n\n${seqInfo.objectives}\n\n`;
    if (seqInfo.audience) content += `**Public cible** : ${seqInfo.audience}\n\n`;
    if (seqInfo.prerequisites) content += `**Prérequis** : ${seqInfo.prerequisites}\n\n`;
    if (content) content += '---\n\n';

    // Tableau des activités
    content += '## Activités pédagogiques\n\n';
    content += generateMarkdownTable(data);

    navigator.clipboard.writeText(content).then(() => {
        alert('Tableau copié au format Markdown !');
    }).catch(err => {
        console.error('Erreur lors de la copie Markdown :', err);
        alert('La copie a échoué.');
    });
}


/**
 * ===================================================================================
 * FONCTION D'IMPORT (Lecture de fichier JSON)
 * ===================================================================================
 */

function handleImport(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const jsonData = JSON.parse(e.target.result);

            // Support ancien format (array) et nouveau format (object avec sequenceInfo)
            let data, seqInfo;
            if (Array.isArray(jsonData)) {
                data = jsonData;
                seqInfo = null;
            } else {
                data = jsonData.activites || [];
                seqInfo = jsonData.sequenceInfo || null;
            }

            if (!Array.isArray(data)) throw new Error("Format de fichier invalide.");

            if (confirm("Voulez-vous remplacer le scénario actuel par celui du fichier ?")) {
                // Charger les infos de séquence si présentes
                if (seqInfo && sequenceInfo) {
                    sequenceInfo.setData(seqInfo);
                }

                // Vider le tableau existant (sauf la dernière ligne vide)
                const dropzone = document.getElementById('dropzone');
                while (dropzone.rows.length > 1) {
                    dropzone.deleteRow(0);
                }

                // Créer les nouvelles lignes à partir des données importées
                data.forEach(rowData => creerLigneDeTableau(rowData));

                // Mettre à jour les graphiques et la durée
                actugraph();
                if (sequenceInfo) {
                    sequenceInfo.updateDuration();
                }
            }

        } catch (error) {
            alert("Erreur lors de la lecture du fichier : " + error.message);
        } finally {
            // Réinitialiser l'input pour pouvoir réimporter le même fichier si besoin
            event.target.value = '';
        }
    };
    reader.readAsText(file);
}

/**
 * Recrée une ligne <tr> complète dans le tableau à partir d'un objet de données.
 * Cette fonction est le miroir de `handleDragEnd` de votre fichier DragAndDrop.js.
 */
function creerLigneDeTableau(data) {
    const dropzoneTbody = document.getElementById('dropzone');
    const targetRow = dropzoneTbody.insertRow(dropzoneTbody.rows.length - 1);

    targetRow.className = 'ligne text-center';

    const typeMapping = {
        'Acquisition': { class: 'card-acquisition', num: '1', icon: './images/acquisition.png' },
        'Collaboration': { class: 'card-collaboration', num: '2', icon: './images/collaboration.png' },
        'Discussion': { class: 'card-discussion', num: '3', icon: './images/discussion.png' },
        'Enquête': { class: 'card-enquete', num: '4', icon: './images/enquete.png' },
        'Pratique - Entrainement': { class: 'card-pratique', num: '5', icon: './images/pratique.png' },
        'Production': { class: 'card-production', num: '6', icon: './images/production.png' }
    };
    const cardInfo = typeMapping[data.typeApprentissage] || { class: 'bg-light', num: '0', icon: '' };

    // --- Cellule 1: Poignée et Suppression ---
    let cell1 = targetRow.insertCell();
    cell1.innerHTML = `
        <div class="d-flex justify-content-around align-items-center h-100">
            <i class="fa-solid fa-grip-vertical" draggable="true" style="cursor: grab;"></i>
            <button class="btn" onclick="supprimer(this);"><i class="fa-solid fa-trash"></i></button>
        </div>`;
    cell1.classList.add(cardInfo.class);
    const handle = cell1.querySelector('.fa-grip-vertical');
    handle.addEventListener('dragstart', window.handleDragStart2);
    handle.addEventListener('dragend', window.handleDragEnd2);

    // --- Cellule 2: Type d'Apprentissage (avec l'icône) ---
    const cellTypeApprentissage = targetRow.insertCell();
    cellTypeApprentissage.classList.add(cardInfo.class);
    // *** CORRECTION FINALE : Le &nbsp; a été retiré de l'intérieur du <h6> ***
    cellTypeApprentissage.innerHTML = `
        <div class="d-flex flex-row align-items-center p-1">
            <img src="${cardInfo.icon}" style="height:30px;" class="">
            <h6 class="titre-carte w-75 ps-2 mb-0">${data.typeApprentissage}</h6>
        </div>
    `;
    cellTypeApprentissage.id = `card${cardInfo.num}-${new Date().getTime()}`;
    cellTypeApprentissage.addEventListener('click', function () { window.declencherModification(this); });

    // --- Autres cellules ---
    targetRow.insertCell().innerHTML = `<textarea class='form-control ligne' placeholder="L'apprenant sera capable de...">${data.objectifs}</textarea>`;
    targetRow.insertCell().innerText = data.outil;
    targetRow.insertCell().innerHTML = `<textarea class='form-control ligne' placeholder="Instructions pour l'activité...">${data.consignes}</textarea>`;
    targetRow.insertCell().innerHTML = `<input type='number' class='form-control' value='${data.duree}' min='0' onchange='actugraph();'>`;

    const cellModalite = targetRow.insertCell();
    cellModalite.innerHTML = `<select class='form-select' onchange="actugraph();"><option>Présentiel / Individuel</option><option>Présentiel / En groupe</option><option>Présentiel / Classe entière</option><option>Distanciel Synchrone / Individuel</option><option>Distanciel Synchrone / En groupe</option><option>Distanciel Synchrone / Classe entière</option><option>Distanciel Asynchrone / Individuel</option><option>Distanciel Asynchrone / En groupe</option></select>`;
    cellModalite.querySelector('select').value = data.modalite;

    const cellEvaluation = targetRow.insertCell();
    cellEvaluation.innerHTML = `<select class='form-select' onchange="actugraph();"><option>Non évalué</option><option>Formatif (auto-corrigé)</option><option>Formatif (par les pairs)</option><option>Formatif (enseignant)</option><option>Sommative (notée)</option><option>Certificative</option></select>`;
    cellEvaluation.querySelector('select').value = data.evaluation;

    targetRow.insertCell().innerHTML = `<textarea class='form-control ligne' placeholder="Lien, PDF, matériel...">${data.ressources}</textarea>`;
}


/**
 * ===================================================================================
 * MISE EN PLACE DES ÉCOUTEURS D'ÉVÉNEMENTS
 * ===================================================================================
 * Ce code s'exécute une fois que la page est chargée et connecte les boutons
 * du menu aux fonctions JavaScript correspondantes.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Bouton principal de sauvegarde
    document.getElementById('boutonSauvegarder').addEventListener('click', exportJSON); // L'export JSON est notre sauvegarde

    // Clic sur les boutons du menu "Exporter & Copier"
    document.getElementById('export-excel').addEventListener('click', exportExcel);
    document.getElementById('export-md').addEventListener('click', exportMarkdown);
    document.getElementById('export-html').addEventListener('click', exportHTML);
    document.getElementById('export-txt').addEventListener('click', exportTXT);
    document.getElementById('export-docx').addEventListener('click', exportDOCX);

    document.getElementById('copy-html').addEventListener('click', copyHTML);
    document.getElementById('copy-md').addEventListener('click', copyMarkdown);

    // Logique d'importation/chargement
    document.getElementById('boutonImporter').addEventListener('click', () => {
        document.getElementById('fichierImport').click();
    });
    document.getElementById('fichierImport').addEventListener('change', handleImport);
});