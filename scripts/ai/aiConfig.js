/**
 * Configuration des providers IA
 * Définit les endpoints, modèles et paramètres pour chaque provider
 * 
 * DERNIÈRE MISE À JOUR : Mars 2026
 * 
 * Pour mettre à jour les modèles :
 * 1. Consulter https://ai.google.dev/gemini-api/docs/models/gemini
 * 2. Modifier les modèles ci-dessous
 * 3. Mettre à jour la date ci-dessus
 * 4. Tester avec "Tester la connexion" dans Configuration IA
 */

const AI_PROVIDERS = {
    google: {
        name: 'Google Gemini',
        models: [
            { id: 'gemini-flash-latest', name: 'Gemini Flash (Recommandé)', recommended: true },
            { id: 'gemini-flash-lite-latest', name: 'Gemini Flash Lite (Rapide, Gratuit)' }
        ],
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/',
        defaultModel: 'gemini-flash-latest',
        keyFormat: 'AIza...',
        keyUrl: 'https://aistudio.google.com/app/apikey',
        pricing: 'Gratuit jusqu\'à 15 req/min',
        icon: '🔷',
        docsUrl: 'https://ai.google.dev/gemini-api/docs/models/gemini'
    }

    /* 
     * AUTRES PROVIDERS (Désactivés pour l'instant)
     * Décommenter pour activer OpenAI, Anthropic ou Mistral
     */

    /*
    ,
    openai: {
      name: 'OpenAI',
      models: [
        { id: 'gpt-4o-mini', name: 'GPT-4o Mini (Rapide, Économique)', recommended: true },
        { id: 'gpt-4o', name: 'GPT-4o (Puissant)' },
        { id: 'gpt-4o-2024-11-20', name: 'GPT-4o (20 Nov 2024)' }
      ],
      endpoint: 'https://api.openai.com/v1/chat/completions',
      defaultModel: 'gpt-4o-mini',
      keyFormat: 'sk-...',
      keyUrl: 'https://platform.openai.com/api-keys',
      pricing: '~0.02€/requête',
      icon: '🟢',
      docsUrl: 'https://platform.openai.com/docs/models'
    },
  
    anthropic: {
      name: 'Anthropic Claude',
      models: [
        { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku (Rapide)', recommended: true },
        { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet (Puissant)' },
        { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus (Très puissant)' }
      ],
      endpoint: 'https://api.anthropic.com/v1/messages',
      defaultModel: 'claude-3-5-haiku-20241022',
      keyFormat: 'sk-ant-...',
      keyUrl: 'https://console.anthropic.com/settings/keys',
      pricing: '~0.01€/requête',
      icon: '🟣',
      docsUrl: 'https://docs.anthropic.com/en/docs/about-claude/models'
    },
  
    mistral: {
      name: 'Mistral AI',
      models: [
        { id: 'mistral-small-latest', name: 'Mistral Small (Rapide)', recommended: true },
        { id: 'mistral-medium-latest', name: 'Mistral Medium' },
        { id: 'mistral-large-latest', name: 'Mistral Large' }
      ],
      endpoint: 'https://api.mistral.ai/v1/chat/completions',
      defaultModel: 'mistral-small-latest',
      keyFormat: '...',
      keyUrl: 'https://console.mistral.ai/api-keys',
      pricing: '~0.01€/requête',
      icon: '🔶',
      docsUrl: 'https://docs.mistral.ai/getting-started/models/'
    }
    */
};

/**
 * Paramètres par défaut pour les requêtes IA
 */
const DEFAULT_AI_PARAMS = {
    temperature: 0.7,
    maxTokens: 4000, // Augmenté pour supporter les modèles avec "thinking"
    topP: 0.95
};

/**
 * Messages d'erreur personnalisés
 */
const AI_ERROR_MESSAGES = {
    NO_KEY: 'Aucune clé API configurée. Veuillez configurer votre clé API dans les paramètres.',
    INVALID_KEY: 'Clé API invalide. Veuillez vérifier votre clé.',
    QUOTA_EXCEEDED: 'Quota dépassé. Veuillez réessayer plus tard ou vérifier votre compte.',
    NETWORK_ERROR: 'Erreur de connexion. Veuillez vérifier votre connexion internet.',
    UNKNOWN_ERROR: 'Une erreur inattendue s\'est produite. Veuillez réessayer.'
};
