var data = {
    labels: ['Acquisition', 'Collaboration', 'Discussion', 'Enquête', 'Pratique', 'Production'],
    datasets: [{
        label: '',
        data: [0, 0, 0, 0, 0, 0],
        pointBackgroundColor: ['rgb(22,177,162)', 'rgb(243,146,0)', 'rgb(29,113,184)', 'rgb(190,22,34)', 'rgb(102,36,131)', 'rgb(58,170,53)'],
        borderColor: 'dark',
        backgroundColor: 'rgba(100,100,100,0.2)',
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
                    size: 12,
                },
                color: '#666',
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
if (typeof Chart === 'undefined') {
    console.error("Chart.js n'est pas chargé. Les graphiques ne fonctionneront pas.");
} else {
    window.graphique = new Chart(ctx, config);
}

var dataPresentielDistanciel = {
    labels: ['Présentiel', 'Distanciel'],
    datasets: [{
        label: '',
        data: [0, 0],
        pointBackgroundColor: ['#0d6efd', '#198754'],
        borderColor: 'dark',
        backgroundColor: ['#0d6efd', '#198754'],
        borderWidth: 1,
    }]
};
const ctxPresentielDistanciel = document.getElementById('graphPresentielDistanciel');
var optionPresentielDistanciel = {
    maintainAspectRatio: false,
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
if (typeof Chart !== 'undefined' && ctxPresentielDistanciel) {
    window.graphiquePresentielDistanciel = new Chart(ctxPresentielDistanciel, configPresentielDistanciel);
}

var dataIndividuelGroupe = {
    labels: ['Individuel', 'Groupe'],
    datasets: [{
        label: '',
        data: [0, 0],
        pointBackgroundColor: ['#0d6efd', '#198754'],
        borderColor: 'dark',
        backgroundColor: ['#0d6efd', '#198754'],
        borderWidth: 1,
    }]
};
const ctxIndividuelGroupe = document.getElementById('graphIndividuelGroupe');
var optionIndividuelGroupe = {
    maintainAspectRatio: false,
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
if (typeof Chart !== 'undefined' && ctxIndividuelGroupe) {
    window.graphiqueIndividuelGroupe = new Chart(ctxIndividuelGroupe, configIndividuelGroupe);
}

function actugraph() { //fonction pour actualiser le graph
    console.log("Appel de actugraph()...");
    const lignesDeDonnees = document.querySelectorAll('#dropzone tr.ligne');
    console.log("Nombre de lignes trouvées :", lignesDeDonnees.length);

    // S'il n'y a aucune ligne, on vide les données mais on ne touche pas au DOM ici
    // La visibilité globale est gérée par l'utilisateur via le bouton Replier/Déployer
    // On ne retourne plus s'il n'y a pas de lignes, pour pouvoir remettre à zéro les graphes
    const hasData = lignesDeDonnees.length > 0;

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

    lignesDeDonnees.forEach((row, index) => {
        const typeCell = row.cells[1];
        const dureeCell = row.cells[5];
        const modaliteCell = row.cells[6];

        if (!typeCell || !dureeCell || !modaliteCell) return;

        const duree = parseInt(dureeCell.querySelector('input')?.value) || 0;

        const typeApprentissageRaw = typeCell.querySelector('h6')?.textContent || "";
        const typeApprentissage = typeApprentissageRaw.trim();

        // Utilisation d'une comparaison insensible à la casse pour plus de robustesse
        const typeLower = typeApprentissage.toLowerCase();

        if (typeLower.includes('acquisition')) {
            tempsAcquisition += duree;
        } else if (typeLower.includes('collaboration')) {
            tempsCollaboration += duree;
        } else if (typeLower.includes('discussion')) {
            tempsDiscussion += duree;
        } else if (typeLower.includes('enquête') || typeLower.includes('enquete')) {
            tempsEnquete += duree;
        } else if (typeLower.includes('pratique')) {
            tempsPratique += duree;
        } else if (typeLower.includes('production')) {
            tempsProduction += duree;
        }

        const modaliteValue = modaliteCell.querySelector('select')?.value;
        if (!modaliteValue) return;

        console.log(`Ligne ${index}: Type=${typeApprentissage}, Durée=${duree}, Modalité=${modaliteValue}`);

        if (modaliteValue.includes('Présentiel')) {
            tempsPresentiel += duree;
        } else if (modaliteValue.includes('Distanciel')) {
            tempsDistanciel += duree;
        }

        if (modaliteValue.includes('En groupe')) {
            tempsGroupe += duree;
        } else if (modaliteValue.includes('Individuel') || modaliteValue.includes('Classe entière')) {
            tempsIndividuel += duree;
        }
    });

    console.log("Totaux calculés - Radar:", [tempsAcquisition, tempsCollaboration, tempsDiscussion, tempsEnquete, tempsPratique, tempsProduction]);
    console.log("Totaux calculés - Prés/Dist:", [tempsPresentiel, tempsDistanciel]);
    console.log("Totaux calculés - Ind/Grp:", [tempsIndividuel, tempsGroupe]);

    // Mise à jour sécurisée des graphiques
    try {
        if (window.graphique) {
            window.graphique.data.datasets[0].data = [tempsAcquisition, tempsCollaboration, tempsDiscussion, tempsEnquete, tempsPratique, tempsProduction];
            window.graphique.update();
        }
    } catch (e) { console.error("Erreur mise à jour Radar:", e); }

    try {
        if (window.graphiquePresentielDistanciel) {
            window.graphiquePresentielDistanciel.data.datasets[0].data = [tempsPresentiel, tempsDistanciel];
            window.graphiquePresentielDistanciel.update();
        }
    } catch (e) { console.error("Erreur mise à jour Prés/Dist:", e); }

    try {
        if (window.graphiqueIndividuelGroupe) {
            window.graphiqueIndividuelGroupe.data.datasets[0].data = [tempsIndividuel, tempsGroupe];
            window.graphiqueIndividuelGroupe.update();
        }
    } catch (e) { console.error("Erreur mise à jour Ind/Grp:", e); }

    // S'assurer que les canevas sont visibles si on a des données ou les masquer si vide (optionnel)
    const radarCanvas = document.getElementById('radar');
    const presentielCanvas = document.getElementById('graphPresentielDistanciel');
    const individuelCanvas = document.getElementById('graphIndividuelGroupe');

    if (hasData) {
        if (radarCanvas) radarCanvas.classList.remove('d-none');
        if (presentielCanvas) presentielCanvas.classList.remove('d-none');
        if (individuelCanvas) individuelCanvas.classList.remove('d-none');
    }
}
