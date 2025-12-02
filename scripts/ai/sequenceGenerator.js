/**
 * Service de génération de séquences pédagogiques
 * Utilise l'IA pour créer des séquences basées sur ABC Learning Design
 */
class SequenceGenerator {
    constructor() {
        this.aiService = aiService;
    }

    /**
     * Générer une séquence complète
     * @param {Object} params - Paramètres de génération
     * @returns {Promise<Object>} Séquence générée
     */
    async generateSequence(params) {
        try {
            // Valider les paramètres
            this.validateParams(params);

            // Construire le prompt
            const prompt = PROMPT_TEMPLATES.GENERATE_SEQUENCE(params);

            // Appeler l'IA
            const response = await this.aiService.call(prompt, {
                temperature: 0.7,
                maxTokens: 8000 // Augmenté pour permettre la réflexion et une réponse longue
            });

            // Parser la réponse JSON
            const sequence = this.parseJSONResponse(response);

            // Valider la séquence générée
            this.validateSequence(sequence);

            return sequence;
        } catch (error) {
            console.error('Erreur génération séquence:', error);
            throw new Error('Impossible de générer la séquence : ' + error.message);
        }
    }

    /**
     * Améliorer un objectif pédagogique
     * @param {string} objectif - Objectif à améliorer
     * @returns {Promise<Object>} Objectif amélioré
     */
    async improveObjective(objectif) {
        try {
            if (!objectif || objectif.trim().length < 5) {
                throw new Error('L\'objectif doit contenir au moins 5 caractères');
            }

            const prompt = PROMPT_TEMPLATES.IMPROVE_OBJECTIVES(objectif);
            const response = await this.aiService.call(prompt, {
                temperature: 0.6,
                maxTokens: 2000 // Augmenté pour éviter la coupure (thinking + réponse)
            });

            return this.parseJSONResponse(response);
        } catch (error) {
            console.error('Erreur amélioration objectif:', error);
            throw new Error('Impossible d\'améliorer l\'objectif : ' + error.message);
        }
    }

    /**
     * Analyser une séquence existante
     * @param {Array} activites - Liste des activités
     * @returns {Promise<Object>} Analyse de la séquence
     */
    async analyzeSequence(activites) {
        try {
            if (!activites || activites.length === 0) {
                throw new Error('Aucune activité à analyser');
            }

            const prompt = PROMPT_TEMPLATES.ANALYZE_SEQUENCE(activites);
            const response = await this.aiService.call(prompt, {
                temperature: 0.5,
                maxTokens: 4000 // Augmenté pour l'analyse
            });

            return this.parseJSONResponse(response);
        } catch (error) {
            console.error('Erreur analyse séquence:', error);
            throw new Error('Impossible d\'analyser la séquence : ' + error.message);
        }
    }

    /**
     * Suggérer des activités complémentaires
     * @param {Object} context - Contexte de la séquence
     * @returns {Promise<Object>} Suggestions d'activités
     */
    async suggestActivities(context) {
        try {
            const prompt = PROMPT_TEMPLATES.SUGGEST_ACTIVITIES(context);
            const response = await this.aiService.call(prompt, {
                temperature: 0.8,
                maxTokens: 3000 // Augmenté pour les suggestions
            });

            return this.parseJSONResponse(response);
        } catch (error) {
            console.error('Erreur suggestions activités:', error);
            throw new Error('Impossible de suggérer des activités : ' + error.message);
        }
    }

    /**
     * Valider les paramètres de génération
     * @param {Object} params
     */
    validateParams(params) {
        if (!params.objectifs || params.objectifs.trim().length < 10) {
            throw new Error('Les objectifs d\'apprentissage doivent contenir au moins 10 caractères');
        }

        if (!params.duree || params.duree < 15 || params.duree > 600) {
            throw new Error('La durée doit être entre 15 et 600 minutes');
        }
    }

    /**
     * Valider la séquence générée
     * @param {Object} sequence
     */
    validateSequence(sequence) {
        if (!sequence.activites || !Array.isArray(sequence.activites)) {
            throw new Error('Format de séquence invalide : activités manquantes');
        }

        if (sequence.activites.length === 0) {
            throw new Error('La séquence ne contient aucune activité');
        }

        // Vérifier que chaque activité a les champs requis
        const champsRequis = ['type', 'objectif', 'outil', 'duree'];
        sequence.activites.forEach((activite, index) => {
            champsRequis.forEach(champ => {
                if (!activite[champ]) {
                    throw new Error(`Activité ${index + 1} : champ "${champ}" manquant`);
                }
            });
        });

        // Normaliser et vérifier les types ABC LD avec correspondance partielle
        const typesValides = ['Acquisition', 'Enquête', 'Discussion', 'Collaboration', 'Pratique', 'Production'];
        const typesValidesLower = typesValides.map(t => t.toLowerCase());

        sequence.activites.forEach((activite, index) => {
            const typeLower = activite.type.toLowerCase();

            // Chercher si un des types valides est contenu dans le type généré
            // Ex: "Pratique/Entraînement" contient "pratique" -> valide
            const indexType = typesValidesLower.findIndex(validType => typeLower.includes(validType));

            if (indexType === -1) {
                throw new Error(`Activité ${index + 1} : type "${activite.type}" invalide. Types valides : ${typesValides.join(', ')}`);
            }

            // Normaliser le type avec la bonne casse
            activite.type = typesValides[indexType];
        });
    }

    /**
     * Parser une réponse JSON de l'IA
     * @param {string} response - Réponse brute de l'IA
     * @returns {Object} Objet JSON parsé
     */
    parseJSONResponse(response) {
        try {
            console.log('Réponse brute à parser (200 premiers caractères):', response.substring(0, 200));

            // Nettoyer la réponse (enlever markdown, espaces, etc.)
            let cleaned = response.trim();

            // Enlever les balises markdown si présentes
            cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');

            // Trouver le premier { et le dernier }
            const start = cleaned.indexOf('{');
            const end = cleaned.lastIndexOf('}');

            if (start === -1 || end === -1) {
                console.error('Pas de JSON trouvé. Réponse complète:', response);
                throw new Error('Pas de JSON trouvé dans la réponse');
            }

            cleaned = cleaned.substring(start, end + 1);
            console.log('JSON nettoyé (200 premiers caractères):', cleaned.substring(0, 200));

            // Parser le JSON
            const parsed = JSON.parse(cleaned);
            console.log('JSON parsé avec succès:', Object.keys(parsed));

            return parsed;
        } catch (error) {
            console.error('Erreur parsing JSON:', error);
            console.error('Réponse complète:', response);

            // Message d'erreur plus détaillé
            if (error instanceof SyntaxError) {
                throw new Error('Format de réponse invalide. L\'IA n\'a pas retourné un JSON valide. Vérifiez la console pour plus de détails.');
            }

            throw new Error('Format de réponse invalide : ' + error.message);
        }
    }

    /**
     * Générer une check-list enseignant
     * @param {Object} sequenceInfo - Informations de la séquence
     * @param {Array} activites - Liste des activités
     * @param {Object} options - Options de personnalisation
     * @returns {Promise<string>} Check-list en Markdown
     */
    async generateChecklist(sequenceInfo, activites, options = {}) {
        try {
            if (!activites || activites.length === 0) {
                throw new Error('Aucune activité à inclure dans la check-list');
            }

            const prompt = PROMPT_TEMPLATES.GENERATE_CHECKLIST(sequenceInfo, activites, options);
            const response = await this.aiService.call(prompt, {
                temperature: 0.6,
                maxTokens: 6000
            });

            // La réponse devrait être du Markdown direct
            // Nettoyer les balises markdown si présentes
            let checklist = response.trim();
            checklist = checklist.replace(/```markdown\n?/g, '').replace(/```\n?/g, '');

            return checklist;
        } catch (error) {
            console.error('Erreur génération check-list:', error);
            throw new Error('Impossible de générer la check-list : ' + error.message);
        }
    }

    /**
     * Calculer la répartition des types d'apprentissage
     * @param {Array} activites - Liste des activités
     * @returns {Object} Répartition en pourcentage
     */
    calculateDistribution(activites) {
        const counts = {
            'Acquisition': 0,
            'Enquête': 0,
            'Discussion': 0,
            'Collaboration': 0,
            'Pratique': 0,
            'Production': 0
        };

        activites.forEach(activite => {
            if (counts.hasOwnProperty(activite.type)) {
                counts[activite.type]++;
            }
        });

        const total = activites.length;
        const distribution = {};

        Object.keys(counts).forEach(type => {
            distribution[type] = Math.round((counts[type] / total) * 100);
        });

        return distribution;
    }

    /**
     * Calculer le score d'équilibre (0-100)
     * @param {Object} distribution - Répartition des types
     * @returns {number} Score d'équilibre
     */
    calculateBalanceScore(distribution) {
        const ideal = 16.67; // 100/6 types
        let totalDeviation = 0;

        Object.values(distribution).forEach(percentage => {
            totalDeviation += Math.abs(percentage - ideal);
        });

        // Score : 100 - (déviation moyenne)
        const score = Math.max(0, 100 - (totalDeviation / 6));
        return Math.round(score);
    }
}

// Instance globale
const sequenceGenerator = new SequenceGenerator();
