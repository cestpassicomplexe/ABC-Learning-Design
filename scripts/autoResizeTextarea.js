/**
 * Auto-resize textareas dans le tableau de scénario
 * Ajuste automatiquement la hauteur des textareas en fonction du contenu
 */

/**
 * Fonction pour auto-resize un textarea
 */
function autoResizeTextarea(textarea) {
    // Réinitialiser la hauteur pour recalculer
    textarea.style.height = 'auto';
    // Ajuster à la hauteur du contenu
    textarea.style.height = textarea.scrollHeight + 'px';
}

/**
 * Initialiser l'auto-resize pour tous les textareas du tableau
 */
function initAutoResizeTextareas() {
    const textareas = document.querySelectorAll('#tableau textarea, #dropzone textarea');

    textareas.forEach(textarea => {
        // Ajuster au chargement
        autoResizeTextarea(textarea);

        // Ajuster à chaque saisie
        textarea.addEventListener('input', function () {
            autoResizeTextarea(this);
        });

        // Ajuster au focus (au cas où le contenu a changé)
        textarea.addEventListener('focus', function () {
            autoResizeTextarea(this);
        });
    });
}

// Initialiser au chargement de la page
document.addEventListener('DOMContentLoaded', initAutoResizeTextareas);

// Observer les changements dans le tableau pour les nouvelles lignes
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Réinitialiser l'auto-resize pour les nouveaux textareas
            initAutoResizeTextareas();
        }
    });
});

// Observer le dropzone pour détecter les nouvelles lignes
const dropzone = document.getElementById('dropzone');
if (dropzone) {
    observer.observe(dropzone, {
        childList: true,
        subtree: true
    });
}
