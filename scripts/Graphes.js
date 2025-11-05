var data = {
    labels: ['Acquisition', 'Collaboration', 'Discussion', 'Enquête', 'Pratique - Entrainement', 'Production'],
    datasets: [{
        label: '',
        data: [],
        pointBackgroundColor: ['rgb(22,177,162)', 'rgb(243,146,0)', 'rgb(29,113,184)', 'rgb(190,22,34)', 'rgb(102,36,131)', 'rgb(58,170,53'],
        borderColor: 'dark',
        backgroundColor: 'rgba(100,100,100,0.2)',
        // tension : 1,
        borderWidth: 1,
    }]
};
const ctx = document.getElementById('radar');
var option = {
    maintainAspectRatio: false,
    scales: {
        r: {
            suggestedMin: 0,
            pointLabels: {
                font: {
                    size: 16,
                },
                color: ['rgb(22,177,162)', 'rgb(243,146,0)', 'rgb(29,113,184)', 'rgb(190,22,34)', 'rgb(102,36,131)', 'rgb(58,170,53)'],
            },
            ticks: {
                beginAtZero: true
            }
        }
    },
    plugins: {
        legend: false,
        title: {
            display: false,
            title: 'Répartition'
        }
    },
    elements: {
        line: {
            borderWidth: 3
        }
    },
};
var config = {
    type: 'radar', data: data, options: option
};
var graphique = new Chart(ctx, config);

var dataPresentielDistanciel = {
    labels: ['Présentiel', 'Distanciel'],
    datasets: [{
        label: '',
        data: [],
        pointBackgroundColor: ['red', 'green'],
        borderColor: 'dark',
        backgroundColor: ['red', 'green'],
        // tension : 1,
        borderWidth: 1,
    }]
};
const ctxPresentielDistanciel = document.getElementById('graphPresentielDistanciel');
var optionPresentielDistanciel = {
    maintainAspectRatio: true,
    plugins: {
        legend: false,
        title: {
            display: false,
            title: 'Répartition'
        }
    },
    elements: {
        line: {
            borderWidth: 3
        }
    },
};
var configPresentielDistanciel = {
    type: 'bar', data: dataPresentielDistanciel, options: optionPresentielDistanciel
};
var graphiquePresentielDistanciel = new Chart(ctxPresentielDistanciel, configPresentielDistanciel);

var dataIndividuelGroupe = {
    labels: ['Individuel', 'Groupe'],
    datasets: [{
        label: '',
        data: [],
        pointBackgroundColor: ['red', 'green'],
        borderColor: 'dark',
        backgroundColor: ['red', 'green'],
        // tension : 1,
        borderWidth: 1,
    }]
};
const ctxIndividuelGroupe = document.getElementById('graphIndividuelGroupe');
var optionIndividuelGroupe = {
    maintainAspectRatio: true,
    plugins: {
        legend: false,
        title: {
            display: true,
            title: 'Répartition'
        }
    },
    elements: {
        line: {
            borderWidth: 3
        }
    },
};
var configIndividuelGroupe = {
    type: 'bar', data: dataIndividuelGroupe, options: optionIndividuelGroupe
};
var graphiqueIndividuelGroupe = new Chart(ctxIndividuelGroupe, configIndividuelGroupe);

function actugraph() { //fonction pour actualiser le graph
    // On vérifie s'il y a des lignes de contenu dans le tableau
    const lignesDeDonnees = document.querySelectorAll('#dropzone tr.ligne');
    
    // S'il n'y a aucune ligne, on cache les graphes et on arrête tout.
    if (lignesDeDonnees.length === 0) {
        radar.classList.add('d-none');
        graphIndividuelGroupe.classList.add('d-none');
        graphPresentielDistanciel.classList.add('d-none');
        return; // Stoppe la fonction ici
    }

    // Si on a des données, on affiche les graphes
    radar.classList.remove('d-none');
    graphIndividuelGroupe.classList.remove('d-none');
    graphPresentielDistanciel.classList.remove('d-none');

    // Réinitialisation des compteurs
    let tempsAcquisition = 0;
    let tempsCollaboration = 0;
    let tempsDiscussion = 0;
    let tempsEnquete = 0;
    let tempsPratique = 0;
    let tempsProduction = 0;
    let tempsIndividuel = 0;
    let tempsGroupe = 0;
    let tempsPresentiel = 0;
    let tempsDistanciel = 0;

    // On boucle sur chaque ligne de données (on ignore l'en-tête et la ligne de drop vide)
    lignesDeDonnees.forEach(row => {
        
        // Récupération sécurisée des éléments dans la ligne
        const typeCell = row.cells[1]; // 2ème cellule
        const dureeCell = row.cells[5]; // 6ème cellule
        const modaliteCell = row.cells[6]; // 7ème cellule

        // On s'assure que les cellules existent pour éviter les erreurs
        if (!typeCell || !dureeCell || !modaliteCell) return;

        // Récupération de la durée (avec une valeur par défaut de 0 si l'input est vide ou invalide)
        const duree = parseInt(dureeCell.querySelector('input')?.value) || 0;

        // --- Graphique Radar : Type d'apprentissage ---
        const typeApprentissage = typeCell.querySelector('h6')?.innerText;
        switch (typeApprentissage) {
            case 'Acquisition':             tempsAcquisition += duree; break;
            case 'Collaboration':           tempsCollaboration += duree; break;
            case 'Discussion':              tempsDiscussion += duree; break;
            case 'Enquête':                 tempsEnquete += duree; break;
            case 'Pratique - Entrainement': tempsPratique += duree; break;
            case 'Production':              tempsProduction += duree; break;
        }

        // --- Graphes à barres : Modalité ---
        const modaliteValue = modaliteCell.querySelector('select')?.value;
        if (!modaliteValue) return;

        // On vérifie la présence de mots-clés dans la valeur du select
        if (modaliteValue.includes('Présentiel')) {
            tempsPresentiel += duree;
        } else if (modaliteValue.includes('Distanciel')) {
            tempsDistanciel += duree;
        }

        if (modaliteValue.includes('En groupe')) {
            tempsGroupe += duree;
        } else if (modaliteValue.includes('Individuel') || modaliteValue.includes('Classe entière')) {
            // On considère "Classe entière" comme de l'individuel pour ce graphe
            tempsIndividuel += duree;
        }
    });

    // Mise à jour du graphique Radar
    graphique.config.data.datasets[0].data = [tempsAcquisition, tempsCollaboration, tempsDiscussion, tempsEnquete, tempsPratique, tempsProduction];
    graphique.update();

    // Mise à jour du graphique Présentiel/Distanciel
    graphiquePresentielDistanciel.data.datasets[0].data = [tempsPresentiel, tempsDistanciel];
    graphiquePresentielDistanciel.update();

    // Mise à jour du graphique Individuel/Groupe
    graphiqueIndividuelGroupe.data.datasets[0].data = [tempsIndividuel, tempsGroupe];
    graphiqueIndividuelGroupe.update();
}
