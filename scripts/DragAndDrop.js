// Récupération des éléments du DOM
const cardsFront = document.querySelectorAll('.cardFront');
// console.log(cardsFront);
const cardsBack = document.querySelectorAll('.cardBack');
// console.log(cardsBack);
const btnBackCliquable = document.querySelectorAll('.btnCliquable');
// console.log(cardsBackCliquable);
const dropzones = document.querySelectorAll('.dropzone');
// // console.log(dropZoneRect);
// Variable pour savoir sur quelle ligne je devrai inérer les outils numériques
var ligneEnCours;

//gere le double clic pour voir apparaitre le verso des cartes en haut.
//fonction qui au click dans la premiere case du tableau fait apparaitre le verso de la carte
function handleClick() {
    // --- DÉBUT DE LA MODIFICATION ---

    // Ancienne méthode (non fiable pour les clics simulés)
    /*
    const y = event.clientY;
    for (var k = 1; k < tableau.rows.length; k++) {
        // Pour vérifier su quelle ligne je suis j'utilise la position du pointeur.
        if (y <= tableau.rows[k].getBoundingClientRect().bottom && y >= tableau.rows[k].getBoundingClientRect().top) {
            ligneEnCours = k;
        }
    }
    */

    // Nouvelle méthode (fiable et plus simple)
    // 'this' est la cellule (<td>) qui a été cliquée.
    // 1. On trouve la ligne parente (<tr>) la plus proche.
    const clickedRow = this.closest('tr');
    
    // 2. On récupère son index dans le tableau. C'est notre nouvelle ligne de travail.
    // L'index d'une ligne dans le corps (tbody) est directement le 'k' que vous cherchiez.
    ligneEnCours = clickedRow.rowIndex;

    // --- FIN DE LA MODIFICATION ---

    nom = this.id;
    nouveauNom = nom.slice(4, 5);
    for (var i = 1; i < 7; i++) {
        nomNovice = 'card' + i + 'NoviceMoodleBackCliquable';
        nomExpert = 'card' + i + 'ExpertMoodleBackCliquable';
        carteNovice = document.getElementById(nomNovice);
        carteExpert = document.getElementById(nomExpert);

        if (i.toString() == nouveauNom) {
            if (choixTypeCarte == 'Novice') {
                carteNovice.classList.toggle('d-none');
            } else {
                carteExpert.classList.toggle('d-none');
            }
        } else {
            carteNovice.classList.add('d-none');
            carteExpert.classList.add('d-none');
        }
    }
}



/**
 * Gère le clic sur un bouton d'outil situé au verso d'une carte.
 * Cette fonction met à jour la cellule "Outil" de la ligne de scénario
 * actuellement sélectionnée ('ligneEnCours').
 */
function handleClickBtn() {
    // La variable 'ligneEnCours' est définie globalement lorsque l'utilisateur
    // clique sur une carte dans la première colonne du tableau.

    // 1. Récupérer la ligne cible dans le tableau
    const targetRow = tableau.rows[ligneEnCours];

    // 2. Vérification de sécurité : s'assurer que la ligne existe
    if (!targetRow) {
        console.error("Erreur : Impossible de trouver la ligne de destination (ligneEnCours: " + ligneEnCours + ").");
        return; // Arrête l'exécution pour éviter une erreur
    }

    // 3. Cibler la 4ème cellule (index 3), qui correspond à la colonne "Outil"
    const celluleOutil = targetRow.cells[3];

    // 4. Vérification de sécurité : s'assurer que la cellule "Outil" existe
    if (!celluleOutil) {
        console.error("Erreur : La structure de la ligne est incorrecte, la cellule 'Outil' est manquante.");
        return;
    }

    // 5. Mettre à jour le contenu de la cellule avec le nom de l'outil
    // On privilégie l'attribut 'value' du bouton, sinon on prend son texte.
    const nomOutil = this.value || this.textContent.trim();
    celluleOutil.innerText = nomOutil;

    // 6. Cacher toutes les cartes "verso" pour nettoyer l'interface
    for (var i = 1; i < 7; i++) {
        // On reconstruit l'ID de chaque carte à cacher
        const cardId = 'card' + i + choixTypeCarte + 'MoodleBackCliquable';
        const cardElement = document.getElementById(cardId);
        
        // On vérifie que l'élément existe avant de manipuler ses classes
        if (cardElement) {
            cardElement.classList.add('d-none');
        }
    }

    // 7. Mettre à jour les graphiques
    actugraph();
}
function highlightDropzone() {
    dropzone.classList.add('active');
}
// Fonction pour gérer le glisser-déposer
function handleDragStart() {
}
// dragstart pour les éléments déjà dans le tableau
function handleDragStart2(event) {
    // L'élément déplacé est l'icône (event.target)
    // On trouve sa ligne parente (tr) et on la marque
    event.target.closest('tr').classList.add('dragging');
    // On dit au navigateur quelles données on déplace (même si c'est factice)
    event.dataTransfer.setData('text/plain', null);
    event.dataTransfer.effectAllowed = 'move'; // Indique visuellement un déplacement
}


function handleDragEnd2(event) {
    // On retire la classe 'dragging' de la ligne qu'on déplaçait
    const draggedRow = document.querySelector('.dragging');
    if (draggedRow) {
        draggedRow.classList.remove('dragging');
    }

    // NOUVEAU : On s'assure de retirer tous les indicateurs d'insertion restants
    const indicators = document.querySelectorAll('.drag-over-indicator');
    indicators.forEach(indicator => {
        indicator.classList.remove('drag-over-indicator');
    });
}

/**
 * Gère le dépôt d'une carte dans le tableau.
 * Cette fonction transforme la ligne de dépôt cible en ligne de contenu
 * et ajoute une nouvelle ligne de dépôt vide à la fin.
 */
/**
 * Gère le dépôt d'une carte dans le tableau.
 * Cette fonction transforme la ligne de dépôt cible en ligne de contenu
 * et ajoute une nouvelle ligne de dépôt vide à la fin.
 */
function handleDragEnd() {
    const dropzoneTbody = document.getElementById('dropzone');
    const targetCell = dropzoneTbody.querySelector('.surlignable.active');
    if (!targetCell) { return; }

    const targetRow = targetCell.closest('tr');
    
    // On vide la ligne proprement
    while (targetRow.firstChild) {
        targetRow.removeChild(targetRow.firstChild);
    }
    
    targetRow.className = 'ligne text-center';

    const cardId = this.id;
    const headId = cardId.slice(0, 5) + 'BackHead';
    const headClone = document.getElementById(headId).childNodes[1];


    // --- Cellule 1: Poignée et Suppression ---
    let cell1 = targetRow.insertCell();
    
    let wrapper1 = document.createElement('div');
    wrapper1.className = 'd-flex justify-content-around align-items-center';
    
    // 3. On ajoute les éléments DANS le wrapper.
    let handle = document.createElement('i');
    handle.className = 'fa-solid fa-grip-vertical';
    handle.draggable = true;
    handle.style.userSelect = 'auto'; 
    handle.style.cursor = 'grab';
    handle.addEventListener('dragstart', handleDragStart2);
    handle.addEventListener('dragend', handleDragEnd2);
    wrapper1.appendChild(handle);
    
    let button = document.createElement('button');
    button.className = 'btn';
    button.innerHTML = '<i class="fa-solid fa-trash"></i>';
    button.setAttribute('onclick', 'supprimer(this);');
    wrapper1.appendChild(button);

    // 4. On ajoute le wrapper complet DANS la cellule.
    cell1.appendChild(wrapper1);

    // On ajoute la couleur de fond à la cellule, pas au wrapper.
    switch (cardId.slice(4, 5)) {
        case "1": cell1.classList.add('card-acquisition'); break;
        case "2": cell1.classList.add('card-collaboration'); break;
        case "3": cell1.classList.add('card-discussion'); break;
        case "4": cell1.classList.add('card-enquete'); break;
        case "5": cell1.classList.add('card-pratique'); break;
        case "6": cell1.classList.add('card-production'); break;
    }

    // --- Cellule 2: Type d'Apprentissage ---
    const cellTypeApprentissage = targetRow.insertCell();
    // Même principe ici.
    
    // 1. On crée le wrapper flex.
    let wrapper2 = document.createElement('div');
    wrapper2.className = 'd-flex flex-row'; // Les classes flex vont sur le div.

    // 2. On ajoute les éléments DANS le wrapper.
    wrapper2.appendChild(headClone.childNodes[1].cloneNode(true));
    let titre = document.createElement('h6');
    titre.className = 'titre-carte w-75';
    titre.innerText = headClone.childNodes[3].innerText;
    wrapper2.appendChild(titre);

    // 3. On ajoute le wrapper DANS la cellule.
    cellTypeApprentissage.appendChild(wrapper2);
    
    cellTypeApprentissage.id = cardId.slice(0, 5) + new Date().getTime();
    cellTypeApprentissage.addEventListener('click', handleClick); 
    switch (cardId.slice(4, 5)) {
        case "1": cellTypeApprentissage.classList.add('card-acquisition'); break;
        case "2": cellTypeApprentissage.classList.add('card-collaboration'); break;
        case "3": cellTypeApprentissage.classList.add('card-discussion'); break;
        case "4": cellTypeApprentissage.classList.add('card-enquete'); break;
        case "5": cellTypeApprentissage.classList.add('card-pratique'); break;
        case "6": cellTypeApprentissage.classList.add('card-production'); break;
    }
    
    // --- FIN DE LA CORRECTION MAJEURE ---


    // Le reste des cellules est inchangé et correct.
    targetRow.insertCell().innerHTML = "<textarea class='form-control ligne' placeholder=\"L'apprenant sera capable de...\"></textarea>";
    targetRow.insertCell().innerText = "";
    targetRow.insertCell().innerHTML = "<textarea class='form-control ligne' placeholder=\"Instructions pour l'activité...\"></textarea>";
    targetRow.insertCell().innerHTML = "<input type='number' class='form-control' value='10' min='0' onchange='actugraph();'>";
    targetRow.insertCell().innerHTML = `<select class='form-select' onchange="actugraph();"><option>Présentiel / Individuel</option><option>Présentiel / En groupe</option><option>Présentiel / Classe entière</option><option>Distanciel Synchrone / Individuel</option><option>Distanciel Synchrone / En groupe</option><option>Distanciel Synchrone / Classe entière</option><option>Distanciel Asynchrone / Individuel</option><option>Distanciel Asynchrone / En groupe</option></select>`;
    targetRow.insertCell().innerHTML = `<select class='form-select' onchange="actugraph();"><option>Non évalué</option><option>Formatif (auto-corrigé)</option><option>Formatif (par les pairs)</option><option>Formatif (enseignant)</option><option>Sommative (notée)</option><option>Certificative</option></select>`;
    targetRow.insertCell().innerHTML = "<textarea class='form-control ligne' placeholder=\"Lien, PDF, matériel...\"></textarea>";

    // --- Ajout de la nouvelle ligne vide ---
    const nouvelleLigneVide = dropzoneTbody.insertRow();
    nouvelleLigneVide.style.height = '50px';
    nouvelleLigneVide.insertCell();
    const nouvelleDropzoneCell = nouvelleLigneVide.insertCell();
    nouvelleDropzoneCell.className = 'dropzone surlignable';
    for (let i = 0; i < 7; i++) { nouvelleLigneVide.insertCell(); }
    
    targetCell.classList.remove('active');
    cellTypeApprentissage.click();
}

// Recommandation : Je vois `onclick='confirmerSuppression(this);'`. Il serait plus propre 
// de remplacer la fonction `supprimer` par `confirmerSuppression` pour éviter la confusion.
function confirmerSuppression(bouton) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette ligne ?")) {
        const ligneASupprimer = bouton.closest('tr');
        if (ligneASupprimer) {
            ligneASupprimer.remove();
        }
        actugraph();
    }
}

function handleDragEnter(event) {
    event.preventDefault();
}
function handleDragLeave() {
    for (var i = 0; i < tableau.rows.length; i++) {
        tableau.rows[i].cells[1].classList.remove('active');
    }
}

function handleDragOver(event) {
    event.preventDefault(); 

    const dropzoneTbody = document.getElementById('dropzone');
    const draggedRow = dropzoneTbody.querySelector('.dragging');

    // --- CAS N°1 : On est en train de réorganiser une ligne existante ---
    if (draggedRow) {
        // On cherche la ligne survolée
        const overRow = event.target.closest('tr');

        // NOUVEAU : On nettoie d'abord tous les indicateurs précédents
        dropzoneTbody.querySelectorAll('tr').forEach(row => {
            row.classList.remove('drag-over-indicator');
        });
        
        // Si on survole une autre ligne (et pas celle qu'on déplace), on la déplace ET on affiche l'indicateur
        if (overRow && overRow !== draggedRow) {
            // NOUVEAU : On ajoute l'indicateur sur la ligne qui va être "poussée"
            overRow.classList.add('drag-over-indicator');
            
            // On déplace l'élément comme avant
            dropzoneTbody.insertBefore(draggedRow, overRow);
        }
    } 
    // --- CAS N°2 : On est en train de déposer une nouvelle carte ---
    else {
        // Cette partie ne change pas
        dropzoneTbody.querySelectorAll('.surlignable').forEach(cell => {
            cell.classList.remove('active');
        });
        const overCell = event.target.closest('td.surlignable');
        if (overCell) {
            overCell.classList.add('active');
        }
    }
}

function handleDrop() {
    event.preventDefault();
}

/**
 * Demande une confirmation à l'utilisateur avant de supprimer une ligne.
 * @param {HTMLElement} bouton - Le bouton de suppression qui a été cliqué.
 */
function supprimer(bouton) {
    // Affiche une boîte de dialogue standard du navigateur
    if (confirm("Êtes-vous sûr de vouloir supprimer cette ligne ?")) {
        // Si l'utilisateur clique sur "OK" :
        // 1. On trouve l'élément <tr> le plus proche du bouton
        const ligneASupprimer = bouton.closest('tr');
        
        // 2. On le supprime du DOM
        if (ligneASupprimer) {
            ligneASupprimer.remove();
        }
        
        // 3. On met à jour les graphiques
        actugraph();
    }
    // Si l'utilisateur clique sur "Annuler", rien ne se passe.
}

cardsFront.forEach(card => {
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
});
btnBackCliquable.forEach(btn => {
    btn.addEventListener('click', handleClickBtn);
});


dropzone.addEventListener('dragover', handleDragOver);
dropzone.addEventListener('dragleave', handleDragLeave);
