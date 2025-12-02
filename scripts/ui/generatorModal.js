/**
 * Modal de génération de séquences pédagogiques
 * Interface utilisateur pour paramétrer et lancer la génération IA
 */
class GeneratorModal {
  constructor() {
    this.modal = null;
    this.generator = sequenceGenerator;
    this.currentSequence = null;
    this.init();
  }

  /**
   * Initialiser le modal
   */
  init() {
    this.createModal();
    this.attachEventListeners();
  }

  /**
   * Créer le HTML du modal
   */
  createModal() {
    const modalHTML = `
      <div class="modal fade" id="generatorModal" tabindex="-1" aria-labelledby="generatorModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header bg-success text-white">
              <h5 class="modal-title" id="generatorModalLabel">
                <i class="fa-solid fa-wand-magic-sparkles me-2"></i>Générer une Séquence Pédagogique
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <!-- Formulaire de génération -->
              <form id="generatorForm">
                <!-- Objectifs d'apprentissage -->
                <div class="mb-4">
                  <label for="objectifs" class="form-label fw-bold">
                    <i class="fa-solid fa-bullseye me-2"></i>Objectifs d'apprentissage <span class="text-danger">*</span>
                  </label>
                  <textarea class="form-control" id="objectifs" rows="3" 
                            placeholder="Ex: À la fin de cette séquence, les apprenants seront capables de...&#10;- Expliquer les principes de base de...&#10;- Créer un projet simple en utilisant...&#10;- Analyser et comparer différentes approches..."
                            required></textarea>
                  <div class="form-text">
                    Décrivez clairement ce que les apprenants doivent être capables de faire
                  </div>

                </div>

                <div class="row">
                  <!-- Niveau -->
                  <div class="col-md-6 mb-3">
                    <label for="niveau" class="form-label fw-bold">
                      <i class="fa-solid fa-graduation-cap me-2"></i>Niveau du public
                    </label>
                    <select class="form-select" id="niveau">
                      <option value="Débutant">Débutant (Aucune connaissance préalable)</option>
                      <option value="Intermédiaire" selected>Intermédiaire (Bases acquises)</option>
                      <option value="Avancé">Avancé (Bonne maîtrise)</option>
                      <option value="Expert">Expert (Maîtrise complète)</option>
                    </select>
                    <div class="form-text">Niveau de connaissance du sujet par les apprenants</div>
                  </div>

                  <!-- Durée -->
                  <div class="col-md-6 mb-3">
                    <label for="duree" class="form-label fw-bold">
                      <i class="fa-solid fa-clock me-2"></i>Durée totale (minutes) <span class="text-danger">*</span>
                    </label>
                    <input type="number" class="form-control" id="duree" min="15" max="600" value="90" required>
                    <div class="form-text">Entre 15 et 600 minutes</div>
                  </div>
                </div>

                <!-- Domaine -->
                <div class="mb-3">
                  <label for="domaine" class="form-label fw-bold">
                    <i class="fa-solid fa-book me-2"></i>Domaine / Discipline
                  </label>
                  <input type="text" class="form-control" id="domaine" 
                         placeholder="Ex: Informatique, Mathématiques, Langues, Sciences...">
                </div>

                <!-- Modalités -->
                <div class="mb-3">
                  <label class="form-label fw-bold">
                    <i class="fa-solid fa-chalkboard-user me-2"></i>Modalités d'enseignement
                  </label>
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="modalitePresentiel" value="Présentiel" checked>
                        <label class="form-check-label" for="modalitePresentiel">
                          ✓ Présentiel
                        </label>
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" id="modaliteDistanciel" value="Distanciel" checked>
                        <label class="form-check-label" for="modaliteDistanciel">
                          ✓ Distanciel
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="form-text">Sélectionnez une ou plusieurs modalités (Présentiel et/ou Distanciel)</div>
                </div>

                <!-- Contraintes -->
                <div class="mb-3">
                  <label for="contraintes" class="form-label fw-bold">
                    <i class="fa-solid fa-triangle-exclamation me-2"></i>Contraintes spécifiques (optionnel)
                  </label>
                  <textarea class="form-control" id="contraintes" rows="2"
                            placeholder="Ex: Pas d'accès à internet, groupe de 30 personnes, matériel limité..."></textarea>
                </div>

                <!-- Bouton générer -->
                <div class="d-grid">
                  <button type="submit" class="btn btn-success btn-lg" id="generateBtn">
                    <i class="fa-solid fa-wand-magic-sparkles me-2"></i>Générer la séquence
                  </button>
                </div>
              </form>

              <!-- Zone de résultats (cachée par défaut) -->
              <div id="resultsArea" class="mt-4 d-none">
                <hr>
                <h5 class="text-success">
                  <i class="fa-solid fa-check-circle me-2"></i>Séquence générée avec succès !
                </h5>
                
                <!-- Statistiques -->
                <div class="row mt-3">
                  <div class="col-md-4">
                    <div class="card text-center">
                      <div class="card-body">
                        <h3 id="nbActivites" class="text-primary">0</h3>
                        <p class="mb-0">Activités</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="card text-center">
                      <div class="card-body">
                        <h3 id="dureeTotal" class="text-success">0</h3>
                        <p class="mb-0">Minutes</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="card text-center">
                      <div class="card-body">
                        <h3 id="scoreEquilibre" class="text-warning">0</h3>
                        <p class="mb-0">Score équilibre</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Aperçu de la séquence -->
                <div class="mt-3">
                  <h6>Aperçu de la séquence :</h6>
                  <div id="sequencePreview" class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                    <!-- Tableau généré dynamiquement -->
                  </div>
                </div>

                <!-- Recommandations -->
                <div id="recommendationsArea" class="alert alert-info mt-3">
                  <strong><i class="fa-solid fa-lightbulb me-2"></i>Recommandations :</strong>
                  <p id="recommendationsText" class="mb-0 mt-2"></p>
                </div>

                <!-- Actions -->
                <div class="d-flex gap-2 mt-3">
                  <button type="button" class="btn btn-primary" id="addToScenarioBtn">
                    <i class="fa-solid fa-plus me-2"></i>Ajouter au scénario
                  </button>
                  <button type="button" class="btn btn-outline-secondary" id="regenerateBtn">
                    <i class="fa-solid fa-rotate me-2"></i>Régénérer
                  </button>
                  <button type="button" class="btn btn-outline-info" id="exportSequenceBtn">
                    <i class="fa-solid fa-download me-2"></i>Exporter
                  </button>
                </div>
              </div>

              <!-- Zone de chargement -->
              <div id="loadingArea" class="text-center py-5 d-none">
                <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;">
                  <span class="visually-hidden">Génération en cours...</span>
                </div>
                <p class="mt-3 text-muted">
                  <i class="fa-solid fa-robot me-2"></i>L'IA génère votre séquence pédagogique...
                  <br><small>Cela peut prendre quelques secondes</small>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = new bootstrap.Modal(document.getElementById('generatorModal'));
  }

  /**
   * Attacher les event listeners
   */
  attachEventListeners() {
    // Soumission du formulaire
    document.getElementById('generatorForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleGenerate();
    });



    // Ajouter au scénario
    document.getElementById('addToScenarioBtn')?.addEventListener('click', () => {
      this.handleAddToScenario();
    });

    // Régénérer
    document.getElementById('regenerateBtn')?.addEventListener('click', () => {
      this.handleGenerate();
    });

    // Exporter
    document.getElementById('exportSequenceBtn')?.addEventListener('click', () => {
      this.handleExport();
    });
  }

  /**
   * Gérer la génération
   */
  async handleGenerate() {
    try {
      // Récupérer les paramètres du formulaire
      const params = this.getFormParams();

      // Afficher le chargement
      this.showLoading();

      // Générer la séquence
      const sequence = await this.generator.generateSequence(params);
      this.currentSequence = sequence;

      // Mettre à jour les informations de séquence si elles sont vides
      if (typeof sequenceInfo !== 'undefined' && sequenceInfo) {
        const currentInfo = sequenceInfo.getData();

        // Mettre à jour seulement si les champs sont vides
        if (!currentInfo.objectives && params.objectifs) {
          document.getElementById('sequence-objectives').value = params.objectifs;
        }
        if (!currentInfo.level && params.niveau) {
          document.getElementById('sequence-level').value = params.niveau;
        }

        // Sauvegarder les changements
        sequenceInfo.save();
      }

      // Afficher les résultats
      this.displayResults(sequence);
    } catch (error) {
      this.hideLoading();
      alert('Erreur lors de la génération : ' + error.message);
    }
  }

  /**
   * Récupérer les paramètres du formulaire
   */
  getFormParams() {
    const modalites = [];
    if (document.getElementById('modalitePresentiel').checked) modalites.push('Présentiel');
    if (document.getElementById('modaliteDistanciel').checked) modalites.push('Distanciel');

    return {
      objectifs: document.getElementById('objectifs').value,
      niveau: document.getElementById('niveau').value,
      duree: parseInt(document.getElementById('duree').value),
      domaine: document.getElementById('domaine').value,
      modalites: modalites.join(', ') || 'Mixte',
      contraintes: document.getElementById('contraintes').value
    };
  }

  /**
   * Afficher le chargement
   */
  showLoading() {
    document.getElementById('resultsArea').classList.add('d-none');
    document.getElementById('loadingArea').classList.remove('d-none');
    document.getElementById('generateBtn').disabled = true;
  }

  /**
   * Masquer le chargement
   */
  hideLoading() {
    document.getElementById('loadingArea').classList.add('d-none');
    document.getElementById('generateBtn').disabled = false;
  }

  /**
   * Afficher les résultats
   */
  displayResults(sequence) {
    this.hideLoading();
    document.getElementById('resultsArea').classList.remove('d-none');

    // Statistiques
    document.getElementById('nbActivites').textContent = sequence.activites.length;
    const dureeTotal = sequence.activites.reduce((sum, act) => sum + (act.duree || 0), 0);
    document.getElementById('dureeTotal').textContent = dureeTotal;

    const distribution = this.generator.calculateDistribution(sequence.activites);
    const score = this.generator.calculateBalanceScore(distribution);
    document.getElementById('scoreEquilibre').textContent = score + '/100';

    // Aperçu de la séquence
    this.displaySequencePreview(sequence.activites);

    // Recommandations
    document.getElementById('recommendationsText').textContent =
      sequence.recommandations || 'Aucune recommandation spécifique.';

    // Scroll vers les résultats
    document.getElementById('resultsArea').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Afficher l'aperçu de la séquence
   */
  displaySequencePreview(activites) {
    const tableHTML = `
      <table class="table table-sm table-hover">
        <thead class="table-light">
          <tr>
            <th style="width: 5%">#</th>
            <th style="width: 15%">Type</th>
            <th style="width: 30%">Objectif</th>
            <th style="width: 15%">Outil</th>
            <th style="width: 10%">Durée</th>
            <th style="width: 15%">Organisation</th>
            <th style="width: 10%">Évaluation</th>
          </tr>
        </thead>
        <tbody>
          ${activites.map((act, index) => `
            <tr>
              <td>${index + 1}</td>
              <td><span class="badge bg-${this.getTypeBadgeColor(act.type)}">${act.type}</span></td>
              <td>${act.objectif}</td>
              <td>${act.outil}</td>
              <td>${act.duree} min</td>
              <td>${act.organisation || 'N/A'}</td>
              <td>${act.evaluation || 'Aucune'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    document.getElementById('sequencePreview').innerHTML = tableHTML;
  }

  /**
   * Obtenir la couleur du badge selon le type
   */
  getTypeBadgeColor(type) {
    const colors = {
      'Acquisition': 'primary',
      'Enquête': 'info',
      'Discussion': 'warning',
      'Collaboration': 'success',
      'Pratique': 'danger',
      'Production': 'dark'
    };
    return colors[type] || 'secondary';
  }



  /**
 * Ajouter la séquence au scénario
 */
  handleAddToScenario() {
    if (!this.currentSequence || !this.currentSequence.activites) return;

    try {
      // Nettoyer les placeholders initiaux
      const ligneAccueil = document.getElementById('ligne-accueil');
      if (ligneAccueil) {
        ligneAccueil.remove();
      }

      const dropzoneTbody = document.getElementById('dropzone');
      if (!dropzoneTbody) {
        alert('Erreur : Zone de dépôt introuvable');
        return;
      }

      // Mapper les types ABC LD vers les numéros de cartes
      const typeToCardNumber = {
        'Acquisition': '1',
        'Collaboration': '2',
        'Discussion': '3',
        'Enquête': '4',
        'Pratique': '5',
        'Production': '6'
      };

      // Ajouter chaque activité au scénario
      this.currentSequence.activites.forEach((activite, index) => {
        const cardNumber = typeToCardNumber[activite.type];
        if (!cardNumber) {
          console.warn(`Type inconnu : ${activite.type}`);
          return;
        }

        // Trouver ou créer une ligne vide
        let nouvelleLigne;
        const ligneVideExistante = dropzoneTbody.querySelector('.dropzone');

        if (ligneVideExistante) {
          nouvelleLigne = ligneVideExistante.closest('tr');
        } else {
          nouvelleLigne = dropzoneTbody.insertRow();
        }

        // Créer le contenu de la ligne
        this.creerLigneFromActivite(nouvelleLigne, cardNumber, activite);

        // Ajouter une ligne vide pour la prochaine activité
        if (index < this.currentSequence.activites.length - 1) {
          this.ajouterLigneVidePourDepot(dropzoneTbody);
        }
      });

      // Ajouter une dernière ligne vide
      this.ajouterLigneVidePourDepot(dropzoneTbody);

      // Mettre à jour les graphiques
      if (typeof actugraph === 'function') {
        actugraph();
      }

      // Afficher un message de succès
      alert(`✅ ${this.currentSequence.activites.length} activité(s) ajoutée(s) au scénario avec succès !`);

      // Fermer le modal
      this.modal.hide();

      // Scroll vers le tableau
      document.getElementById('tableau')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout au scénario:', error);
      alert('Erreur lors de l\'ajout au scénario : ' + error.message);
    }
  }

  /**
   * Créer une ligne à partir d'une activité générée
   */
  creerLigneFromActivite(ligne, cardNumber, activite) {
    const cardTypeName = this.getCardTypeName(cardNumber);
    ligne.className = 'ligne text-center';
    ligne.innerHTML = '';

    // Cellule 1 : Actions (poignée, modifier, supprimer)
    let cell1 = ligne.insertCell();
    cell1.innerHTML = `<div class="actions-container">
                         <i class="fa-solid fa-grip-vertical handle" draggable="true"></i>
                         <div class="icon-stack">
                           <button class="btn btn-icon" onclick="declencherModification(this);"><i class="fa-solid fa-pencil"></i></button>
                           <button class="btn btn-icon" onclick="supprimer(this);"><i class="fa-solid fa-trash"></i></button>
                         </div>
                       </div>`;

    // Cellule 2 : Type d'apprentissage avec image et titre
    const cardHeadId = `card${cardNumber}BackHead`;
    const headElementContainer = document.getElementById(cardHeadId);
    let imageSrc = "", titreText = activite.type;

    if (headElementContainer) {
      const headElement = headElementContainer.querySelector('.col');
      const originalImg = headElement?.querySelector('img');
      if (originalImg) imageSrc = originalImg.src;
      titreText = headElement?.querySelector('h3')?.textContent.trim() || activite.type;
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
    cell2.id = `card${cardNumber}-${new Date().getTime()}-${Math.random().toString(36).substr(2, 9)}`;
    cell2.style.cursor = 'pointer';

    const cardColorClass = `card-${cardTypeName}`;
    cell1.classList.add(cardColorClass);
    cell2.classList.add(cardColorClass);

    // Cellule 3 : Objectif
    ligne.insertCell().innerHTML = `<textarea class='form-control ligne' placeholder="L'apprenant sera capable de...">${activite.objectif || ''}</textarea>`;

    // Cellule 4 : Outil
    ligne.insertCell().innerText = activite.outil || '';

    // Cellule 5 : Consignes
    ligne.insertCell().innerHTML = `<textarea class='form-control ligne' placeholder="Instructions pour l'activité...">${activite.consignes || ''}</textarea>`;

    // Cellule 6 : Durée
    ligne.insertCell().innerHTML = `<input type='number' class='form-control' value='${activite.duree || 10}' min='0' onchange='actugraph();'>`;

    // Cellule 7 : Modalité
    const modaliteValue = this.convertModaliteToSelect(activite.modalite, activite.organisation);
    ligne.insertCell().innerHTML = `<select class='form-select' onchange="actugraph();">
      <option ${modaliteValue === 'Présentiel / Individuel' ? 'selected' : ''}>Présentiel / Individuel</option>
      <option ${modaliteValue === 'Présentiel / En groupe' ? 'selected' : ''}>Présentiel / En groupe</option>
      <option ${modaliteValue === 'Présentiel / Classe entière' ? 'selected' : ''}>Présentiel / Classe entière</option>
      <option ${modaliteValue === 'Distanciel Synchrone / Individuel' ? 'selected' : ''}>Distanciel Synchrone / Individuel</option>
      <option ${modaliteValue === 'Distanciel Synchrone / En groupe' ? 'selected' : ''}>Distanciel Synchrone / En groupe</option>
      <option ${modaliteValue === 'Distanciel Synchrone / Classe entière' ? 'selected' : ''}>Distanciel Synchrone / Classe entière</option>
      <option ${modaliteValue === 'Distanciel Asynchrone / Individuel' ? 'selected' : ''}>Distanciel Asynchrone / Individuel</option>
      <option ${modaliteValue === 'Distanciel Asynchrone / En groupe' ? 'selected' : ''}>Distanciel Asynchrone / En groupe</option>
    </select>`;

    // Cellule 8 : Évaluation
    const evaluationValue = this.convertEvaluationToSelect(activite.evaluation);
    ligne.insertCell().innerHTML = `<select class='form-select' onchange="actugraph();">
      <option ${evaluationValue === 'Non évalué' ? 'selected' : ''}>Non évalué</option>
      <option ${evaluationValue === 'Formatif (auto-corrigé)' ? 'selected' : ''}>Formatif (auto-corrigé)</option>
      <option ${evaluationValue === 'Formatif (par les pairs)' ? 'selected' : ''}>Formatif (par les pairs)</option>
      <option ${evaluationValue === 'Formatif (enseignant)' ? 'selected' : ''}>Formatif (enseignant)</option>
      <option ${evaluationValue === 'Sommative (notée)' ? 'selected' : ''}>Sommative (notée)</option>
      <option ${evaluationValue === 'Certificative' ? 'selected' : ''}>Certificative</option>
    </select>`;

    // Cellule 9 : Ressources
    ligne.insertCell().innerHTML = `<textarea class='form-control ligne' placeholder="Lien, PDF, matériel...">${activite.ressources || ''}</textarea>`;
  }

  /**
   * Obtenir le nom du type de carte
   */
  getCardTypeName(number) {
    const types = { "1": 'acquisition', "2": 'collaboration', "3": 'discussion', "4": 'enquete', "5": 'pratique', "6": 'production' };
    return types[number] || '';
  }

  /**
   * Convertir modalité + organisation en valeur select
   */
  convertModaliteToSelect(modalite, organisation) {
    const mod = (modalite || '').toLowerCase();
    const org = (organisation || '').toLowerCase();

    if (mod.includes('présentiel')) {
      if (org.includes('individuel')) return 'Présentiel / Individuel';
      if (org.includes('groupe') || org.includes('binôme')) return 'Présentiel / En groupe';
      if (org.includes('classe')) return 'Présentiel / Classe entière';
      return 'Présentiel / Individuel';
    }

    if (mod.includes('distanciel')) {
      const isAsync = mod.includes('asynchrone');
      if (org.includes('individuel')) return isAsync ? 'Distanciel Asynchrone / Individuel' : 'Distanciel Synchrone / Individuel';
      if (org.includes('groupe') || org.includes('binôme')) return isAsync ? 'Distanciel Asynchrone / En groupe' : 'Distanciel Synchrone / En groupe';
      if (org.includes('classe')) return 'Distanciel Synchrone / Classe entière';
      return 'Distanciel Asynchrone / Individuel';
    }

    return 'Présentiel / Individuel';
  }

  /**
   * Convertir évaluation en valeur select
   */
  convertEvaluationToSelect(evaluation) {
    const evalText = (evaluation || '').toLowerCase();

    if (evalText.includes('aucune') || evalText === '') return 'Non évalué';
    if (evalText.includes('formative') || evalText.includes('formatif')) {
      if (evalText.includes('auto')) return 'Formatif (auto-corrigé)';
      if (evalText.includes('pair')) return 'Formatif (par les pairs)';
      return 'Formatif (enseignant)';
    }
    if (evalText.includes('sommative')) return 'Sommative (notée)';
    if (evalText.includes('certificative')) return 'Certificative';

    return 'Non évalué';
  }

  /**
   * Ajouter une ligne vide pour le dépôt
   */
  ajouterLigneVidePourDepot(tbody) {
    const nouvelleLigneVide = tbody.insertRow();
    nouvelleLigneVide.style.height = '80px';
    nouvelleLigneVide.insertCell();
    const nouvelleDropzoneCell = nouvelleLigneVide.insertCell();
    nouvelleDropzoneCell.className = 'dropzone surlignable';
    for (let i = 0; i < 7; i++) { nouvelleLigneVide.insertCell(); }
  }

  /**
   * Exporter la séquence
   */
  handleExport() {
    if (!this.currentSequence) return;

    const json = JSON.stringify(this.currentSequence, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sequence_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Ouvrir le modal
   */
  show() {
    // Pré-remplir depuis les informations de séquence si disponibles
    if (typeof sequenceInfo !== 'undefined' && sequenceInfo) {
      const seqData = sequenceInfo.getData();
      if (seqData.objectives) {
        document.getElementById('objectifs').value = seqData.objectives;
      }
      if (seqData.level) {
        document.getElementById('niveau').value = seqData.level;
      }
      if (seqData.duration && seqData.duration > 0) {
        document.getElementById('duree').value = seqData.duration;
      }
    }

    this.modal.show();
  }
}

// Initialiser au chargement
let generatorModal;
document.addEventListener('DOMContentLoaded', () => {
  generatorModal = new GeneratorModal();
});
