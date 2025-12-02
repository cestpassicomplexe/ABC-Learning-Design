/**
 * Gestion des informations de la séquence pédagogique
 * Sauvegarde automatique et calcul de la durée totale
 */
class SequenceInfo {
    constructor() {
        this.fields = {
            name: document.getElementById('sequence-name'),
            level: document.getElementById('sequence-level'),
            duration: document.getElementById('sequence-duration'),
            objectives: document.getElementById('sequence-objectives'),
            audience: document.getElementById('sequence-audience'),
            prerequisites: document.getElementById('sequence-prerequisites')
        };

        this.toggleBtn = document.getElementById('toggle-sequence-info');
        this.cardBody = document.getElementById('sequence-info-body');

        this.init();
    }

    /**
     * Initialiser les événements
     */
    init() {
        // Auto-save sur changement
        Object.values(this.fields).forEach(field => {
            if (field && field.id !== 'sequence-duration') {
                field.addEventListener('change', () => this.save());
                field.addEventListener('input', () => this.save());
            }
        });

        // Toggle collapse/expand
        if (this.toggleBtn) {
            this.toggleBtn.addEventListener('click', () => this.toggle());
        }

        // Charger les données sauvegardées
        this.load();

        // Mettre à jour la durée au chargement
        this.updateDuration();

        // Observer les changements dans le tableau pour mettre à jour la durée
        this.observeTableChanges();
    }

    /**
     * Observer les changements dans le tableau des activités
     */
    observeTableChanges() {
        const dropzone = document.getElementById('dropzone');
        if (!dropzone) return;

        // Observer les changements dans le tableau
        const observer = new MutationObserver(() => {
            this.updateDuration();
        });

        observer.observe(dropzone, {
            childList: true,
            subtree: true,
            attributes: false
        });

        // Observer aussi les changements de valeur dans les inputs de durée
        dropzone.addEventListener('input', (e) => {
            if (e.target.type === 'number') {
                this.updateDuration();
            }
        });
    }

    /**
     * Basculer l'affichage du tableau
     */
    toggle() {
        if (this.cardBody.style.display === 'none') {
            this.cardBody.style.display = 'block';
            this.toggleBtn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
        } else {
            this.cardBody.style.display = 'none';
            this.toggleBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
        }
    }

    /**
     * Récupérer les données du formulaire
     */
    getData() {
        return {
            name: this.fields.name?.value || '',
            level: this.fields.level?.value || '',
            duration: this.calculateTotalDuration(),
            objectives: this.fields.objectives?.value || '',
            audience: this.fields.audience?.value || '',
            prerequisites: this.fields.prerequisites?.value || ''
        };
    }

    /**
     * Définir les données du formulaire
     */
    setData(data) {
        if (!data) return;

        if (this.fields.name) this.fields.name.value = data.name || '';
        if (this.fields.level) this.fields.level.value = data.level || '';
        if (this.fields.objectives) this.fields.objectives.value = data.objectives || '';
        if (this.fields.audience) this.fields.audience.value = data.audience || '';
        if (this.fields.prerequisites) this.fields.prerequisites.value = data.prerequisites || '';

        this.updateDuration();
    }

    /**
     * Calculer la durée totale depuis le tableau des activités
     */
    calculateTotalDuration() {
        const dropzone = document.getElementById('dropzone');
        if (!dropzone) return 0;

        let total = 0;
        const rows = dropzone.querySelectorAll('tr.ligne');

        rows.forEach(row => {
            const durationInput = row.querySelector('input[type="number"]');
            if (durationInput) {
                const duration = parseInt(durationInput.value) || 0;
                total += duration;
            }
        });

        return total;
    }

    /**
     * Mettre à jour l'affichage de la durée
     */
    updateDuration() {
        const duration = this.calculateTotalDuration();
        if (this.fields.duration) {
            this.fields.duration.value = `${duration} min`;
        }

        // Mettre à jour les graphiques si la fonction existe
        if (typeof actugraph === 'function') {
            actugraph();
        }
    }

    /**
     * Sauvegarder dans localStorage
     */
    save() {
        const data = this.getData();
        localStorage.setItem('abc-sequence-info', JSON.stringify(data));
    }

    /**
     * Charger depuis localStorage
     */
    load() {
        const saved = localStorage.getItem('abc-sequence-info');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                this.setData(data);
            } catch (error) {
                console.error('Erreur chargement sequence info:', error);
            }
        }
    }

    /**
     * Réinitialiser les données
     */
    clear() {
        this.setData({
            name: '',
            level: '',
            objectives: '',
            audience: '',
            prerequisites: ''
        });
        this.save();
    }
}

// Instance globale
let sequenceInfo;
document.addEventListener('DOMContentLoaded', () => {
    sequenceInfo = new SequenceInfo();
});
