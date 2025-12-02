/**
 * Service principal pour les appels IA
 * Gère les requêtes vers différents providers (Google, OpenAI, Anthropic, Mistral)
 */
class AIService {
    constructor() {
        this.keyManager = apiKeyManager;
    }

    /**
     * Appeler l'IA avec un prompt
     * @param {string} prompt - Le prompt à envoyer
     * @param {Object} options - Options supplémentaires
     * @returns {Promise<string>} La réponse de l'IA
     */
    async call(prompt, options = {}) {
        const provider = this.keyManager.getProvider();
        const apiKey = this.keyManager.getKey();

        if (!apiKey) {
            throw new Error(AI_ERROR_MESSAGES.NO_KEY);
        }

        if (!provider || !AI_PROVIDERS[provider]) {
            throw new Error('Provider invalide');
        }

        // Sélectionner le modèle
        const model = options.model || AI_PROVIDERS[provider].defaultModel;

        try {
            switch (provider) {
                case 'google':
                    return await this.callGemini(prompt, apiKey, model, options);
                case 'openai':
                    return await this.callOpenAI(prompt, apiKey, model, options);
                case 'anthropic':
                    return await this.callAnthropic(prompt, apiKey, model, options);
                case 'mistral':
                    return await this.callMistral(prompt, apiKey, model, options);
                default:
                    throw new Error('Provider non supporté');
            }
        } catch (error) {
            console.error('Erreur appel IA:', error);
            throw this.handleError(error);
        }
    }

    /**
     * Appeler Google Gemini
     */
    async callGemini(prompt, apiKey, model, options) {
        const url = `${AI_PROVIDERS.google.endpoint}${model}:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: options.temperature || DEFAULT_AI_PARAMS.temperature,
                    maxOutputTokens: options.maxTokens || DEFAULT_AI_PARAMS.maxTokens,
                    topP: options.topP || DEFAULT_AI_PARAMS.topP
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Erreur Gemini API');
        }

        const data = await response.json();

        // Log pour debug
        console.log('Réponse Gemini complète:', JSON.stringify(data, null, 2));

        // Vérifier la structure de la réponse
        if (!data.candidates || !data.candidates[0]) {
            console.error('Réponse Gemini invalide - pas de candidates:', data);
            throw new Error('Réponse Gemini invalide : aucun candidat retourné');
        }

        const candidate = data.candidates[0];

        // Vérifier si le contenu a été bloqué
        if (candidate.finishReason === 'SAFETY' || candidate.finishReason === 'RECITATION') {
            throw new Error(`Contenu bloqué par Gemini (${candidate.finishReason}). Essayez de reformuler votre demande.`);
        }

        // Vérifier la présence du contenu
        if (!candidate.content || !candidate.content.parts || !candidate.content.parts[0]) {
            console.error('Réponse Gemini invalide - structure:', candidate);
            throw new Error('Réponse Gemini invalide : contenu manquant');
        }

        const text = candidate.content.parts[0].text;
        console.log('Texte extrait de Gemini:', text.substring(0, 200) + '...');

        return text;
    }

    /**
     * Appeler OpenAI
     */
    async callOpenAI(prompt, apiKey, model, options) {
        const response = await fetch(AI_PROVIDERS.openai.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                temperature: options.temperature || DEFAULT_AI_PARAMS.temperature,
                max_tokens: options.maxTokens || DEFAULT_AI_PARAMS.maxTokens,
                top_p: options.topP || DEFAULT_AI_PARAMS.topP
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Erreur OpenAI API');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    /**
     * Appeler Anthropic Claude
     */
    async callAnthropic(prompt, apiKey, model, options) {
        const response = await fetch(AI_PROVIDERS.anthropic.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: model,
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                max_tokens: options.maxTokens || DEFAULT_AI_PARAMS.maxTokens,
                temperature: options.temperature || DEFAULT_AI_PARAMS.temperature
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Erreur Anthropic API');
        }

        const data = await response.json();
        return data.content[0].text;
    }

    /**
     * Appeler Mistral AI
     */
    async callMistral(prompt, apiKey, model, options) {
        const response = await fetch(AI_PROVIDERS.mistral.endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                temperature: options.temperature || DEFAULT_AI_PARAMS.temperature,
                max_tokens: options.maxTokens || DEFAULT_AI_PARAMS.maxTokens,
                top_p: options.topP || DEFAULT_AI_PARAMS.topP
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur Mistral API');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    /**
     * Gérer les erreurs et retourner un message approprié
     */
    handleError(error) {
        const message = error.message.toLowerCase();

        if (message.includes('api key') || message.includes('unauthorized') || message.includes('401')) {
            return new Error(AI_ERROR_MESSAGES.INVALID_KEY);
        }

        if (message.includes('quota') || message.includes('rate limit') || message.includes('429')) {
            return new Error(AI_ERROR_MESSAGES.QUOTA_EXCEEDED);
        }

        if (message.includes('network') || message.includes('fetch')) {
            return new Error(AI_ERROR_MESSAGES.NETWORK_ERROR);
        }

        return new Error(AI_ERROR_MESSAGES.UNKNOWN_ERROR + '\n' + error.message);
    }

    /**
     * Tester la connexion avec la clé API actuelle
     */
    async testConnection() {
        try {
            const response = await this.call('Réponds simplement "OK" si tu me reçois.', {
                maxTokens: 50
            });
            return { success: true, message: 'Connexion réussie !' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

// Instance globale
const aiService = new AIService();
