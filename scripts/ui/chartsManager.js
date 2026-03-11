/**
 * Gestion de l'affichage des graphiques (Replier/Déployer)
 */
class ChartsManager {
    constructor() {
        this.toggleBtn = document.getElementById('toggle-charts');
        this.container = document.getElementById('charts-container');
        this.card = document.getElementById('charts-card');

        this.init();
    }

    init() {
        if (!this.toggleBtn || !this.container) return;

        this.toggleBtn.addEventListener('click', () => this.toggle());

        // Par défaut, si le tableau est vide, on peut replier (optionnel)
        // Mais ici on va laisser l'utilisateur décider
    }

    toggle() {
        if (this.container.style.display === 'none') {
            this.container.style.display = 'block';
            this.toggleBtn.innerHTML = '<i class="fa-solid fa-chevron-up"></i>';
            // Indispensable : Redessiner les graphiques car le container était masqué
            if (typeof actugraph === 'function') {
                setTimeout(() => actugraph(), 50);
            }
        } else {
            this.container.style.display = 'none';
            this.toggleBtn.innerHTML = '<i class="fa-solid fa-chevron-down"></i>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.chartsManager = new ChartsManager();
});
