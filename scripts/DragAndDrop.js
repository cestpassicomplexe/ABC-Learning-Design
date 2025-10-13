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
    nom = this.id;
    const y = event.clientY;
    for (var k = 1; k < tableau.rows.length; k++) {
        // Pour vérifier su quelle ligne je suis j'utilise la position du pointeur.
        if (y <= tableau.rows[k].getBoundingClientRect().bottom && y >= tableau.rows[k].getBoundingClientRect().top) {
            ligneEnCours = k;
        }
    }

    // cardSuppressed=document.getElementById(nom);
    nouveauNom = nom.slice(4, 5);
    for (var i = 1; i < 7; i++) {
        nomNovice = 'card' + i + 'NoviceMoodleBackCliquable';
        nomExpert = 'card' + i + 'ExpertMoodleBackCliquable';
        carteNovice = document.getElementById(nomNovice);
        carteExpert = document.getElementById(nomExpert);
        // console.log(carte);
        // console.log(i.toString()==nouveauNom);
        if (i.toString() == nouveauNom) {
            if (choixTypeCarte == 'Novice') {
                carteNovice.classList.toggle('d-none');
            } else {
                carteExpert.classList.toggle('d-none');
            }
            // console.log(carte);
        } else {
            carteNovice.classList.add('d-none');
            carteExpert.classList.add('d-none');
        }
    }
}
// Fonction pour ajouter les outils en cliquant sur les boutons situé au verso des cartes.
function handleClickBtn() {
    // trouver le nb de cellule dans la ligne en cours
    nombreCellule = tableau.rows[ligneEnCours].cells.length;
    if (nombreCellule > 2) { //si le nb de cellule est plus grand que 2 il y a déjà un outil de déclaré
        for (var i = 7; i > 1; i--) {
            // console.log(tableau.rows[ligneEnCours].cells[i]);
            tableau.rows[ligneEnCours].cells[i].remove();
        }
    }
    // Insertion du nom de l'outils
    td = tableau.rows[ligneEnCours].insertCell();
    td.innerText = this.value;
    // Remarques
    td = tableau.rows[ligneEnCours].insertCell();
    td.className = 'col';
    input = document.createElement('textarea');
    input.className = 'form-control ligne';
    td.appendChild(input);
    // Durée
    td = tableau.rows[ligneEnCours].insertCell();
    td.className = 'col';
    input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('value', 0);
    input.setAttribute('min', 0);
    input.setAttribute('max', 100);
    input.setAttribute('onchange', 'actugraph();');
    td.appendChild(input);

    //Présentiel distanciel
    td = tableau.rows[ligneEnCours].insertCell();
    td.className = 'col';
    // Créer le select
    select = document.createElement('select');
    select.setAttribute('onchange', "actugraph();");
    var optionElement = document.createElement("option");
    // Définit le texte et la valeur de l'option
    optionElement.text = "Présentiel";
    optionElement.value = "Présentiel";
    // Ajoute l'option au select
    select.appendChild(optionElement);
    var optionElement = document.createElement("option");
    // Définit le texte et la valeur de l'option
    optionElement.text = "Distanciel";
    optionElement.value = "Distanciel";
    // Ajoute l'option au select
    select.appendChild(optionElement);
    td.appendChild(select);

    //Individuel Groupe
    td = tableau.rows[ligneEnCours].insertCell();
    td.className = 'col';
    // Créer le select
    select = document.createElement('select');
    select.setAttribute('onchange', "actugraph();");
    // Crée une nouvelle option
    var optionElement = document.createElement("option");
    // Définit le texte et la valeur de l'option
    optionElement.text = "Individuel";
    optionElement.value = "Individuel";
    // Ajoute l'option au select
    select.appendChild(optionElement);
    // Crée une nouvelle option
    var optionElement = document.createElement("option");
    // Définit le texte et la valeur de l'option
    optionElement.text = "Groupe";
    optionElement.value = "Groupe";
    // Ajoute l'option au select
    select.appendChild(optionElement);
    td.appendChild(select);

    //Matériel
    td = tableau.rows[ligneEnCours].insertCell();
    td.className = 'col';
    input = document.createElement('textarea');
    input.className = 'form-control ligne';
    td.appendChild(input);

    // Cache les cartes
    for (var i = 1; i < 7; i++) {
        document.getElementById('card' + i + choixTypeCarte + 'MoodleBackCliquable').classList.add('d-none');
    }
    actugraph();
}

function highlightDropzone() {
    dropzone.classList.add('active');
}
// Fonction pour gérer le glisser-déposer
function handleDragStart() {
}
// dragstart pour les éléments déjà dans le tableau
function handleDragStart2() {
    //repere ou est le curseur
    const x = event.clientX;
    const y = event.clientY;
    //tableau dans sa globalité
    var tableau = document.getElementById('tableau');
    //tablebody du tableau.
    var dropzone = document.getElementById('dropzone');
    tableauRect = tableau.getBoundingClientRect();
    rect = tableau.rows[1].cells[1].getBoundingClientRect();
    dropZoneRect = { 'left': rect.left, 'right': rect.right, 'top': rect.top, 'bottom': tableauRect.bottom }
    if (x >= dropZoneRect.left && x <= dropZoneRect.right && y >= dropZoneRect.top && y <= dropZoneRect.bottom) {
        for (var k = 1; k < tableau.rows.length; k++) {
            if (y <= tableau.rows[k].getBoundingClientRect().bottom && y >= tableau.rows[k].getBoundingClientRect().top) {
                // J'ajoute la classe dragging à la ligne contenant la carte que je déplace.
                // Comme ca je peux la retrouver dans handleDragEnd2
                tableau.rows[k].classList.add('dragging');
                // console.log(document.querySelector('.dragging'));
            }
        }
    }
}
// dragEnd pour glisser deposer les éléments dans la drop zone.
function handleDragEnd2() {
    // retrouve la ligne a déplacer
    ligne = document.querySelector('.dragging');
    ligne.classList.remove('dragging');
    //repere ou est le curseur
    const x = event.clientX;
    const y = event.clientY;
    //tableau dans sa globalité
    var tableau = document.getElementById('tableau');
    //tablebody du tableau.
    var dropzone = document.getElementById('dropzone');
    tableauRect = tableau.getBoundingClientRect();
    rect = tableau.rows[1].cells[1].getBoundingClientRect();
    dropZoneRect = { 'left': rect.left, 'right': rect.right, 'top': rect.top, 'bottom': tableauRect.bottom }
    //Si je suis dans la zone de drop
    if (x >= dropZoneRect.left && x <= dropZoneRect.right && y >= dropZoneRect.top && y <= dropZoneRect.bottom) {
        for (var k = 1; k < tableau.rows.length; k++) {
            // Pour vérifier sur quelle ligne je suis j'utilise la position du pointeur.
            if (y <= tableau.rows[k].getBoundingClientRect().bottom && y >= tableau.rows[k].getBoundingClientRect().top) {
                // Si je suis bien dans le tableau je suis sur une ligne et alors j'insère au dessus.
                tableau.rows[k].cells[1].classList.remove('active');
                dropzone.insertBefore(ligne, tableau.rows[k]);
                for (var i = 1; i < 7; i++) {
                    document.getElementById('card' + i + 'BackCliquable').classList.add('d-none');
                }
            }
        }
    }
}
// FOnction s'activant lorsqu'on lache la carte dans le tableau.
function handleDragEnd() {
    //clone le bouton en déplacement
    idClone = document.getElementById(this.id);
    btnClone = idClone.cloneNode(true);
    //Je récupere l'id du head de la carte à mettre dans la 1ere colonne du tableau
    idHead = this.id.slice(0, 5) + 'BackHead';
    // console.log(document.getElementById(idHead).childNodes);
    headClone = document.getElementById(idHead).childNodes[1];

    numeroCarte = this.id.slice(4, 5);

    // Vérification si la carte a été lâchée hors de la zone de dépôt
    // Emplacement du curseur
    const x = event.clientX;
    const y = event.clientY;
    //tableau dans sa globalité
    var tableau = document.getElementById('tableau');
    //tablebody du tableau.
    var dropzone = document.getElementById('dropzone');
    // récupere la taille du tableau pour fixer le bas.
    tableauRect = tableau.getBoundingClientRect();
    // La taille de la 1ere cellule de la 2eme ligne pour fixer le haut, la gauche et droite
    rect = tableau.rows[1].cells[1].getBoundingClientRect();
    // Tout est stocké dans une variable dropZoneRect
    dropZoneRect = { 'left': rect.left, 'right': rect.right, 'top': rect.top, 'bottom': tableauRect.bottom }
    // console.log(x,y,dropZoneRect);
    //si je suis dans la premiere colonne, qui est la zone de drop
    if (x >= dropZoneRect.left && x <= dropZoneRect.right && y >= dropZoneRect.top && y <= dropZoneRect.bottom) {
        // Je parcours les lignes pour savoir sur quelle ligne je suis pour insérer dessus.
        for (var k = 1; k < tableau.rows.length; k++) {
            // Pour vérifier su quelle ligne je suis j'utilise la position du pointeur.
            if (y <= tableau.rows[k].getBoundingClientRect().bottom && y >= tableau.rows[k].getBoundingClientRect().top) {
                // console.log(k);
                // Création de la ligne
                tr = document.createElement('tr');
                tr.className = 'ligne text-center';
                //Supprimer
                td = document.createElement('td');
                td.className = 'col text-center';
                button = document.createElement('button');
                button.className = 'btn';
                button.innerHTML = '<i class="fa-solid fa-trash" style="color: #ffffff;"></i>';
                button.setAttribute('onclick', 'supprimer();');
                td.appendChild(button);
                switch (this.id.slice(4, 5)) {
                    case "1": td.classList.add('card-acquisition'); break;
                    case "2": td.classList.add('card-collaboration'); break;
                    case "3": td.classList.add('card-discussion'); break;
                    case "4": td.classList.add('card-enquete'); break;
                    case "5": td.classList.add('card-pratique'); break;
                    case "6": td.classList.add('card-production'); break;
                }
                tr.appendChild(td);
                //Type de carte
                td = document.createElement('td');
                td.className = 'col text-center d-flex flex-row dropable surlignable';
                td.id = this.id.slice(0, 5) + new Date().getTime();
                switch (this.id.slice(4, 5)) {
                    case "1": td.classList.add('card-acquisition'); break;
                    case "2": td.classList.add('card-collaboration'); break;
                    case "3": td.classList.add('card-discussion'); break;
                    case "4": td.classList.add('card-enquete'); break;
                    case "5": td.classList.add('card-pratique'); break;
                    case "6": td.classList.add('card-production'); break;
                }
                td.appendChild(headClone.childNodes[1].cloneNode(true));
                titre = document.createElement('h6');
                titre.className = 'titre-carte w-75';
                titre.innerText = headClone.childNodes[3].innerText;
                td.appendChild(titre);
                td.setAttribute('draggable', true);
                td.addEventListener('click', handleClick);
                td.addEventListener('dragstart', handleDragStart2);
                td.addEventListener('dragend', handleDragEnd2);
                td.addEventListener('dragover', handleDragOver);
                td.addEventListener('dragleave', handleDragLeave);

                tr.appendChild(td);


                // Retirer le highlight signifiant ou est déposée la carte.
                tableau.rows[k].cells[1].classList.remove('active');
                dropzone.insertBefore(tr, tableau.rows[k]);
                // Cacher les Cartes
                for (var i = 1; i < 7; i++) {
                    document.getElementById('card' + i + 'BackCliquable').classList.add('d-none');
                }
                // document.getElementById('card'+numeroCarte+'BackCliquable').classList.remove('d-none');
            }
        }
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
    rect = tableau.rows[1].cells[1].getBoundingClientRect();
    const x = event.clientX;
    const y = event.clientY;
    // console.log(x,rect);
    if (x >= rect.left && x <= rect.right) {
        for (var k = 1; k < tableau.rows.length; k++) {
            // Pour vérifier su quelle ligne je suis j'utilise la position du pointeur.
            if (y <= tableau.rows[k].getBoundingClientRect().bottom && y >= tableau.rows[k].getBoundingClientRect().top) {
                event.preventDefault();
                tableau.rows[k].cells[1].classList.add('active');
            }
        }
    }
}
function handleDrop() {
    event.preventDefault();
}
function supprimer() {//supprime la ligne du tableau quand on click sur la croix
    // Je recherche la ligne
    const y = event.clientY;
    for (var k = 1; k < tableau.rows.length; k++) {
        if (y <= tableau.rows[k].getBoundingClientRect().bottom && y >= tableau.rows[k].getBoundingClientRect().top) {
            // La ligne est trouvée, je la supprime.
            tableau.rows[k].remove();
        }
    }
    for (var i = 1; i < 7; i++) {
        document.getElementById('card' + i + choixTypeCarte + 'MoodleBackCliquable').classList.add('d-none');
    }

    actugraph();

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
