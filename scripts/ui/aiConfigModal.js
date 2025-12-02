/**
 * Interface de configuration des clés API
 * Modal permettant à l'utilisateur de configurer sa clé API et son provider
 */
class AIConfigModal {
    constructor() {
        this.modal = null;
        this.keyManager = apiKeyManager;
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
      <div class="modal fade" id="aiConfigModal" tabindex="-1" aria-labelledby="aiConfigModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title" id="aiConfigModalLabel">
                <i class="fa-solid fa-robot me-2"></i>Configuration de l'Assistant IA
              </h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <!-- Statut de configuration -->
              <div id="aiConfigStatus" class="alert alert-info d-none">
                <i class="fa-solid fa-info-circle me-2"></i>
                <span id="aiConfigStatusText"></span>
              </div>

              <!-- Sélection du provider -->
              <div class="mb-4">
                <label for="aiProvider" class="form-label fw-bold">
                  <i class="fa-solid fa-cloud me-2"></i>Fournisseur d'IA
                </label>
                <select class="form-select" id="aiProvider">
                  <option value="">-- Sélectionnez un fournisseur --</option>
                  ${Object.entries(AI_PROVIDERS).map(([key, provider]) => `
                    <option value="${key}">
                      ${provider.icon} ${provider.name} - ${provider.pricing}
                    </option>
                  `).join('')}
                </select>
                <div class="form-text" id="providerHelp"></div>
              </div>

              <!-- Sélection du modèle -->
              <div class="mb-4" id="modelSelectContainer" style="display: none;">
                <label for="aiModel" class="form-label fw-bold">
                  <i class="fa-solid fa-microchip me-2"></i>Modèle
                </label>
                <select class="form-select" id="aiModel"></select>
              </div>

              <!-- Clé API -->
              <div class="mb-4" id="apiKeyContainer" style="display: none;">
                <label for="apiKeyInput" class="form-label fw-bold">
                  <i class="fa-solid fa-key me-2"></i>Clé API
                </label>
                <div class="input-group">
                  <input type="password" class="form-control" id="apiKeyInput" 
                         placeholder="Entrez votre clé API">
                  <button class="btn btn-outline-secondary" type="button" id="toggleKeyVisibility">
                    <i class="fa-solid fa-eye"></i>
                  </button>
                </div>
                <div class="form-text">
                  <i class="fa-solid fa-shield-halved me-1"></i>
                  Votre clé est stockée localement et chiffrée. Elle n'est jamais envoyée à nos serveurs.
                  <br>
                  <a href="#" id="getKeyLink" target="_blank" rel="noopener">
                    <i class="fa-solid fa-external-link-alt me-1"></i>Comment obtenir une clé API ?
                  </a>
                </div>
              </div>

              <!-- Options de stockage -->
              <div class="mb-4" id="storageOptions" style="display: none;">
                <label class="form-label fw-bold">
                  <i class="fa-solid fa-database me-2"></i>Mémorisation de la clé
                </label>
                <div class="form-check">
                  <input class="form-check-input" type="radio" name="storageType" 
                         id="storageSession" value="session" checked>
                  <label class="form-check-label" for="storageSession">
                    <strong>Cette session uniquement</strong> (Recommandé)
                    <br><small class="text-muted">La clé sera supprimée à la fermeture du navigateur</small>
                  </label>
                </div>
                <div class="form-check mt-2">
                  <input class="form-check-input" type="radio" name="storageType" 
                         id="storageLocal" value="local">
                  <label class="form-check-label" for="storageLocal">
                    <strong>Garder après fermeture</strong> ⚠️
                    <br><small class="text-muted">Déconseillé sur ordinateur partagé</small>
                  </label>
                </div>
                <div class="form-check mt-2">
                  <input class="form-check-input" type="radio" name="storageType" 
                         id="storageMemory" value="memory">
                  <label class="form-check-label" for="storageMemory">
                    <strong>Ne pas mémoriser</strong>
                    <br><small class="text-muted">À ressaisir à chaque utilisation</small>
                  </label>
                </div>
              </div>

              <!-- Avertissement sécurité -->
              <div class="alert alert-warning" id="securityWarning" style="display: none;">
                <i class="fa-solid fa-exclamation-triangle me-2"></i>
                <strong>Important :</strong> Ne partagez jamais votre clé API. 
                Elle donne accès à votre compte et peut entraîner des frais.
              </div>

              <!-- Test de connexion -->
              <div class="mb-3" id="testContainer" style="display: none;">
                <button type="button" class="btn btn-outline-primary" id="testConnectionBtn">
                  <i class="fa-solid fa-plug me-2"></i>Tester la connexion
                </button>
                <span id="testResult" class="ms-3"></span>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Annuler
              </button>
              <button type="button" class="btn btn-danger" id="clearKeyBtn" style="display: none;">
                <i class="fa-solid fa-trash me-2"></i>Supprimer la clé
              </button>
              <button type="button" class="btn btn-primary" id="saveKeyBtn" disabled>
                <i class="fa-solid fa-save me-2"></i>Enregistrer
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

        // Ajouter au DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = new bootstrap.Modal(document.getElementById('aiConfigModal'));
    }

    /**
     * Attacher les event listeners
     */
    attachEventListeners() {
        // Changement de provider
        document.getElementById('aiProvider').addEventListener('change', (e) => {
            this.onProviderChange(e.target.value);
        });

        // Changement de modèle
        document.getElementById('aiModel').addEventListener('change', () => {
            this.validateForm();
        });

        // Saisie de clé API
        document.getElementById('apiKeyInput').addEventListener('input', () => {
            this.validateForm();
        });

        // Toggle visibilité clé
        document.getElementById('toggleKeyVisibility').addEventListener('click', () => {
            this.toggleKeyVisibility();
        });

        // Bouton sauvegarder
        document.getElementById('saveKeyBtn').addEventListener('click', () => {
            this.saveConfiguration();
        });

        // Bouton supprimer
        document.getElementById('clearKeyBtn').addEventListener('click', () => {
            this.clearConfiguration();
        });

        // Test de connexion
        document.getElementById('testConnectionBtn').addEventListener('click', () => {
            this.testConnection();
        });

        // Ouverture du modal
        document.getElementById('aiConfigModal').addEventListener('show.bs.modal', () => {
            this.loadCurrentConfiguration();
        });
    }

    /**
     * Changement de provider
     */
    onProviderChange(providerKey) {
        if (!providerKey) {
            document.getElementById('modelSelectContainer').style.display = 'none';
            document.getElementById('apiKeyContainer').style.display = 'none';
            document.getElementById('storageOptions').style.display = 'none';
            document.getElementById('securityWarning').style.display = 'none';
            document.getElementById('testContainer').style.display = 'none';
            return;
        }

        const provider = AI_PROVIDERS[providerKey];

        // Afficher les sections
        document.getElementById('modelSelectContainer').style.display = 'block';
        document.getElementById('apiKeyContainer').style.display = 'block';
        document.getElementById('storageOptions').style.display = 'block';
        document.getElementById('securityWarning').style.display = 'block';
        document.getElementById('testContainer').style.display = 'block';

        // Remplir les modèles
        const modelSelect = document.getElementById('aiModel');
        modelSelect.innerHTML = provider.models.map(model => `
      <option value="${model.id}" ${model.recommended ? 'selected' : ''}>
        ${model.name} ${model.recommended ? '⭐' : ''}
      </option>
    `).join('');

        // Mettre à jour le lien d'aide
        const helpText = `
      Format de clé : <code>${provider.keyFormat}</code><br>
      Tarification : ${provider.pricing}
    `;
        document.getElementById('providerHelp').innerHTML = helpText;
        document.getElementById('getKeyLink').href = provider.keyUrl;

        this.validateForm();
    }

    /**
     * Toggle visibilité de la clé
     */
    toggleKeyVisibility() {
        const input = document.getElementById('apiKeyInput');
        const icon = document.querySelector('#toggleKeyVisibility i');

        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }

    /**
     * Valider le formulaire
     */
    validateForm() {
        const provider = document.getElementById('aiProvider').value;
        const apiKey = document.getElementById('apiKeyInput').value.trim();
        const saveBtn = document.getElementById('saveKeyBtn');

        saveBtn.disabled = !provider || !apiKey || apiKey.length < 10;
    }

    /**
     * Sauvegarder la configuration
     */
    saveConfiguration() {
        const provider = document.getElementById('aiProvider').value;
        const apiKey = document.getElementById('apiKeyInput').value.trim();
        const storageType = document.querySelector('input[name="storageType"]:checked').value;

        try {
            this.keyManager.setKey(apiKey, provider, storageType);

            // Afficher succès
            this.showStatus('Configuration enregistrée avec succès !', 'success');

            // Fermer le modal après 1 seconde
            setTimeout(() => {
                this.modal.hide();
                // Émettre un événement pour notifier les autres composants
                window.dispatchEvent(new CustomEvent('aiConfigured'));
            }, 1000);
        } catch (error) {
            this.showStatus('Erreur : ' + error.message, 'danger');
        }
    }

    /**
     * Supprimer la configuration
     */
    clearConfiguration() {
        if (confirm('Êtes-vous sûr de vouloir supprimer votre clé API ?')) {
            this.keyManager.clearKey();
            this.showStatus('Configuration supprimée', 'info');
            document.getElementById('apiKeyInput').value = '';
            document.getElementById('clearKeyBtn').style.display = 'none';
            this.validateForm();
        }
    }

    /**
     * Tester la connexion
     */
    async testConnection() {
        const testBtn = document.getElementById('testConnectionBtn');
        const testResult = document.getElementById('testResult');

        testBtn.disabled = true;
        testBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i>Test en cours...';
        testResult.innerHTML = '';

        // Sauvegarder temporairement pour tester
        const provider = document.getElementById('aiProvider').value;
        const apiKey = document.getElementById('apiKeyInput').value.trim();
        const currentKey = this.keyManager.getKey();

        this.keyManager.setKey(apiKey, provider, 'memory');

        try {
            const result = await aiService.testConnection();

            if (result.success) {
                testResult.innerHTML = '<span class="text-success"><i class="fa-solid fa-check-circle me-1"></i>Connexion réussie !</span>';
            } else {
                testResult.innerHTML = `<span class="text-danger"><i class="fa-solid fa-times-circle me-1"></i>${result.message}</span>`;
            }
        } catch (error) {
            testResult.innerHTML = `<span class="text-danger"><i class="fa-solid fa-times-circle me-1"></i>${error.message}</span>`;
        }

        // Restaurer l'état précédent si c'était juste un test
        if (!currentKey) {
            this.keyManager.clearKey();
        }

        testBtn.disabled = false;
        testBtn.innerHTML = '<i class="fa-solid fa-plug me-2"></i>Tester la connexion';
    }

    /**
     * Charger la configuration actuelle
     */
    loadCurrentConfiguration() {
        const provider = this.keyManager.getProvider();
        const hasKey = this.keyManager.hasKey();
        const storageType = this.keyManager.getStorageType();

        if (provider && hasKey) {
            document.getElementById('aiProvider').value = provider;
            this.onProviderChange(provider);

            // Afficher clé masquée
            const key = this.keyManager.getKey();
            document.getElementById('apiKeyInput').value = key;
            document.getElementById('apiKeyInput').placeholder = this.keyManager.maskKey(key);

            // Sélectionner le type de stockage
            if (storageType !== 'none') {
                document.getElementById(`storage${storageType.charAt(0).toUpperCase() + storageType.slice(1)}`).checked = true;
            }

            document.getElementById('clearKeyBtn').style.display = 'inline-block';
            this.showStatus('Configuration existante chargée', 'info');
        }
    }

    /**
     * Afficher un message de statut
     */
    showStatus(message, type = 'info') {
        const statusDiv = document.getElementById('aiConfigStatus');
        const statusText = document.getElementById('aiConfigStatusText');

        statusDiv.className = `alert alert-${type}`;
        statusText.textContent = message;
        statusDiv.classList.remove('d-none');

        // Masquer après 3 secondes
        setTimeout(() => {
            statusDiv.classList.add('d-none');
        }, 3000);
    }

    /**
     * Ouvrir le modal
     */
    show() {
        this.modal.show();
    }
}

// Initialiser au chargement de la page
let aiConfigModal;
document.addEventListener('DOMContentLoaded', () => {
    aiConfigModal = new AIConfigModal();
});
