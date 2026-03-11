// --- Configuration des types d'activités ---
window.TYPES_CONFIG = {
    "1": { name: "Acquisition", icon: "./images/acquisition.png", class: "card-acquisition" },
    "2": { name: "Collaboration", icon: "./images/collaboration.png", class: "card-collaboration" },
    "3": { name: "Discussion", icon: "./images/discussion.png", class: "card-discussion" },
    "4": { name: "Enquête", icon: "./images/enquete.png", class: "card-enquete" },
    "5": { name: "Pratique", icon: "./images/pratique.png", class: "card-pratique" },
    "6": { name: "Production", icon: "./images/production.png", class: "card-production" }
};

// --- Initialisation des variables et des écouteurs d'événements ---

document.addEventListener('DOMContentLoaded', function () {
    const dropzone = document.getElementById('dropzone');
    let ligneEnCours = undefined;

    // ----------------------------------------------------------------
    // MODIFICATION D'UNE LIGNE (focus sur le premier champ)
    // ----------------------------------------------------------------
    window.declencherModification = function (elementDeclencheur) {
        const ligneAModifier = elementDeclencheur.closest('tr');
        document.querySelectorAll('.ligne-en-modification').forEach(row => row.classList.remove('ligne-en-modification'));
        ligneAModifier.classList.add('ligne-en-modification');
        ligneEnCours = ligneAModifier.rowIndex;
        ligneAModifier.querySelector('textarea, input, select')?.focus();
    };

    function getCardTypeName(number) {
        const types = { "1": 'acquisition', "2": 'collaboration', "3": 'discussion', "4": 'enquete', "5": 'pratique', "6": 'production' };
        return types[number] || '';
    }

    // ----------------------------------------------------------------
    // CRÉATION DU CONTENU D'UNE LIGNE
    // ----------------------------------------------------------------
    function creerContenuLigne(ligne, cardIdNumber, nomOutil, initialKeyword = "") {
        ligne.className = 'ligne text-center';
        ligne.innerHTML = '';

        // --- Cellule 1 : Handle drag + bouton Supprimer ---
        let cell1 = ligne.insertCell();
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'actions-container';

        const handle = document.createElement('i');
        handle.className = 'fa-solid fa-grip-vertical handle';
        handle.setAttribute('draggable', 'true');
        handle.setAttribute('aria-label', 'Déplacer la ligne');
        handle.addEventListener('dragstart', handleDragStart2);
        handle.addEventListener('dragend', handleDragEnd2);

        const iconStack = document.createElement('div');
        iconStack.className = 'icon-stack';
        const btnSuppr = document.createElement('button');
        btnSuppr.className = 'btn btn-icon';
        btnSuppr.title = 'Supprimer';
        btnSuppr.innerHTML = '<i class="fa-solid fa-trash"></i>';
        btnSuppr.addEventListener('click', function () { window.supprimer(this); });
        iconStack.appendChild(btnSuppr);

        actionsDiv.appendChild(handle);
        actionsDiv.appendChild(iconStack);
        cell1.appendChild(actionsDiv);

        // --- Cellule 2 : Type d'activité ---
        const config = window.TYPES_CONFIG[cardIdNumber] || { name: 'Activité', icon: '', class: '' };
        const imageSrc = config.icon;
        const titreText = config.name;

        let cell2 = ligne.insertCell();
        if (imageSrc) {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.style.maxHeight = '50px';
            img.className = 'img-fluid';
            cell2.appendChild(img);
        }
        const h6 = document.createElement('h6');
        h6.className = 'titre-carte mb-0';
        h6.textContent = titreText;
        cell2.appendChild(h6);

        // Zone éditable pour le rappel / mot-clé
        const keywordInput = document.createElement('input');
        keywordInput.type = 'text';
        keywordInput.className = 'keyword-input';
        keywordInput.value = initialKeyword;
        keywordInput.placeholder = 'Rappel / Mot-clé...';
        keywordInput.title = 'Ce texte apparaîtra dans la timeline au survol';
        // L'input déclenche indirectement render() de la timeline via l'observer
        cell2.appendChild(keywordInput);
        cell2.id = 'card' + cardIdNumber + '-' + new Date().getTime();

        const cardColorClass = 'card-' + getCardTypeName(cardIdNumber);
        cell1.classList.add(cardColorClass);
        cell2.classList.add(cardColorClass);

        // --- Cellule 3 : Objectif ---
        let cell3 = ligne.insertCell();
        let ta3 = document.createElement('textarea');
        ta3.className = 'form-control ligne';
        ta3.placeholder = "L'apprenant sera capable de...";
        cell3.appendChild(ta3);

        // --- Cellule 4 : Outil ---
        let cellOutil = ligne.insertCell();
        cellOutil.innerText = nomOutil || 'Cliquer pour choisir...';
        cellOutil.style.cursor = 'pointer';
        cellOutil.className = 'tool-cell text-primary fw-bold';
        cellOutil.addEventListener('click', () => {
            if (window.toolSelector) window.toolSelector.open(ligne, cardIdNumber);
        });

        // --- Cellule 5 : Consignes ---
        let cell5 = ligne.insertCell();
        let ta5 = document.createElement('textarea');
        ta5.className = 'form-control ligne';
        ta5.placeholder = "Instructions pour l'activité...";
        cell5.appendChild(ta5);

        // --- Cellule 6 : Durée ---
        let cell6 = ligne.insertCell();
        let inp6 = document.createElement('input');
        inp6.type = 'number';
        inp6.className = 'form-control';
        inp6.value = '10';
        inp6.min = '0';
        inp6.addEventListener('change', () => actugraph());
        cell6.appendChild(inp6);

        // --- Cellule 7 : Modalité ---
        let cell7 = ligne.insertCell();
        let sel7 = document.createElement('select');
        sel7.className = 'form-select';
        sel7.addEventListener('change', () => actugraph());
        ['Présentiel / Individuel', 'Présentiel / En groupe', 'Présentiel / Classe entière',
            'Distanciel Synchrone / Individuel', 'Distanciel Synchrone / En groupe', 'Distanciel Synchrone / Classe entière',
            'Distanciel Asynchrone / Individuel', 'Distanciel Asynchrone / En groupe'].forEach(opt => {
                sel7.appendChild(new Option(opt));
            });
        cell7.appendChild(sel7);

        // --- Cellule 8 : Évaluation ---
        let cell8 = ligne.insertCell();
        let sel8 = document.createElement('select');
        sel8.className = 'form-select';
        sel8.addEventListener('change', () => actugraph());
        ['Non évalué', 'Formatif (auto-corrigé)', 'Formatif (par les pairs)',
            'Formatif (enseignant)', 'Sommative (notée)', 'Certificative'].forEach(opt => {
                sel8.appendChild(new Option(opt));
            });
        cell8.appendChild(sel8);

        // --- Cellule 9 : Ressources ---
        let cell9 = ligne.insertCell();
        let ta9 = document.createElement('textarea');
        ta9.className = 'form-control ligne';
        ta9.placeholder = 'Lien, PDF, matériel...';
        cell9.appendChild(ta9);

        // --- Surbrillance au focus ---
        ligne.querySelectorAll('.form-control, .form-select').forEach(elm => {
            elm.addEventListener('focus', () => {
                document.querySelectorAll('.ligne-en-modification').forEach(r => r.classList.remove('ligne-en-modification'));
                ligne.classList.add('ligne-en-modification');
                document.querySelectorAll('.cardBackCliquable').forEach(card => card.classList.add('d-none'));
                ligneEnCours = undefined;
            });
        });
    }

    // ----------------------------------------------------------------
    // DRAG & DROP DES LIGNES (handle → réordonnancement)
    // ----------------------------------------------------------------
    function handleDragStart2(event) {
        const row = event.target.closest('tr.ligne');
        if (!row) return;
        row.classList.add('dragging');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', ''); // Firefox compatibility
    }

    function handleDragEnd2(event) {
        const draggedRow = document.querySelector('tr.ligne.dragging');
        if (draggedRow) draggedRow.classList.remove('dragging');
        actugraph();
        setTimeout(() => {
            if (window.refreshTableInsertionButtons) window.refreshTableInsertionButtons();
        }, 50);
    }

    // ----------------------------------------------------------------
    // BOUTONS D'INSERTION ENTRE LES LIGNES DU TABLEAU
    // ----------------------------------------------------------------
    window.refreshTableInsertionButtons = function () {
        document.querySelectorAll('.row-insert-container').forEach(el => el.remove());
        const rows = Array.from(dropzone.querySelectorAll('tr.ligne'));

        rows.forEach((row, index) => {
            const insertRow = document.createElement('tr');
            insertRow.className = 'row-insert-container';
            insertRow.innerHTML = '<td colspan="9"><button class="row-insert-btn" aria-label="Insérer une activité"><i class="fa-solid fa-plus"></i></button></td>';
            insertRow.querySelector('.row-insert-btn').addEventListener('click', () => window.openInsertionModalAt(index));
            row.parentNode.insertBefore(insertRow, row);
        });

        if (rows.length > 0) {
            const lastInsertRow = document.createElement('tr');
            lastInsertRow.className = 'row-insert-container';
            lastInsertRow.innerHTML = '<td colspan="9"><button class="row-insert-btn" aria-label="Insérer une activité à la fin"><i class="fa-solid fa-plus"></i></button></td>';
            lastInsertRow.querySelector('.row-insert-btn').addEventListener('click', () => window.openInsertionModalAt(rows.length));
            dropzone.appendChild(lastInsertRow);
        }
    };

    window.openInsertionModalAt = function (index) {
        if (window.timeline) {
            window.timeline.insertionIndex = index;
            const modal = new bootstrap.Modal(document.getElementById('activityTypeModal'));
            modal.show();
        }
    };

    // ----------------------------------------------------------------
    // DRAG OVER LE TABLEAU (réordonnancement)
    // ----------------------------------------------------------------
    function handleDragOver(event) {
        event.preventDefault();
        const draggedRow = dropzone.querySelector('tr.ligne.dragging');
        if (!draggedRow) return;

        const overElement = event.target.closest('tr.ligne');
        if (overElement && overElement.parentNode === dropzone && overElement !== draggedRow) {
            const rect = overElement.getBoundingClientRect();
            const insertAfter = (event.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
            dropzone.insertBefore(draggedRow, insertAfter ? overElement.nextSibling : overElement);
        }
    }

    // ----------------------------------------------------------------
    // SUPPRESSION D'UNE LIGNE
    // ----------------------------------------------------------------
    window.supprimer = function (bouton) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette ligne ?')) {
            const ligneASupprimer = bouton.closest('tr');
            if (ligneASupprimer) {
                ligneASupprimer.remove();
                actugraph();
                setTimeout(() => {
                    if (window.refreshTableInsertionButtons) window.refreshTableInsertionButtons();
                }, 50);
            }
        }
    };

    dropzone.addEventListener('dragover', handleDragOver);
    dropzone.addEventListener('drop', () => {
        actugraph();
    });

    // Initialiser les boutons d'insertion
    setTimeout(() => {
        if (window.refreshTableInsertionButtons) window.refreshTableInsertionButtons();
    }, 500);

    // Exposition globale pour les autres modules
    window.creerContenuLigne = creerContenuLigne;
    window.handleDragStart2 = handleDragStart2;
    window.handleDragEnd2 = handleDragEnd2;
});