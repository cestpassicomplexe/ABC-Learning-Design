// --- Initialisation des variables et des écouteurs d'événements ---

document.addEventListener('DOMContentLoaded', function () {

    const cardsFront = document.querySelectorAll('.cardFront');
    const dropzone = document.getElementById('dropzone');
    // Variable globale pour savoir quelle ligne est en cours de modification.
    let ligneEnCours = undefined;

    function nettoyerPlaceholdersInitiaux() {
        const ligneAccueil = document.getElementById('ligne-accueil');
        if (ligneAccueil) {
            ligneAccueil.remove();
        }
    }

    // --- LOGIQUE HYBRIDE : GESTION PAR CLIC + GLISSER-DÉPOSER ---

    cardsFront.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', afficherVersoCartePourAjout);
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });

    function afficherVersoCartePourAjout() {
        ligneEnCours = undefined;
        document.querySelectorAll('.ligne-en-modification').forEach(row => {
            row.classList.remove('ligne-en-modification');
        });
        const cardIdNumber = this.id.match(/\d+/)[0];
        afficherVersoCarte(cardIdNumber);
    }

    function afficherVersoCarte(cardIdNumber) {
        const targetCardBackId = `card${cardIdNumber}Back`;
        const targetCardBack = document.getElementById(targetCardBackId);

        document.querySelectorAll('.cardBackCliquable').forEach(card => card.classList.add('d-none'));

        if (targetCardBack) {
            targetCardBack.classList.remove('d-none');
            const boutons = targetCardBack.querySelectorAll('.btnCliquable');
            boutons.forEach(bouton => {
                bouton.onclick = gererSelectionOutil;
            });
        }
    }

    function gererSelectionOutil() {
        let nomOutil = this.value || this.textContent.trim();

        if (this.value === 'Autre') {
            const outilPersonnalise = prompt("Veuillez préciser le nom de l'outil ou de l'activité personnalisée :", "");
            if (!outilPersonnalise) { return; }
            nomOutil = outilPersonnalise;
        }

        const parentCardBack = this.closest('.cardBackCliquable');
        const dropzoneTbody = document.getElementById('dropzone');

        if (ligneEnCours !== undefined && document.getElementById('tableau').rows[ligneEnCours]) {
            // --- LOGIQUE DE MODIFICATION ---
            const targetRow = document.getElementById('tableau').rows[ligneEnCours];
            if (targetRow) {
                targetRow.cells[3].innerText = nomOutil;
            }
        } else {
            // --- LOGIQUE D'AJOUT ---
            nettoyerPlaceholdersInitiaux();

            const cardIdNumber = parentCardBack.id.match(/\d+/)[0];

            let nouvelleLigneContenu;
            const ligneVideExistante = dropzoneTbody.querySelector('.dropzone');

            if (ligneVideExistante) {
                nouvelleLigneContenu = ligneVideExistante.closest('tr');
            } else {
                nouvelleLigneContenu = dropzoneTbody.insertRow();
            }

            creerContenuLigne(nouvelleLigneContenu, cardIdNumber, nomOutil);
        }

        parentCardBack.classList.add('d-none');
        document.querySelectorAll('.ligne-en-modification').forEach(row => {
            row.classList.remove('ligne-en-modification');
        });

        if (!dropzoneTbody.querySelector('.dropzone')) {
            ajouterLigneVidePourDepot(dropzoneTbody);
        }

        actugraph();
    }

    // --- FONCTIONS POUR LE GLISSER-DÉPOSER ---

    function handleDragStart() { }

    function handleDragEnd() {
        const dropzoneTbody = document.getElementById('dropzone');
        const targetCell = dropzoneTbody.querySelector('.surlignable.active');
        if (!targetCell) { return; }

        nettoyerPlaceholdersInitiaux();

        const targetRow = targetCell.closest('tr');
        const cardIdNumber = this.id.match(/\d+/)[0];

        creerContenuLigne(targetRow, cardIdNumber, "");

        ajouterLigneVidePourDepot(dropzoneTbody);

        targetCell.classList.remove('active');
        actugraph();

        const cellTypeApprentissage = targetRow.cells[1];
        if (cellTypeApprentissage) {
            cellTypeApprentissage.click();
        }
    }

    function ajouterLigneVidePourDepot(tbody) {
        const nouvelleLigneVide = tbody.insertRow();
        nouvelleLigneVide.style.height = '80px';
        nouvelleLigneVide.insertCell();
        const nouvelleDropzoneCell = nouvelleLigneVide.insertCell();
        nouvelleDropzoneCell.className = 'dropzone surlignable';
        for (let i = 0; i < 7; i++) { nouvelleLigneVide.insertCell(); }
    }

    window.declencherModification = function (elementDeclencheur) {
        const ligneAModifier = elementDeclencheur.closest('tr');

        document.querySelectorAll('.ligne-en-modification').forEach(row => {
            row.classList.remove('ligne-en-modification');
        });

        ligneAModifier.classList.add('ligne-en-modification');
        ligneEnCours = ligneAModifier.rowIndex;

        const cellType = ligneAModifier.cells[1];
        const cardIdNumber = cellType.id.slice(4, 5);

        afficherVersoCarte(cardIdNumber);
    }

    function getCardTypeName(number) {
        const types = { "1": 'acquisition', "2": 'collaboration', "3": 'discussion', "4": 'enquete', "5": 'pratique', "6": 'production' };
        return types[number] || '';
    }

    /**
     * Fonction centralisée pour créer le contenu HTML d'une nouvelle ligne.
     * CORRECTION : Ajout des écouteurs 'focus' pour gérer la surbrillance bleue.
     */
    function creerContenuLigne(ligne, cardIdNumber, nomOutil) {
        ligne.className = 'ligne text-center';
        ligne.innerHTML = '';

        let cell1 = ligne.insertCell();
        cell1.innerHTML = `<div class="actions-container">
                             <i class="fa-solid fa-grip-vertical handle" draggable="true"></i>
                             <div class="icon-stack">
                               <button class="btn btn-icon" onclick="declencherModification(this);"><i class="fa-solid fa-pencil"></i></button>
                               <button class="btn btn-icon" onclick="supprimer(this);"><i class="fa-solid fa-trash"></i></button>
                             </div>
                           </div>`;

        const handle = cell1.querySelector('.handle');
        handle.addEventListener('dragstart', handleDragStart2);
        handle.addEventListener('dragend', handleDragEnd2);

        const cardHeadId = `card${cardIdNumber}BackHead`;
        const headElementContainer = document.getElementById(cardHeadId);
        let imageSrc = "", titreText = "Activité";

        if (headElementContainer) {
            const headElement = headElementContainer.querySelector('.col');
            const originalImg = headElement.querySelector('img');
            if (originalImg) imageSrc = originalImg.src;
            titreText = headElement.querySelector('h3').textContent.trim();
        }

        let cell2 = ligne.insertCell();
        if (imageSrc) {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.style.maxHeight = "50px";
            img.className = "img-fluid";
            cell2.appendChild(img);
        }
        cell2.innerHTML += `<h6 class='titre-carte'>${titreText}</h6>`;
        cell2.id = `card${cardIdNumber}-${new Date().getTime()}`;
        cell2.style.cursor = 'pointer';
        cell2.addEventListener('click', () => declencherModification(cell2));

        const cardColorClass = `card-${getCardTypeName(cardIdNumber)}`;
        cell1.classList.add(cardColorClass);
        cell2.classList.add(cardColorClass);

        ligne.insertCell().innerHTML = `<textarea class='form-control ligne' placeholder="L'apprenant sera capable de..."></textarea>`;
        ligne.insertCell().innerText = nomOutil;
        ligne.insertCell().innerHTML = `<textarea class='form-control ligne' placeholder="Instructions pour l'activité..."></textarea>`;
        ligne.insertCell().innerHTML = `<input type='number' class='form-control' value='10' min='0' onchange='actugraph();'>`;
        ligne.insertCell().innerHTML = `<select class='form-select' onchange="actugraph();"><option>Présentiel / Individuel</option><option>Présentiel / En groupe</option><option>Présentiel / Classe entière</option><option>Distanciel Synchrone / Individuel</option><option>Distanciel Synchrone / En groupe</option><option>Distanciel Synchrone / Classe entière</option><option>Distanciel Asynchrone / Individuel</option><option>Distanciel Asynchrone / En groupe</option></select>`;
        ligne.insertCell().innerHTML = `<select class='form-select' onchange="actugraph();"><option>Non évalué</option><option>Formatif (auto-corrigé)</option><option>Formatif (par les pairs)</option><option>Formatif (enseignant)</option><option>Sommative (notée)</option><option>Certificative</option></select>`;
        ligne.insertCell().innerHTML = `<textarea class='form-control ligne' placeholder="Lien, PDF, matériel..."></textarea>`;

        // --- CORRECTION VISUELLE ---
        // Ajout d'écouteurs sur tous les champs éditables pour déplacer la ligne bleue au focus
        const inputs = ligne.querySelectorAll('.form-control, .form-select');
        inputs.forEach(elm => {
            elm.addEventListener('focus', function () {
                // 1. Visuel : On enlève la surbrillance des autres lignes et on l'ajoute ici
                document.querySelectorAll('.ligne-en-modification').forEach(r => r.classList.remove('ligne-en-modification'));
                ligne.classList.add('ligne-en-modification');

                // 2. Logique : On sort du mode "modification de l'outil" (car l'utilisateur tape du texte)
                // On cache les cartes Verso pour éviter la confusion visuelle
                document.querySelectorAll('.cardBackCliquable').forEach(card => card.classList.add('d-none'));

                // On reset la variable pour éviter d'écraser l'outil de la ligne précédente si on clique sur une carte après
                ligneEnCours = undefined;
            });
        });
    }

    // --- Fonctions pour la réorganisation des lignes ---

    function handleDragStart2(event) {
        event.target.closest('tr').classList.add('dragging');
        event.dataTransfer.effectAllowed = 'move';
    }

    function handleDragEnd2(event) {
        const draggedRow = document.querySelector('.dragging');
        if (draggedRow) draggedRow.classList.remove('dragging');
        document.querySelectorAll('.drag-over-indicator').forEach(indicator => indicator.classList.remove('drag-over-indicator'));
    }

    function handleDragOver(event) {
        event.preventDefault();
        const dropzoneTbody = document.getElementById('dropzone');
        const draggedRow = dropzoneTbody.querySelector('.dragging');

        if (draggedRow) {
            const overElement = event.target.closest('tr');
            if (overElement && overElement.parentNode === dropzoneTbody) {
                dropzoneTbody.querySelectorAll('tr').forEach(row => row.classList.remove('drag-over-indicator'));

                if (overElement !== draggedRow) {
                    if (overElement.querySelector('.dropzone')) {
                        dropzoneTbody.insertBefore(draggedRow, overElement);
                        return;
                    }
                    const rect = overElement.getBoundingClientRect();
                    const next = (event.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
                    dropzoneTbody.insertBefore(draggedRow, next && overElement.nextSibling || overElement);
                }
            }
        } else {
            dropzoneTbody.querySelectorAll('.surlignable').forEach(cell => cell.classList.remove('active'));
            const overCell = event.target.closest('td.surlignable');
            if (overCell) overCell.classList.add('active');
        }
    }

    function handleDragLeave(event) {
        const overCell = event.target.closest('td.surlignable');
        if (overCell) {
            overCell.classList.remove('active');
        }
    }

    window.supprimer = function (bouton) {
        if (confirm("Êtes-vous sûr de vouloir supprimer cette ligne ?")) {
            const ligneASupprimer = bouton.closest('tr');
            if (ligneASupprimer) {
                ligneASupprimer.remove();
                actugraph();
            }
        }
    }

    dropzone.addEventListener('dragover', handleDragOver);
    dropzone.addEventListener('dragleave', handleDragLeave);

    // Expose functions globally for other modules (like generatorModal.js)
    window.creerContenuLigne = creerContenuLigne;
    window.ajouterLigneVidePourDepot = ajouterLigneVidePourDepot;
    window.handleDragStart2 = handleDragStart2;
    window.handleDragEnd2 = handleDragEnd2;
});