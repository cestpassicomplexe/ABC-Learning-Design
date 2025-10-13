console.log("Sur un coup de folie d'Allan Skorupa alors membre de la DRANE qui voulait rendre interactif ce jeu de cartes.")
tempsPresentiel = 0;
tempsDistanciel = 0;
switchNoviceExpert = document.getElementById('switchNoviceExpert');
choixTypeCarte = 'Novice';
switchNoviceExpert.addEventListener('change', handleChange);
var body = document.getElementsByTagName("body")[0];
// console.log(body);
function handleChange() {
  // Si on choisit Expert
  if (this.checked == true) {
    choixTypeCarte = 'Expert';
    choixNovice.classList.remove('fw-bold');
    choixNovice.classList.remove('text-primary');
    choixExpert.classList.add('fw-bold');
    choixExpert.classList.add('text-danger');
    body.style.backgroundColor = 'rgba(240,240,240,1)';
  } else {//Sinon si on choisit novice
    choixTypeCarte = 'Novice';
    choixExpert.classList.remove('fw-bold');
    choixExpert.classList.remove('text-danger');
    choixNovice.classList.add('fw-bold');
    choixNovice.classList.add('text-primary');
    body.style.backgroundColor = 'rgba(255,255,255,1)';

  }
  // On cache toutes les cartes potentiellement ouvertes
  for (var i = 1; i < 7; i++) {
    nomNovice = 'card' + i + 'NoviceMoodleBackCliquable';
    nomExpert = 'card' + i + 'ExpertMoodleBackCliquable';
    carteNovice = document.getElementById(nomNovice);
    carteExpert = document.getElementById(nomExpert);
    carteNovice.classList.add("d-none");
    carteExpert.classList.add("d-none");
  }
  // Suppression des lignes du tableau.
  nombreLigne = tableau.rows.length - 1;
  //Je supprime toujours en commencant par la première ligne.
  for (var k = 1; k < nombreLigne; k++) {
    tableau.rows[1].remove();
  }
  //Réinitialisation des valeurs utiles dans actu graph
  graphPresentielDistanciel.classList.add('d-none');
  graphIndividuelGroupe.classList.add('d-none');
  radar.classList.add('d-none');
}