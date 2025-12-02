/**
 * Gestionnaire sécurisé de clés API
 * Gère le stockage, le chiffrement et la récupération des clés API utilisateur
 */
class SecureAPIKeyManager {
    constructor() {
        this.key = null; // Clé en mémoire
        this.provider = null; // Provider sélectionné
        this.storageKey = 'abc_ai_key_enc';
        this.providerKey = 'abc_ai_provider';
    }

    /**
     * Définir et stocker une clé API
     * @param {string} apiKey - La clé API à stocker
     * @param {string} provider - Le provider (google, openai, anthropic, mistral)
     * @param {string} storageType - 'session' (défaut), 'local', ou 'memory'
     */
    setKey(apiKey, provider, storageType = 'session') {
        if (!apiKey || !provider) {
            throw new Error('Clé API et provider requis');
        }

        this.key = apiKey;
        this.provider = provider;

        // Stocker le provider (non sensible)
        localStorage.setItem(this.providerKey, provider);

        // Stocker la clé selon le type choisi
        switch (storageType) {
            case 'local':
                // Avertissement pour localStorage
                if (confirm('⚠️ Stocker la clé dans le navigateur ?\n\nCela gardera votre clé après fermeture du navigateur.\nDéconseillé sur ordinateur partagé.\n\nContinuer ?')) {
                    const encrypted = this.encrypt(apiKey);
                    localStorage.setItem(this.storageKey, encrypted);
                    localStorage.setItem(this.storageKey + '_type', 'local');
                } else {
                    // Fallback vers session
                    this.setKey(apiKey, provider, 'session');
                }
                break;

            case 'session':
                // Session uniquement (recommandé)
                const encrypted = this.encrypt(apiKey);
                sessionStorage.setItem(this.storageKey, encrypted);
                localStorage.setItem(this.storageKey + '_type', 'session');
                break;

            case 'memory':
                // En mémoire uniquement (plus sécurisé, mais perdu au refresh)
                localStorage.setItem(this.storageKey + '_type', 'memory');
                break;

            default:
                throw new Error('Type de stockage invalide');
        }
    }

    /**
     * Récupérer la clé API
     * @returns {string|null} La clé API déchiffrée ou null
     */
    getKey() {
        // Si déjà en mémoire
        if (this.key) return this.key;

        // Essayer de récupérer depuis storage
        const storageType = localStorage.getItem(this.storageKey + '_type');

        if (storageType === 'memory') {
            return null; // Pas de stockage persistant
        }

        let encrypted = null;

        if (storageType === 'session') {
            encrypted = sessionStorage.getItem(this.storageKey);
        } else if (storageType === 'local') {
            encrypted = localStorage.getItem(this.storageKey);
        }

        if (encrypted) {
            this.key = this.decrypt(encrypted);
            return this.key;
        }

        return null;
    }

    /**
     * Récupérer le provider configuré
     * @returns {string|null}
     */
    getProvider() {
        if (this.provider) return this.provider;
        this.provider = localStorage.getItem(this.providerKey);
        return this.provider;
    }

    /**
     * Vérifier si une clé est configurée
     * @returns {boolean}
     */
    hasKey() {
        return this.getKey() !== null;
    }

    /**
     * Supprimer la clé et les données associées
     */
    clearKey() {
        this.key = null;
        this.provider = null;
        sessionStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.storageKey + '_type');
        localStorage.removeItem(this.providerKey);
    }

    /**
     * Obfusquer une clé (Base64)
     * NOTE: Ce n'est PAS un chiffrement fort. C'est une mesure d'obfuscation pour éviter
     * que la clé soit lisible en clair dans le stockage du navigateur.
     * @param {string} text
     * @returns {string}
     */
    encrypt(text) {
        try {
            return btoa(text);
        } catch (e) {
            console.error('Erreur d\'obfuscation:', e);
            return text;
        }
    }

    /**
     * Déchiffrer une clé
     * @param {string} encrypted
     * @returns {string}
     */
    decrypt(encrypted) {
        try {
            return atob(encrypted);
        } catch (e) {
            console.error('Erreur de déchiffrement:', e);
            return encrypted;
        }
    }

    /**
     * Masquer une clé pour affichage sécurisé
     * @param {string} key
     * @returns {string}
     */
    maskKey(key) {
        if (!key || key.length < 8) return '••••••••';
        return key.substring(0, 4) + '•••' + key.substring(key.length - 4);
    }

    /**
     * Obtenir le type de stockage actuel
     * @returns {string}
     */
    getStorageType() {
        return localStorage.getItem(this.storageKey + '_type') || 'none';
    }
}

// Instance globale
const apiKeyManager = new SecureAPIKeyManager();
