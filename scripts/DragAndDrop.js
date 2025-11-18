// --- Initialisation des variables et des écouteurs d'événements ---

document.addEventListener('DOMContentLoaded', function () {

    // Sélection des éléments interactifs
    const cardsFront = document.querySelectorAll('.cardFront');
    const dropzone = document.getElementById('dropzone');

    // --- LOGIQUE HYBRIDE : GESTION PAR CLIC + GLISSER-DÉPOSER ---

    /**
     * Ajoute les écouteurs pour les DEUX méthodes (clic et drag) sur chaque carte "recto".
     */
    cardsFront.forEach(card => {
        // Pour la méthode par CLIC
        card.style.cursor = 'pointer'; 
        card.addEventListener('click', afficherVersoCarte);

        // Pour la méthode par GLISSER-DÉPOSER
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
    });

    /**
     * [MÉTHODE CLIC] Affiche la carte "verso" correspondante.
     */
    function afficherVersoCarte(event) {
        const cardIdNumber = this.id.match(/\d+/)[0]; 
        const choixTypeCarte = document.getElementById('switchNoviceExpert').checked ? 'Expert' : 'Novice';
        const targetCardBackId = `card${cardIdNumber}${choixTypeCarte}MoodleBackCliquable`;
        const targetCardBack = document.getElementById(targetCardBackId);

        document.querySelectorAll('.cardBackCliquable').forEach(card => card.classList.add('d-none'));

        if (targetCardBack) {
            targetCardBack.classList.remove('d-none');
            const boutonsOutils = targetCardBack.querySelectorAll('.btnCliquable');
            boutonsOutils.forEach(bouton => {
                bouton.removeEventListener('click', insererActiviteDansScenario); 
                bouton.addEventListener('click', insererActiviteDansScenario);
            });
        }
    }

    /**
     * [MÉTHODE CLIC] Crée et insère une nouvelle ligne dans le scénario.
     * *** CETTE FONCTION EST CORRIGÉE ***
     */
    function insererActiviteDansScenario(event) {
        const boutonClique = this;
        const nomOutil = boutonClique.value || boutonClique.textContent.trim();
        const parentCardBack = boutonClique.closest('.cardBackCliquable');
        const cardIdNumber = parentCardBack.id.match(/\d+/)[0];
        
        const dropzoneTbody = document.getElementById('dropzone');
        // On cible la dernière ligne, qui est la zone de dépôt
        const targetRow = dropzoneTbody.querySelector('tr:last-child');
        if (!targetRow) return; // Sécurité

        // On la vide pour la reconstruire
        while (targetRow.firstChild) {
            targetRow.removeChild(targetRow.firstChild);
        }
        
        // On la remplit avec le contenu de l'activité
        creerContenuLigne(targetRow, cardIdNumber, nomOutil);

        // ET ON AJOUTE UNE NOUVELLE ZONE DE DÉPÔT À LA FIN
        const nouvelleLigneVide = dropzoneTbody.insertRow();
        nouvelleLigneVide.style.height = '80px';
        nouvelleLigneVide.insertCell();
        const nouvelleDropzoneCell = nouvelleLigneVide.insertCell();
        nouvelleDropzoneCell.className = 'dropzone surlignable';
        for (let i = 0; i < 7; i++) { nouvelleLigneVide.insertCell(); }

        // On finalise
        parentCardBack.classList.add('d-none');
        actugraph();
    }

    // --- FONCTIONS POUR LE GLISSER-DÉPOSER (RESTaurées ET ADAPTÉES) ---
    
    function handleDragStart() {
      // Peut rester vide
    }

    function handleDragEnd() {
        const dropzoneTbody = document.getElementById('dropzone');
        const targetCell = dropzoneTbody.querySelector('.surlignable.active');
        if (!targetCell) { return; }

        const targetRow = targetCell.closest('tr');
        
        while (targetRow.firstChild) {
            targetRow.removeChild(targetRow.firstChild);
        }
        
        const cardIdNumber = this.id.match(/\d+/)[0];
        creerContenuLigne(targetRow, cardIdNumber, ""); // Outil vide au début

        const nouvelleLigneVide = dropzoneTbody.insertRow();
        nouvelleLigneVide.style.height = '80px';
        nouvelleLigneVide.insertCell();
        const nouvelleDropzoneCell = nouvelleLigneVide.insertCell();
        nouvelleDropzoneCell.className = 'dropzone surlignable';
        for (let i = 0; i < 7; i++) { nouvelleLigneVide.insertCell(); }
        
        targetCell.classList.remove('active');
        actugraph();

        const cellTypeApprentissage = targetRow.cells[1];
        if (cellTypeApprentissage) {
            cellTypeApprentissage.click();
        }
    }

    /**
     * Fonction centralisée pour créer le contenu d'une nouvelle ligne.
     */
    function creerContenuLigne(ligne, cardIdNumber, nomOutil) {
        ligne.className = 'ligne text-center';

        let cell1 = ligne.insertCell();
        cell1.innerHTML = `<div class="d-flex justify-content-around align-items-center">
                             <i class="fa-solid fa-grip-vertical" draggable="true" style="cursor: grab;"></i>
                             <button class="btn" onclick="supprimer(this);"><i class="fa-solid fa-trash"></i></button>
                           </div>`;
        cell1.querySelector('.fa-grip-vertical').addEventListener('dragstart', handleDragStart2);
        cell1.querySelector('.fa-grip-vertical').addEventListener('dragend', handleDragEnd2);

        const cardHeadId = `card${cardIdNumber}BackHead`;
        const headElement = document.getElementById(cardHeadId).querySelector('.col');
        let cell2 = ligne.insertCell();
        const image = headElement.querySelector('img').cloneNode(true);
        const titreText = headElement.querySelector('h3').textContent.trim();
        
        cell2.appendChild(image);
        cell2.innerHTML += `<h6 class='titre-carte'>${titreText}</h6>`;
        
        cell2.id = `card${cardIdNumber}-${new Date().getTime()}`;
        cell2.addEventListener('click', handleClick);

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
    }

    function getCardTypeName(number) {
        const types = { "1": 'acquisition', "2": 'collaboration', "3": 'discussion', "4": 'enquete', "5": 'pratique', "6": 'production' };
        return types[number] || '';
    }

    // --- CONSERVATION DE VOS FONCTIONS EXISTANTES ---

    var ligneEnCours; 

    function handleClick() {
        const clickedRow = this.closest('tr');
        ligneEnCours = clickedRow.rowIndex;
        const nom = this.id;
        const nouveauNom = nom.slice(4, 5);
        const choixTypeCarte = document.getElementById('switchNoviceExpert').checked ? 'Expert' : 'Novice';

        document.querySelectorAll('.cardBackCliquable').forEach(card => card.classList.add('d-none'));

        const carteAMontrerId = 'card' + nouveauNom + choixTypeCarte + 'MoodleBackCliquable';
        const carteAMontrer = document.getElementById(carteAMontrerId);
        if (carteAMontrer) {
            carteAMontrer.classList.remove('d-none');
            carteAMontrer.querySelectorAll('.btnCliquable').forEach(btn => {
                btn.removeEventListener('click', handleClickBtn);
                btn.addEventListener('click', handleClickBtn);
            });
        }
    }

    function handleClickBtn() {
        const targetRow = document.getElementById('tableau').rows[ligneEnCours];
        if (targetRow) {
            targetRow.cells[3].innerText = this.value || this.textContent.trim();
        }
        document.querySelectorAll('.cardBackCliquable').forEach(card => card.classList.add('d-none'));
        actugraph();
    }

    // --- Fonctions pour la réorganisation des lignes ---

    function handleDragStart2(event) {
        event.target.closest('tr').classList.add('dragging');
        event.dataTransfer.setData('text/plain', null);
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
            const overRow = event.target.closest('tr');
            dropzoneTbody.querySelectorAll('tr').forEach(row => row.classList.remove('drag-over-indicator'));
            if (overRow && overRow !== draggedRow) {
                overRow.classList.add('drag-over-indicator');
                const rect = overRow.getBoundingClientRect();
                const next = (event.clientY - rect.top) / (rect.bottom - rect.top) > 0.5;
                dropzoneTbody.insertBefore(draggedRow, next && overRow.nextSibling || overRow);
            }
        } else {
            dropzoneTbody.querySelectorAll('.surlignable').forEach(cell => cell.classList.remove('active'));
            const overCell = event.target.closest('td.surlignable');
            if (overCell) overCell.classList.add('active');
        }
    }
    
    function handleDragLeave() {
        document.querySelectorAll('.surlignable.active').forEach(cell => cell.classList.remove('active'));
    }

    window.supprimer = function(bouton) {
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
});