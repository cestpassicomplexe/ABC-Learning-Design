/**
 * ===================================================================================
 * FONCTION CENTRALE : Récupération des données du tableau
 * ===================================================================================
 * Parcourt le tableau et retourne un array d'objets, chaque objet représentant une ligne.
 * C'est le "cerveau" qui alimente toutes les fonctions d'export et de copie.
 */
function getTableData() {
    const data = [];
    const rows = document.querySelectorAll('#dropzone tr.ligne'); // On ne prend que les lignes de contenu

    const typeMapping = {
        'card-acquisition': 'Acquisition',
        'card-collaboration': 'Collaboration',
        'card-discussion': 'Discussion',
        'card-enquete': 'Enquête',
        'card-pratique': 'Pratique - Entrainement',
        'card-production': 'Production'
    };

    rows.forEach(row => {
        // La classe qui définit le type est sur la première cellule
        const typeClass = Array.from(row.cells[0].classList).find(c => c.startsWith('card-'));

        data.push({
            typeApprentissage: typeMapping[typeClass] || 'Inconnu',
            objectifs: row.cells[2].querySelector('textarea').value,
            outil: row.cells[3].innerText,
            consignes: row.cells[4].querySelector('textarea').value,
            duree: row.cells[5].querySelector('input').value,
            modalite: row.cells[6].querySelector('select').value,
            evaluation: row.cells[7].querySelector('select').value,
            ressources: row.cells[8].querySelector('textarea').value,
        });
    });

    return data;
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
    const content = JSON.stringify(data, null, 2); // Le '2' formate joliment le JSON
    downloadFile('scenario_pedagogique.json', content, 'application/json');
}

function exportExcel() {
    // Cette fonction utilise la librairie ExcelJS déjà chargée dans votre HTML.
    const data = getTableData();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Scénario Pédagogique');

    // Ajout des en-têtes
    worksheet.columns = [
        { header: 'Type d\'Apprentissage', key: 'typeApprentissage', width: 25 },
        { header: 'Objectif(s) Visé(s)', key: 'objectifs', width: 40 },
        { header: 'Outil', key: 'outil', width: 20 },
        { header: 'Consignes', key: 'consignes', width: 40 },
        { header: 'Durée (min)', key: 'duree', width: 15 },
        { header: 'Modalité', key: 'modalite', width: 30 },
        { header: 'Évaluation & Feedback', key: 'evaluation', width: 30 },
        { header: 'Ressources', key: 'ressources', width: 30 },
    ];

    // Ajout des données
    worksheet.addRows(data);

    // Génération du fichier
    workbook.xlsx.writeBuffer().then(buffer => {
        downloadFile('scenario_pedagogique.xlsx', buffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    });
}

/* Génère une chaîne de caractères complète représentant le tableau au format Markdown.
*/
function generateMarkdownTable(data) {
   // Les en-têtes complets
   let headers = [
       'Type d\'Apprentissage', 'Objectif(s) Visé(s)', 'Outil', 
       'Consignes', 'Durée (min)', 'Modalité', 
       'Évaluation & Feedback', 'Ressources'
   ];
   
   // Création de la ligne d'en-têtes et de la ligne de séparation
   let content = `| ${headers.join(' | ')} |\n`;
   content += `|${headers.map(() => ':---').join('|')}|\n`;

   // Ajout de chaque ligne de données
   data.forEach(row => {
       // On s'assure de nettoyer les sauts de ligne dans les textareas pour ne pas casser le tableau Markdown
       const cleanObjectives = row.objectifs.replace(/\n/g, ' ');
       const cleanConsignes = row.consignes.replace(/\n/g, ' ');
       const cleanRessources = row.ressources.replace(/\n/g, ' ');

       const rowData = [
           row.typeApprentissage, cleanObjectives, row.outil,
           cleanConsignes, row.duree, row.modalite,
           row.evaluation, cleanRessources
       ];
       
       content += `| ${rowData.join(' | ')} |\n`;
   });
   
   return content;
}

function exportMarkdown() {
    const data = getTableData();
    const content = generateMarkdownTable(data); // On utilise la nouvelle fonction
    downloadFile('scenario_pedagogique.md', content, 'text/markdown');
}

function exportHTML() {
    const data = getTableData();

    // On construit une table HTML propre à partir des données réelles
    let tableHtml = `
        <table>
            <thead>
                <tr>
                    <th>Type d'Apprentissage</th>
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
        tableHtml += `
            <tr>
                <td>${row.typeApprentissage}</td>
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
    tableHtml += `</tbody></table>`;
    
    // On enveloppe cette table dans une structure de page HTML complète
    let content = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>Export du Scénario Pédagogique</title>
            <style>
                body { font-family: sans-serif; }
                table { border-collapse: collapse; width: 100%; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
                thead { background-color: #f2f2f2; }
            </style>
        </head>
        <body>
            <h1>Scénario Pédagogique</h1>
            ${tableHtml}
        </body>
        </html>`;

    downloadFile('scenario_pedagogique.html', content, 'text/html');
}

function exportTXT() {
    const data = getTableData();
    let content = 'Scénario Pédagogique\n========================\n\n';
    data.forEach((row, index) => {
        content += `--- ÉTAPE ${index + 1} ---\n`;
        content += `Type d'Apprentissage: ${row.typeApprentissage}\n`;
        content += `Objectif(s) Visé(s): ${row.objectifs}\n`;
        content += `Outil: ${row.outil}\n`;
        content += `Consignes: ${row.consignes}\n`;
        content += `Durée: ${row.duree} minutes\n`;
        content += `Modalité: ${row.modalite}\n`;
        content += `Évaluation & Feedback: ${row.evaluation}\n`;
        content += `Ressources: ${row.ressources}\n\n`;
    });
    downloadFile('scenario_pedagogique.txt', content, 'text/plain');
}

/**
 * ===================================================================================
 * FONCTIONS DE COPIE (Presse-papiers)
 * ===================================================================================
 */

function copyHTML() {
    const data = getTableData();

    // On construit une table HTML propre sous forme de chaîne de caractères
    let htmlContent = `
        <style>
            table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            thead { background-color: #f2f2f2; font-weight: bold; }
        </style>
        <table>
            <thead>
                <tr>
                    <th>Type d'Apprentissage</th>
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
    const content = generateMarkdownTable(data); // On utilise aussi la nouvelle fonction

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
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (!Array.isArray(data)) throw new Error("Le fichier JSON n'est pas un tableau.");
            
            if (confirm("Voulez-vous remplacer le scénario actuel par celui du fichier ?")) {
                // Vider le tableau existant (sauf la dernière ligne vide)
                const dropzone = document.getElementById('dropzone');
                while (dropzone.rows.length > 1) {
                    dropzone.deleteRow(0);
                }

                // Créer les nouvelles lignes à partir des données importées
                data.forEach(rowData => creerLigneDeTableau(rowData));
                
                // Mettre à jour les graphiques
                actugraph();
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
    handle.addEventListener('dragstart', handleDragStart2);
    handle.addEventListener('dragend', handleDragEnd2);

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
    cellTypeApprentissage.addEventListener('click', handleClick); 
    
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

    document.getElementById('copy-html').addEventListener('click', copyHTML);
    document.getElementById('copy-md').addEventListener('click', copyMarkdown);
    
    // Logique d'importation/chargement
    document.getElementById('boutonImporter').addEventListener('click', () => {
        document.getElementById('fichierImport').click();
    });
    document.getElementById('fichierImport').addEventListener('change', handleImport);
});