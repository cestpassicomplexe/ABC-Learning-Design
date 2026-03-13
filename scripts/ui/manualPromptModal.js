document.addEventListener('DOMContentLoaded', () => {
    const manualPromptModalElement = document.getElementById('manualPromptModal');
    if (!manualPromptModalElement) return;

    const btnCopy = document.getElementById('btn-copy-mp');
    const resultPrompt = document.getElementById('mp-result-prompt');
    const copyAlert = document.getElementById('mp-copy-alert');

    // Mettre à jour le prompt quand on ouvre la modale
    manualPromptModalElement.addEventListener('show.bs.modal', function () {
        // Tenter de récupérer les infos de la séquence
        if (typeof sequenceInfo !== 'undefined' && sequenceInfo) {
            const data = sequenceInfo.getData();
            if (data.objectives) document.getElementById('mp-objectifs').value = data.objectives;
            if (data.level) document.getElementById('mp-niveau').value = data.level;
            if (data.duration) document.getElementById('mp-duree').value = data.duration;
            if (data.audience) document.getElementById('mp-domaine').value = data.audience;
        }

        // Tenter de récupérer la durée globale depuis la timeline si existant
        const dureeAffichee = document.getElementById('dureeGlobale')?.innerText;
        if (dureeAffichee && parseInt(dureeAffichee) > 0) {
           document.getElementById('mp-duree').value = parseInt(dureeAffichee);
        }

        updateManualPrompt();
    });

    // Mettre à jour au changement
    const inputs = ['#mp-objectifs', '#mp-niveau', '#mp-duree', '#mp-domaine', '#mp-contraintes'];
    inputs.forEach(selector => {
        document.querySelector(selector)?.addEventListener('input', updateManualPrompt);
    });

    // Mettre à jour au changement des cases à cocher
    document.querySelectorAll('.mp-modalite-opt, .mp-outil-opt').forEach(checkbox => {
        checkbox.addEventListener('change', updateManualPrompt);
    });

    // Fonction pour générer le prompt
    function updateManualPrompt() {
        const modalitesChecked = Array.from(document.querySelectorAll('.mp-modalite-opt:checked')).map(cb => cb.value);
        const outilsChecked = Array.from(document.querySelectorAll('.mp-outil-opt:checked')).map(cb => cb.value);

        const params = {
            objectifs: document.getElementById('mp-objectifs').value || "[INDIQUER LES OBJECTIFS ICI]",
            niveau: document.getElementById('mp-niveau').value || "[INDIQUER LE NIVEAU ICI]",
            duree: document.getElementById('mp-duree').value || "[DUREE]",
            domaine: document.getElementById('mp-domaine').value || "[DOMAINE]",
            modalites: modalitesChecked.join(', ') || "[MODALITÉS]",
            outils: outilsChecked.join(', ') || "[OUTILS]",
            contraintes: document.getElementById('mp-contraintes').value || "[CONTRAINTES]"
        };

        if (typeof PROMPT_TEMPLATES !== 'undefined' && PROMPT_TEMPLATES.GENERATE_SEQUENCE) {
            const promptText = PROMPT_TEMPLATES.GENERATE_SEQUENCE(params);
            resultPrompt.value = promptText.trim();
        } else {
            resultPrompt.value = "Erreur: Les templates de prompt ne sont pas chargés.";
        }
    }

    // Fonction de copie
    btnCopy?.addEventListener('click', () => {
        resultPrompt.select();
        resultPrompt.setSelectionRange(0, 99999); // Pour mobiles
        navigator.clipboard.writeText(resultPrompt.value).then(() => {
            copyAlert.classList.remove('d-none');
            setTimeout(() => {
                copyAlert.classList.add('d-none');
            }, 3000);
        }).catch(err => {
            console.error('Erreur lors de la copie', err);
            // Fallback
            document.execCommand('copy');
            copyAlert.classList.remove('d-none');
            setTimeout(() => {
                copyAlert.classList.add('d-none');
            }, 3000);
        });
    });
});
