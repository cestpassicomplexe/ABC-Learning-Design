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
    radar.classList.remove('d-none');
    graphIndividuelGroupe.classList.remove('d-none');
    graphPresentielDistanciel.classList.remove('d-none');
    tempsAcquisition = 0;
    tempsCollaboration = 0;
    tempsDiscussion = 0;
    tempsEnquete = 0;
    tempsPratique = 0;
    tempsProduction = 0;
    tempsIndividuel = 0;
    tempsGroupe = 0;
    tempsPresentiel = 0;
    tempsDistanciel = 0;
    for (var k = 1; k < tableau.rows.length - 1; k++) {
        if (tableau.rows[k].cells.length > 2) { //si supp à 2 alors il y a une donnée de temps à prendre en compte
            // console.log(tableau.rows[k].cells[0].children);
            switch (tableau.rows[k].cells[1].children[1].innerText) {
                case 'Acquisition':
                    tempsAcquisition += parseInt(tableau.rows[k].cells[4].children[0].value);
                    break;
                case 'Collaboration':
                    tempsCollaboration += parseInt(tableau.rows[k].cells[4].children[0].value);
                    break;
                case 'Discussion':
                    tempsDiscussion += parseInt(tableau.rows[k].cells[4].children[0].value);
                    break;
                case 'Enquête':
                    tempsEnquete += parseInt(tableau.rows[k].cells[4].children[0].value);
                    break;
                case 'Pratique - Entrainement':
                    tempsPratique += parseInt(tableau.rows[k].cells[4].children[0].value);
                    break;
                case 'Production':
                    tempsProduction += parseInt(tableau.rows[k].cells[4].children[0].value);
                    break;
            }
            switch (tableau.rows[k].cells[5].children[0].value) {
                case 'Distanciel':
                    tempsDistanciel += parseInt(tableau.rows[k].cells[4].children[0].value);
                    break;
                case "Présentiel":
                    tempsPresentiel += parseInt(tableau.rows[k].cells[4].children[0].value);
                    break;
            }
            switch (tableau.rows[k].cells[6].children[0].value) {
                case 'Individuel':
                    tempsIndividuel += parseInt(tableau.rows[k].cells[4].children[0].value);
                    break;
                case "Groupe":
                    tempsGroupe += parseInt(tableau.rows[k].cells[4].children[0].value);
                    break;
            }
        }
    }
    // console.log([tempsAcquisition,tempsCollaboration,tempsDiscussion,tempsEnquete,tempsPratique,tempsProduction]);
    graphique.config.data.datasets[0].data = [tempsAcquisition, tempsCollaboration, tempsDiscussion, tempsEnquete, tempsPratique, tempsProduction];
    graphique.update();
    graphiquePresentielDistanciel.data.datasets[0].data = [tempsPresentiel, tempsDistanciel];
    graphiquePresentielDistanciel.update();
    graphiqueIndividuelGroupe.data.datasets[0].data = [tempsIndividuel, tempsGroupe];
    graphiqueIndividuelGroupe.update();
    if (tempsDistanciel == 0 && tempsPresentiel == 0) {
        graphPresentielDistanciel.classList.add('d-none');
        graphIndividuelGroupe.classList.add('d-none');
        radar.classList.add('d-none');
    }

}
