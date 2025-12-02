/**
 * Modal de génération de check-list enseignant
 * Génère une check-list pratique pour le déroulement de la séquence en classe
 */
class ChecklistModal {
  constructor() {
    this.modal = null;
    this.generator = sequenceGenerator;
    this.currentChecklist = null;
    this.currentChecklistMarkdown = null; // Stocker le markdown original
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
      <div class="modal fade" id="checklistModal" tabindex="-1" aria-labelledby="checklistModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header bg-success text-white">
              <h5 class="modal-title" id="checklistModalLabel">
                <i class="fa-solid fa-list-check me-2"></i>Check-list Enseignant
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <!-- Options de personnalisation -->
              <div id="checklist-options" class="card mb-3">
                <div class="card-header bg-light">
                  <h6 class="mb-0"><i class="fa-solid fa-sliders me-2"></i>Options de génération</h6>
                </div>
                <div class="card-body">
                  <div class="row">
                    <!-- Niveau de détail -->
                    <div class="col-md-4 mb-3">
                      <label class="form-label fw-bold">Niveau de détail</label>
                      <div class="btn-group w-100" role="group">
                        <input type="radio" class="btn-check" name="detailLevel" id="detail-synthetique" value="synthetique">
                        <label class="btn btn-outline-primary btn-sm" for="detail-synthetique">Synthétique</label>
                        
                        <input type="radio" class="btn-check" name="detailLevel" id="detail-standard" value="standard" checked>
                        <label class="btn btn-outline-primary btn-sm" for="detail-standard">Standard</label>
                        
                        <input type="radio" class="btn-check" name="detailLevel" id="detail-detaille" value="detaille">
                        <label class="btn btn-outline-primary btn-sm" for="detail-detaille">Détaillé</label>
                      </div>
                    </div>

                    <!-- Format -->
                    <div class="col-md-4 mb-3">
                      <label class="form-label fw-bold">Format</label>
                      <div class="btn-group w-100" role="group">
                        <input type="radio" class="btn-check" name="formatType" id="format-simple" value="simple" checked>
                        <label class="btn btn-outline-success btn-sm" for="format-simple" title="Check-list avec points d'action uniquement">Check-list</label>
                        
                        <input type="radio" class="btn-check" name="formatType" id="format-complet" value="complet">
                        <label class="btn btn-outline-success btn-sm" for="format-complet" title="Guide avec contexte pédagogique, conseils et variantes">Guide complet</label>
                      </div>
                      <small class="text-muted d-block mt-1">
                        <strong>Check-list :</strong> Points d'action<br>
                        <strong>Guide :</strong> + Conseils & variantes
                      </small>
                    </div>

                    <!-- Heure de début -->
                    <div class="col-md-4 mb-3">
                      <label class="form-label fw-bold">Heure de début</label>
                      <input type="time" class="form-control" id="start-time" value="09:00">
                    </div>
                  </div>

                  <!-- Sections à inclure -->
                  <div class="row">
                    <div class="col-12">
                      <label class="form-label fw-bold">Sections à inclure</label>
                      <div class="d-flex gap-3 flex-wrap">
                        <div class="form-check">
                          <input class="form-check-input" type="checkbox" id="section-avant" checked>
                          <label class="form-check-label" for="section-avant">
                            📌 Avant la séance
                          </label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="checkbox" id="section-deroulement" checked>
                          <label class="form-check-label" for="section-deroulement">
                            🎓 Déroulement
                          </label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="checkbox" id="section-apres" checked>
                          <label class="form-check-label" for="section-apres">
                            📌 Après la séance
                          </label>
                        </div>
                        <div class="form-check">
                          <input class="form-check-input" type="checkbox" id="section-attention" checked>
                          <label class="form-check-label" for="section-attention">
                            💡 Points d'attention
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Bouton de génération -->
                  <div class="row mt-3">
                    <div class="col-12">
                      <button type="button" class="btn btn-success w-100" id="generate-checklist-btn">
                        <i class="fa-solid fa-wand-magic-sparkles me-2"></i>Générer la check-list
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Zone de chargement -->
              <div id="checklist-loading" class="text-center py-5 d-none">
                <div class="spinner-border text-success" role="status" style="width: 3rem; height: 3rem;">
                  <span class="visually-hidden">Génération en cours...</span>
                </div>
                <p class="mt-3 text-muted">
                  <i class="fa-solid fa-robot me-2"></i>L'IA génère votre check-list...
                  <br><small>Cela peut prendre quelques secondes</small>
                </p>
              </div>

              <!-- Zone de contenu -->
              <div id="checklist-content" class="d-none">
                <div id="checklist-display" style="background: #f8f9fa; padding: 20px; border-radius: 8px; max-height: 600px; overflow-y: auto;">
                </div>
              </div>

              <!-- Message d'erreur -->
              <div id="checklist-error" class="alert alert-danger d-none" role="alert">
                <i class="fa-solid fa-triangle-exclamation me-2"></i>
                <span id="checklist-error-message"></span>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" id="regenerate-checklist-btn" style="display: none;">
                <i class="fa-solid fa-arrow-left me-2"></i>Modifier les options
              </button>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button>
              <button type="button" class="btn btn-info" id="copy-html-btn" disabled>
                <i class="fa-solid fa-code me-2"></i>Copier HTML
              </button>
              <button type="button" class="btn btn-primary" id="copy-markdown-btn" disabled>
                <i class="fa-solid fa-copy me-2"></i>Copier Markdown
              </button>
              <button type="button" class="btn btn-success" id="download-checklist-btn" disabled>
                <i class="fa-solid fa-download me-2"></i>Télécharger (.md)
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = new bootstrap.Modal(document.getElementById('checklistModal'));
  }

  /**
   * Attacher les event listeners
   */
  attachEventListeners() {
    document.getElementById('generate-checklist-btn')?.addEventListener('click', () => {
      this.generateChecklist();
    });

    document.getElementById('regenerate-checklist-btn')?.addEventListener('click', () => {
      this.showOptions();
    });

    document.getElementById('copy-html-btn')?.addEventListener('click', () => {
      this.copyAsHTML();
    });

    document.getElementById('copy-markdown-btn')?.addEventListener('click', () => {
      this.copyAsMarkdown();
    });

    document.getElementById('download-checklist-btn')?.addEventListener('click', () => {
      this.downloadMarkdown();
    });
  }

  /**
   * Afficher le modal
   */
  show() {
    // Vérifier qu'il y a des activités
    const activites = this.getActivitiesFromTable();
    if (activites.length === 0) {
      alert('Veuillez d\'abord créer des activités dans votre scénario pédagogique.');
      return;
    }

    // Afficher le modal avec les options
    this.modal.show();

    // Charger la dernière check-list si elle existe
    this.loadFromStorage();

    // Réinitialiser l'affichage
    if (!this.currentChecklist) {
      document.getElementById('checklist-options').classList.remove('d-none');
      document.getElementById('checklist-loading').classList.add('d-none');
      document.getElementById('checklist-content').classList.add('d-none');
      document.getElementById('checklist-error').classList.add('d-none');
    }
  }

  /**
   * Générer la check-list avec les options sélectionnées
   */
  async generateChecklist() {
    // Récupérer les options
    const options = this.getOptions();

    // Récupérer les activités et infos de séquence
    const activites = this.getActivitiesFromTable();
    const sequenceData = typeof sequenceInfo !== 'undefined' && sequenceInfo ?
      sequenceInfo.getData() : {};

    this.showLoading();

    try {
      // Générer la check-list avec les options
      const checklist = await this.generator.generateChecklist(sequenceData, activites, options);
      this.currentChecklistMarkdown = checklist;
      this.currentChecklist = this.markdownToHTML(checklist);

      // Sauvegarder dans localStorage
      this.saveToStorage();

      this.displayChecklist(this.currentChecklist);
    } catch (error) {
      this.showError(error.message);
    }
  }

  /**
   * Récupérer les options sélectionnées
   */
  getOptions() {
    return {
      detailLevel: document.querySelector('input[name="detailLevel"]:checked')?.value || 'standard',
      formatType: document.querySelector('input[name="formatType"]:checked')?.value || 'simple',
      startTime: document.getElementById('start-time')?.value || '09:00',
      sections: {
        avant: document.getElementById('section-avant')?.checked || false,
        deroulement: document.getElementById('section-deroulement')?.checked || false,
        apres: document.getElementById('section-apres')?.checked || false,
        attention: document.getElementById('section-attention')?.checked || false
      }
    };
  }

  /**
   * Récupérer les activités depuis le tableau
   */
  getActivitiesFromTable() {
    const activities = [];
    const rows = document.querySelectorAll('#dropzone tr.ligne');

    rows.forEach(row => {
      const typeCell = row.cells[1];
      const type = typeCell?.querySelector('h6')?.textContent.trim() || 'Inconnu';

      activities.push({
        type: type,
        objectif: row.cells[2]?.querySelector('textarea')?.value || '',
        outil: row.cells[3]?.innerText || '',
        consignes: row.cells[4]?.querySelector('textarea')?.value || '',
        duree: parseInt(row.cells[5]?.querySelector('input')?.value) || 0,
        modalite: row.cells[6]?.querySelector('select')?.value || '',
        evaluation: row.cells[7]?.querySelector('select')?.value || ''
      });
    });

    return activities;
  }

  /**
   * Afficher le chargement
   */
  showLoading() {
    document.getElementById('checklist-loading').classList.remove('d-none');
    document.getElementById('checklist-options').classList.add('d-none');
    document.getElementById('checklist-content').classList.add('d-none');
    document.getElementById('checklist-error').classList.add('d-none');
    document.getElementById('copy-html-btn').disabled = true;
    document.getElementById('copy-markdown-btn').disabled = true;
    document.getElementById('download-checklist-btn').disabled = true;
  }

  /**
   * Afficher les options (pour regénérer)
   */
  showOptions() {
    document.getElementById('checklist-options').classList.remove('d-none');
    document.getElementById('checklist-content').classList.add('d-none');
    document.getElementById('regenerate-checklist-btn').style.display = 'none';
  }

  /**
   * Afficher la check-list
   */
  displayChecklist(checklistHTML) {
    document.getElementById('checklist-loading').classList.add('d-none');
    document.getElementById('checklist-options').classList.add('d-none');
    document.getElementById('checklist-content').classList.remove('d-none');
    document.getElementById('checklist-error').classList.add('d-none');

    // Afficher le contenu HTML
    document.getElementById('checklist-display').innerHTML = checklistHTML;

    // Activer les boutons
    document.getElementById('copy-html-btn').disabled = false;
    document.getElementById('copy-markdown-btn').disabled = false;
    document.getElementById('download-checklist-btn').disabled = false;

    // Afficher le bouton de regénération
    document.getElementById('regenerate-checklist-btn').style.display = 'inline-block';
  }

  /**
   * Convertir Markdown en HTML pour affichage lisible
   */
  markdownToHTML(markdown) {
    let html = markdown;

    // Titres
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');

    // Cases à cocher
    html = html.replace(/- \[ \]/g, '<input type="checkbox"> ');
    html = html.replace(/- \[x\]/g, '<input type="checkbox" checked> ');

    // Gras
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italique
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Listes à puces
    html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

    // Alertes/warnings
    html = html.replace(/⚠️/g, '<span style="color: #ff6b6b;">⚠️</span>');

    // Emojis et icônes
    html = html.replace(/✅/g, '<span style="color: #51cf66;">✅</span>');
    html = html.replace(/📌/g, '<span style="font-size: 1.2em;">📌</span>');
    html = html.replace(/🎓/g, '<span style="font-size: 1.2em;">🎓</span>');
    html = html.replace(/💡/g, '<span style="font-size: 1.2em;">💡</span>');
    html = html.replace(/⏰/g, '<span style="font-size: 1.2em;">⏰</span>');

    // Sauts de ligne
    html = html.replace(/\n/g, '<br>');

    return `<div style="line-height: 1.8; font-family: system-ui, -apple-system, sans-serif;">${html}</div>`;
  }

  /**
   * Sauvegarder dans localStorage
   */
  saveToStorage() {
    if (this.currentChecklistMarkdown) {
      localStorage.setItem('abc-checklist-markdown', this.currentChecklistMarkdown);
      localStorage.setItem('abc-checklist-html', this.currentChecklist);
    }
  }

  /**
   * Charger depuis localStorage
   */
  loadFromStorage() {
    const savedMarkdown = localStorage.getItem('abc-checklist-markdown');
    const savedHTML = localStorage.getItem('abc-checklist-html');

    if (savedMarkdown && savedHTML) {
      this.currentChecklistMarkdown = savedMarkdown;
      this.currentChecklist = savedHTML;
      this.displayChecklist(savedHTML);
    }
  }

  /**
   * Afficher une erreur
   */
  showError(message) {
    document.getElementById('checklist-loading').classList.add('d-none');
    document.getElementById('checklist-content').classList.add('d-none');
    document.getElementById('checklist-error').classList.remove('d-none');
    document.getElementById('checklist-error-message').textContent = message;
  }

  /**
   * Copier en HTML dans le presse-papiers
   */
  async copyAsHTML() {
    if (!this.currentChecklist) return;

    try {
      const blob = new Blob([this.currentChecklist], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({ 'text/html': blob });
      await navigator.clipboard.write([clipboardItem]);
      alert('✅ Check-list copiée en HTML ! Vous pouvez la coller dans Word, Google Docs, etc.');
    } catch (error) {
      // Fallback: copier comme texte
      try {
        await navigator.clipboard.writeText(this.currentChecklist);
        alert('✅ Check-list copiée (format texte) !');
      } catch (err) {
        alert('❌ Erreur lors de la copie : ' + err.message);
      }
    }
  }

  /**
   * Copier en Markdown dans le presse-papiers
   */
  async copyAsMarkdown() {
    if (!this.currentChecklistMarkdown) return;

    try {
      await navigator.clipboard.writeText(this.currentChecklistMarkdown);
      alert('✅ Check-list copiée en Markdown !');
    } catch (error) {
      alert('❌ Erreur lors de la copie : ' + error.message);
    }
  }

  /**
   * Télécharger en Markdown
   */
  downloadMarkdown() {
    if (!this.currentChecklistMarkdown) return;

    const sequenceData = typeof sequenceInfo !== 'undefined' && sequenceInfo ?
      sequenceInfo.getData() : {};
    const filename = sequenceData.name ?
      `checklist_${sequenceData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md` :
      'checklist_enseignant.md';

    const blob = new Blob([this.currentChecklistMarkdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Instance globale
let checklistModal;
document.addEventListener('DOMContentLoaded', () => {
  checklistModal = new ChecklistModal();
});
