/**
 * Gestion de la ligne du temps (Timeline)
 * Synchronisée avec le tableau des activités
 */
class Timeline {
    constructor() {
        this.container = document.getElementById('timeline');
        this.dropzone = document.getElementById('dropzone');
        this.draggedIndex = null;
        this.insertionIndex = null; // Utilisé pour savoir où insérer via la modale
        this.init();
    }

    init() {
        if (!this.container || !this.dropzone) return;

        let renderTimer = null;

        // Observer les changements dans le tableau pour mettre à jour la timeline.
        // IMPORTANT : Le debounce (80ms) est essentiel pour éviter de reconstruire la
        // timeline pour chaque cellule insérée lors de la création d'une ligne (~10 mutations).
        // Sans debounce, la page se fige car render() est appelé ~10 fois de suite.
        const observer = new MutationObserver(() => {
            clearTimeout(renderTimer);
            renderTimer = setTimeout(() => this.render(), 80);
        });

        observer.observe(this.dropzone, {
            childList: true,
            subtree: true,
            characterData: true
        });

        // Déclencher le rendu aussi quand on tape dans les inputs (mots-clés)
        this.dropzone.addEventListener('input', () => {
            clearTimeout(renderTimer);
            renderTimer = setTimeout(() => this.render(), 300); // Un peu plus long pour la frappe
        });

        // Premier rendu
        this.render();
    }

    /**
     * Crée un bouton d'insertion "+"
     */
    createInsertionButton(index) {
        const btn = document.createElement('div');
        btn.className = 'timeline-insert-btn';
        btn.innerHTML = '<i class="fa-solid fa-plus"></i>';
        btn.title = "Insérer une activité ici";
        btn.onclick = (e) => {
            e.stopPropagation();
            this.insertionIndex = index;
            const modal = new bootstrap.Modal(document.getElementById('activityTypeModal'));
            modal.show();
        };
        return btn;
    }

    /**
     * Génère le HTML de la timeline à partir des lignes du tableau
     */
    render() {
        const rows = Array.from(this.dropzone.querySelectorAll('tr.ligne'));

        if (rows.length === 0) {
            this.container.innerHTML = `
                <div class="timeline-empty-msg text-muted mx-auto">
                    Cliquer sur "Ajouter une activité" pour commencer votre scénario.
                </div>
            `;
            return;
        }

        this.container.innerHTML = '';

        // Bouton d'insertion au tout début
        this.container.appendChild(this.createInsertionButton(0));

        rows.forEach((row, index) => {
            const cellType = row.cells[1];
            const typeName = this.getTypeNameFromRow(row);
            const title = cellType.querySelector('.titre-carte')?.textContent || 'Activité';
            const keyword = cellType.querySelector('.keyword-input')?.value || '';
            const img = cellType.querySelector('img')?.src || '';

            const item = document.createElement('div');
            item.className = `timeline-item card-${typeName}`;
            item.dataset.index = index;
            item.draggable = true;
            if (keyword) item.title = keyword; // Ajout du rappel au survol
            item.innerHTML = `
                <div class="activity-index">#${index + 1}</div>
                ${img ? `<img src="${img}" alt="${title}" draggable="false">` : ''}
                <div class="activity-name">${title}</div>
            `;

            // Navigation
            item.onclick = () => {
                this.scrollToRow(row);
                this.highlightItem(item);
            };

            // Drag & Drop
            item.ondragstart = (e) => {
                this.draggedIndex = index;
                item.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            };

            item.ondragend = () => {
                item.classList.remove('dragging');
                this.container.querySelectorAll('.timeline-item').forEach(it => it.classList.remove('drag-over'));
            };

            item.ondragover = (e) => {
                e.preventDefault();
                item.classList.add('drag-over');
            };

            item.ondragleave = () => {
                item.classList.remove('drag-over');
            };

            item.ondrop = (e) => {
                e.preventDefault();
                const targetIndex = index;
                if (this.draggedIndex !== null && this.draggedIndex !== targetIndex) {
                    this.moveActivity(this.draggedIndex, targetIndex);
                }
                this.draggedIndex = null;
            };

            this.container.appendChild(item);

            // Bouton d'insertion après chaque item
            this.container.appendChild(this.createInsertionButton(index + 1));
        });
    }

    /**
     * Déplace une activité dans le tableau (et donc par ricochet dans la timeline via l'observer)
     */
    moveActivity(fromIndex, toIndex) {
        const rows = Array.from(this.dropzone.querySelectorAll('tr.ligne'));
        const rowToMove = rows[fromIndex];
        const targetRow = rows[toIndex];

        if (fromIndex < toIndex) {
            this.dropzone.insertBefore(rowToMove, targetRow.nextSibling);
        } else {
            this.dropzone.insertBefore(rowToMove, targetRow);
        }

        // Mettre à jour les graphes après réorganisation
        if (typeof actugraph === 'function') actugraph();
    }

    /**
     * Détermine le nom du type à partir de la classe de la ligne
     */
    getTypeNameFromRow(row) {
        const classes = row.cells[1].className;
        if (classes.includes('card-acquisition')) return 'acquisition';
        if (classes.includes('card-collaboration')) return 'collaboration';
        if (classes.includes('card-discussion')) return 'discussion';
        if (classes.includes('card-enquete')) return 'enquete';
        if (classes.includes('card-pratique')) return 'pratique';
        if (classes.includes('card-production')) return 'production';
        return '';
    }

    /**
     * Scrolle vers la ligne du tableau correspondante
     */
    scrollToRow(row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        row.classList.add('highlight-flash');
        setTimeout(() => row.classList.remove('highlight-flash'), 2000);
    }

    /**
     * Met en surbrillance l'item sélectionné dans la timeline
     */
    highlightItem(selectedItem) {
        this.container.querySelectorAll('.timeline-item').forEach(item => {
            item.classList.remove('active');
        });
        selectedItem.classList.add('active');
    }
}

// Global function called by index.html modal
window.selectionnerTypeActivite = function (typeId) {
    const dropzoneTbody = document.getElementById('dropzone');
    const indexToInsert = timeline ? timeline.insertionIndex : null;

    let nouvelleLigne;
    const rows = Array.from(dropzoneTbody.querySelectorAll('tr.ligne'));

    if (indexToInsert !== null && indexToInsert < rows.length) {
        nouvelleLigne = dropzoneTbody.insertRow(rows[indexToInsert].sectionRowIndex);
    } else {
        nouvelleLigne = dropzoneTbody.insertRow();
    }

    // Reset l'index d'insertion
    if (timeline) timeline.insertionIndex = null;

    // Récupérer le mot-clé saisi dans la modale si présent
    const modalCards = document.querySelectorAll('#activityTypeModal .activity-type-card');
    let keyword = "";
    if (modalCards[typeId - 1]) {
        const input = modalCards[typeId - 1].querySelector('.keyword-modal-input');
        if (input) {
            keyword = input.value;
            input.value = ""; // Reset pour la prochaine fois
        }
    }

    if (typeof window.creerContenuLigne === 'function') {
        window.creerContenuLigne(nouvelleLigne, typeId.toString(), "", keyword);
        if (typeof actugraph === 'function') actugraph();

        // Attendre que le debounce de l'observer se soit terminé avant de rafraîchir
        // les boutons d'insertion pour éviter une deuxième boucle de mutations.
        setTimeout(() => {
            if (window.refreshTableInsertionButtons) window.refreshTableInsertionButtons();
        }, 200);

        // Scroller vers la nouvelle ligne
        nouvelleLigne.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        console.error("Fonction creerContenuLigne non trouvée");
    }
};

// Instance globale
let timeline;
document.addEventListener('DOMContentLoaded', () => {
    window.timeline = new Timeline();
    timeline = window.timeline; // Alias local pour compatibilité

    // Si on clique sur le bouton "Ajouter une activité" principal, on insère à la fin
    const mainAddBtn = document.querySelector('[data-bs-target="#activityTypeModal"]');
    if (mainAddBtn) {
        mainAddBtn.addEventListener('click', () => {
            if (window.timeline) window.timeline.insertionIndex = null;
        });
    }
});
