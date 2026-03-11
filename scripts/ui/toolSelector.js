/**
 * Gestion de la sélection d'outils pédagogiques
 * Affiche les outils adaptés au type d'activité sélectionné
 */
class ToolSelector {
    constructor() {
        this.modal = null;
        this.currentRow = null;
        this.currentTypeId = null;

        // Configuration des outils par type d'activité
        // Les outils marqués 'novice: true' sont affichés en priorité ou exclusivement en mode Novice
        this.toolsConfig = {
            "1": { // Acquisition
                name: "Acquisition",
                description: "L’apprenant écoute un cours magistral, une conférence, un podcast ; lit un livre, une page web ; regarde des démonstrations, des vidéos.",
                activitesTypes: "Écouter l'enseignant, consulter des documents/articles, lire des ressources numériques, regarder des vidéos/animations, suivre des démonstrations.",
                moodle: [
                    { name: "Page", novice: true }, { name: "Livre", novice: true }, { name: "Fichier", novice: true },
                    { name: "Dossier", novice: true }, { name: "URL", novice: true }, { name: "Étiquette (Texte et média)", novice: true },
                    { name: "Glossaire (en lecture)", novice: true }, { name: "Leçon (mode linéaire)", novice: true }
                ],
                h5p: [
                    { name: "Course Presentation", novice: true }, { name: "Interactive Video", novice: true },
                    { name: "Image Hotspots", novice: true }, { name: "Iframe Embedder", novice: true }, { name: "Interactive Book", novice: true }
                ],
                microsoft: [
                    { name: "Stream (vidéos)", novice: true }, { name: "Sway", novice: true },
                    { name: "PowerPoint Live", novice: true }, { name: "SharePoint", novice: true }, { name: "OneDrive", novice: true }
                ],
                google: [
                    { name: "YouTube", novice: true }, { name: "Drive", novice: true },
                    { name: "Slides", novice: true }, { name: "Google Sites", novice: true }
                ],
                externes: [
                    { name: "PeerTube", novice: true }, { name: "Podcasts", novice: true },
                    { name: "Genially (mode présentation)", novice: true }, { name: "Perplexity (IA assistant)", novice: true }, { name: "Digiscreen (La Digitale)", novice: true }
                ]
            },
            "2": { // Collaboration
                name: "Collaboration",
                description: "Activités de discussion, de pratique et de production en équipe. Participer activement, dans un collectif, au processus de construction de la connaissance.",
                activitesTypes: "Projets en petits groupes, construction/élaboration d'une production commune, discussion autour des productions de tiers.",
                moodle: [
                    { name: "Wiki", novice: true }, { name: "Atelier (Workshop)", novice: true },
                    { name: "Devoir de groupe", novice: true }, { name: "Forum (mode groupes)", novice: true }, { name: "Base de données", novice: true }
                ],
                h5p: [
                    { name: "Contenus intégrés (Wiki/Forum)", novice: true }
                ],
                microsoft: [
                    { name: "Canaux de collaboration", novice: true }, { name: "Whiteboard", novice: true },
                    { name: "Co-édition Word/Excel/PPT", novice: true }, { name: "OneNote Class Notebook", novice: true }
                ],
                google: [
                    { name: "Google Docs/Sheets/Slides", novice: true }, { name: "Jamboard / FigJam", novice: true }, { name: "Dossiers Drive partagés", novice: true }
                ],
                externes: [
                    { name: "Digipad (La Digitale)", novice: true }, { name: "Padlet", novice: true },
                    { name: "Miro / Mural", novice: true }, { name: "Canva (mode équipe)", novice: true }, { name: "CryptPad", novice: true }
                ]
            },
            "3": { // Discussion
                name: "Discussion",
                description: "Apprendre par la discussion exige de l'apprenant qu'il formule ses idées et questions, qu'il écoute, remette en cause, réponde aux arguments et questions.",
                activitesTypes: "Communication synchrone et asynchrone, séminaires, remue-méninges, nuages de mots, commentaires.",
                moodle: [
                    { name: "Forum", novice: true }, { name: "Chat", novice: true },
                    { name: "Feedback", novice: true }, { name: "Nuage de mots", novice: true }, { name: "Sondage rapide", novice: true }
                ],
                h5p: [
                    { name: "Questionnaires avec feedback", novice: true }
                ],
                microsoft: [
                    { name: "Conversations Teams", novice: true }, { name: "Chat", novice: true },
                    { name: "Viva Engage", novice: true }, { name: "Flip (vidéo-discussion)", novice: true }
                ],
                google: [
                    { name: "Flux (Stream)", novice: true }, { name: "Google Meet (Q&A/sondages)", novice: true }
                ],
                externes: [
                    { name: "Wooclap", novice: true }, { name: "Mentimeter / Slido", novice: true },
                    { name: "Digitalk (La Digitale)", novice: true }, { name: "Discord / Slack", novice: true }
                ]
            },
            "4": { // Enquête
                name: "Enquête",
                description: "Explorer, comparer et critiquer les textes, documents et ressources qui renvoient aux concepts et idées enseignées.",
                activitesTypes: "Comparaison de textes, analyse d'informations, recherche et évaluation de données, observations de terrain, mise en relation d'idées.",
                moodle: [
                    { name: "Base de données", novice: true }, { name: "Glossaire (définitions)", novice: true },
                    { name: "Feedback / Questionnaire", novice: true }, { name: "URL (web-quest)", novice: true }
                ],
                h5p: [
                    { name: "Cornell Notes", novice: true }, { name: "Interactive Book", novice: true },
                    { name: "Agamotto (comparaison)", novice: true }, { name: "Structure Strip", novice: true }
                ],
                microsoft: [
                    { name: "Forms (enquêtes)", novice: true }, { name: "SharePoint Search", novice: true }, { name: "OneNote (notes recherche)", novice: true }
                ],
                google: [
                    { name: "Google Forms", novice: true }, { name: "Google Search", novice: true },
                    { name: "Google Arts & Culture", novice: true }, { name: "Google Earth", novice: true }
                ],
                externes: [
                    { name: "Digidoc (La Digitale)", novice: true }, { name: "Wikipedia", novice: true },
                    { name: "Zotero (bibliographie)", novice: true }, { name: "WolframAlpha", novice: true }, { name: "Perplexity IA", novice: true }
                ]
            },
            "5": { // Pratique
                name: "Pratique",
                description: "S'entraîner et utiliser la rétroaction (feedback) pour améliorer ses connaissances (enseignant, pairs ou activité elle-même).",
                activitesTypes: "Exercices, tests formatifs, simulations, laboratoires virtuels, jeux de rôles, études de cas.",
                moodle: [
                    { name: "Test (Quiz)", novice: true }, { name: "Leçon (parcours)", novice: true },
                    { name: "SCORM", novice: true }, { name: "Geogebra", novice: true }, { name: "H5P intégré", novice: true }
                ],
                h5p: [
                    { name: "Question Set", novice: true }, { name: "Flashcards", novice: true },
                    { name: "Drag and Drop", novice: true }, { name: "Speak the Words", novice: true }, { name: "Memory Game", novice: true },
                    { name: "Find the Hotspot", novice: true }, { name: "Fill in the Blanks", novice: true }
                ],
                microsoft: [
                    { name: "Forms (Quiz)", novice: true }, { name: "Devoirs (grilles éval)", novice: true }, { name: "Minecraft Education", novice: true }
                ],
                google: [
                    { name: "Google Forms (Quiz)", novice: true }, { name: "Assessments / Devoirs", novice: true }
                ],
                externes: [
                    { name: "LearningApps", novice: true }, { name: "Quizizz / Kahoot", novice: true },
                    { name: "Digiquiz (La Digitale)", novice: true }, { name: "Labster (simulations)", novice: true }
                ]
            },
            "6": { // Production
                name: "Production",
                description: "Consolider ce qui a été appris par une production sur des supports variés. Le formateur accompagne le processus.",
                activitesTypes: "Bilans, rapports, mémoires, maquettes, vidéos, présentations, portfolios, créations graphiques.",
                moodle: [
                    { name: "Devoir (dépôt)", novice: true }, { name: "Glossaire (articles)", novice: true },
                    { name: "Wiki (publication)", novice: true }, { name: "ePortfolio (Mahara)", novice: true }
                ],
                h5p: [
                    { name: "Audio Recorder", novice: true }, { name: "Documentation Tool", novice: true },
                    { name: "Essay (IA/feedback)", novice: true }, { name: "Timeline", novice: true }
                ],
                microsoft: [
                    { name: "Word / PowerPoint", novice: true }, { name: "Clipchamp", novice: true }, { name: "Publisher", novice: true }
                ],
                google: [
                    { name: "Google Docs / Slides", novice: true }, { name: "Google Sites (portfolio)", novice: true }, { name: "Google Drawings", novice: true }
                ],
                externes: [
                    { name: "Canva (infographies)", novice: true }, { name: "BookCreator", novice: true },
                    { name: "Digisteps (La Digitale)", novice: true }, { name: "OBS / CapCut / Audacity", novice: true }
                ]
            }
        };

        this.init();
    }

    init() {
        const modalEl = document.getElementById('toolSelectionModal');
        if (modalEl) {
            this.modal = new bootstrap.Modal(modalEl);
        }

        // On expose l'instance globalement
        window.toolSelector = this;
    }

    /**
     * Ouvre la modale pour une ligne spécifique
     * @param {HTMLElement} row - La ligne du tableau
     * @param {string} typeId - L'ID du type d'activité (1-6)
     */
    open(row, typeId) {
        this.currentRow = row;
        this.currentTypeId = typeId;

        const config = this.toolsConfig[typeId];
        if (!config) return;

        const mode = window.choixTypeCarte || 'Novice';

        // Mettre à jour le titre et la couleur du header
        const header = document.getElementById('tool-modal-header');
        header.className = `modal-header text-white card-${config.name.toLowerCase()}`;
        document.getElementById('toolSelectionModalLabel').innerHTML = `<i class="fa-solid fa-tools me-2"></i>Outils pour : ${config.name} (${mode})`;

        // Zone de description et activités types
        let descArea = document.getElementById('tool-type-info-area');
        if (!descArea) {
            descArea = document.createElement('div');
            descArea.id = 'tool-type-info-area';
            const modalBody = document.querySelector('#toolSelectionModal .modal-body');
            modalBody.insertBefore(descArea, modalBody.firstChild);
        }
        descArea.innerHTML = `
            <div class="alert alert-light border-0 py-2 mb-2 small">
                <div class="mb-1"><strong><i class="fa-solid fa-info-circle me-1"></i> Descriptif :</strong> ${config.description}</div>
                <div><strong><i class="fa-solid fa-bolt me-1"></i> Activités types :</strong> <span class="text-muted">${config.activitesTypes}</span></div>
            </div>
        `;

        // Remplir toutes les sections
        this.fillSection('moodle-tools', config.moodle, 'primary', mode);
        this.fillSection('h5p-tools', config.h5p, 'info', mode);
        this.fillSection('microsoft-tools', config.microsoft, 'secondary', mode);
        this.fillSection('google-tools', config.google, 'dark', mode);
        this.fillSection('externes-tools', config.externes, 'success', mode);

        this.modal.show();
    }

    /**
     * Remplit une section de la modale avec des boutons
     */
    fillSection(containerId, tools, btnClass, mode) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';

        // Filtrage en mode Novice
        const filteredTools = mode === 'Novice' ? tools.filter(t => t.novice) : tools;

        if (filteredTools.length === 0) {
            container.innerHTML = '<small class="text-muted italic">Aucun outil spécifique dans ce mode.</small>';
            return;
        }

        filteredTools.forEach(tool => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `btn btn-outline-${btnClass} btn-sm m-1`;

            const label = tool.name;
            const isNovice = tool.novice;

            btn.innerHTML = isNovice && mode === 'Expert' ? `<i class="fa-solid fa-star text-warning me-1"></i>${label}` : label;
            btn.onclick = () => this.selectTool(label);
            container.appendChild(btn);
        });
    }

    /**
     * Sélectionne un outil et met à jour le tableau
     */
    selectTool(toolName) {
        let finalToolName = toolName;

        if (toolName === 'Autre') {
            const personnalise = prompt("Précisez l'outil ou l'activité :", "");
            if (!personnalise) return;
            finalToolName = personnalise;
        }

        if (this.currentRow) {
            // Dans le tableau, la colonne Outil est l'index 3
            this.currentRow.cells[3].innerText = finalToolName;

            // Fermer la modale
            this.modal.hide();

            // Déclencher une mise à jour des graphes si nécessaire
            if (typeof actugraph === 'function') actugraph();
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    new ToolSelector();
});
