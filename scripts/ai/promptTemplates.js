/**
 * Templates de prompts pour la génération de séquences pédagogiques
 * Basé sur la taxonomie ABC Learning Design (Diana Laurillard)
 */

/**
 * Contexte pédagogique ABC Learning Design
 * À inclure dans tous les prompts pour garantir la cohérence
 */
const ABC_LD_CONTEXT = `
Tu es un expert en ingénierie pédagogique spécialisé dans la méthode ABC Learning Design.

## Taxonomie ABC Learning Design (6 types d'apprentissage)

1. **ACQUISITION** (Fondations)
   - Rôle : L'apprenant écoute, lit, observe
   - Exemples : Vidéos de cours, lectures, podcasts, démonstrations
   - Outils Moodle : Fichier, Dossier, URL, Étiquette, Page, Livre
   - H5P : Course Presentation, Dialog Cards, Image Hotspots
   - Externes : PeerTube, YouTube, Classe virtuelle

2. **ENQUÊTE** (Exploration)
   - Rôle : L'apprenant recherche, explore, analyse
   - Exemples : Webquests, analyse de cas, recherche documentaire
   - Outils Moodle : Fichier, Dossier, URL, Sondage, Feedback
   - H5P : Cornell Notes
   - Externes : Bases de données, outils de recherche

3. **DISCUSSION** (Échange)
   - Rôle : L'apprenant partage, débat, clarifie
   - Exemples : Forums, sessions Q/R, débats
   - Outils Moodle : Forum, Chat, Sticky notes, Nuage de mots
   - Externes : Classe virtuelle, Digistorm

4. **COLLABORATION** (Construction)
   - Rôle : L'apprenant travaille en équipe, co-crée
   - Exemples : Projets de groupe, wikis, productions communes
   - Outils Moodle : Galerie d'images, Glossaire, Devoir (en groupe), Tableau, Wiki
   - Externes : Pad collaboratif, Carte mentale collaborative, Tableau blanc

5. **PRATIQUE/ENTRAÎNEMENT** (Application)
   - Rôle : L'apprenant s'entraîne, reçoit du feedback
   - Exemples : Quiz formatifs, exercices, simulations
   - Outils Moodle : Test (formatif), Jeu, Paquetage Scorm
   - H5P : Question Set, Interactive Video, Flashcards
   - Externes : Exerciseurs en ligne, Simulateurs

6. **PRODUCTION** (Création)
   - Rôle : L'apprenant crée, démontre son savoir
   - Exemples : Rapports, présentations, projets finaux
   - Outils Moodle : Devoir, Base de données
   - H5P : Audio recorder, Essay
   - Externes : Classe virtuelle (oral), Carte mentale, Éditeur de code

## Principes clés
- Équilibrer les 6 types d'apprentissage dans une séquence
- Commencer par Acquisition/Enquête (fondations)
- Alterner entre activités individuelles et collectives
- Prévoir des évaluations formatives (Pratique) avant sommatives (Production)
- Adapter les outils au contexte (présentiel/distanciel)
`;

/**
 * Prompt pour générer une séquence complète
 */
const GENERATE_SEQUENCE_PROMPT = (params) => `
${ABC_LD_CONTEXT}

## Mission
Génère une séquence pédagogique complète et équilibrée basée sur les informations suivantes :

**Objectifs d'apprentissage :**
${params.objectifs}

**Niveau du public :**
${params.niveau || 'Non spécifié'}

**Durée totale :**
${params.duree} minutes

**Domaine/Discipline :**
${params.domaine || 'Non spécifié'}

**Modalités :**
${params.modalites || 'Mixte (présentiel/distanciel)'}

**Contraintes spécifiques :**
${params.contraintes || 'Aucune'}

## Format de réponse attendu

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown, sans \`\`\`json) contenant un tableau "activites" :

{
  "activites": [
    {
      "type": "Acquisition|Enquête|Discussion|Collaboration|Pratique|Production",
      "objectif": "Objectif spécifique de cette activité",
      "outil": "Nom de l'outil Moodle/H5P/Externe",
      "consignes": "Consignes claires pour l'apprenant",
      "duree": 15,
      "modalite": "Présentiel|Distanciel|Hybride",
      "organisation": "Individuel|Binôme|Petit groupe|Classe entière",
      "evaluation": "Aucune|Formative|Sommative",
      "ressources": "Ressources nécessaires"
    }
  ],
  "equilibre": {
    "Acquisition": 2,
    "Enquête": 1,
    "Discussion": 1,
    "Collaboration": 1,
    "Pratique": 2,
    "Production": 1
  },
  "recommandations": "Conseils pédagogiques pour cette séquence"
}

## Consignes importantes

1. **Équilibre** : Varie les types d'apprentissage (pas plus de 40% d'un seul type)
2. **Progression** : Commence par Acquisition/Enquête, termine par Production
3. **Durée** : La somme des durées doit correspondre à ${params.duree} minutes (±10%)
4. **Outils** : Privilégie les outils gratuits et accessibles (Moodle, H5P)
5. **Évaluation** : Prévois au moins une évaluation formative avant la sommative
6. **Cohérence** : Chaque activité doit contribuer aux objectifs d'apprentissage
7. **Modalités** : Adapte les outils aux modalités demandées
8. **Nombre d'activités** : Entre 5 et 12 activités selon la durée

Génère maintenant la séquence en JSON :
`;

/**
 * Prompt pour améliorer des objectifs pédagogiques
 */
const IMPROVE_OBJECTIVES_PROMPT = (objectif) => `
${ABC_LD_CONTEXT}

## Mission
Améliore l'objectif pédagogique suivant en utilisant la taxonomie de Bloom et les principes ABC Learning Design.

**Objectif initial :**
${objectif}

## Format de réponse attendu

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown) :

{
  "objectif_ameliore": "Version améliorée de l'objectif (verbe d'action + contenu + contexte)",
  "niveau_bloom": "Se souvenir|Comprendre|Appliquer|Analyser|Évaluer|Créer",
  "types_abc_suggeres": ["Acquisition", "Pratique", "Production"],
  "justification": "Explication des améliorations apportées"
}

## Critères d'un bon objectif

1. **Verbe d'action mesurable** (selon Bloom)
2. **Contenu précis** (ce qui doit être appris)
3. **Contexte ou condition** (dans quelle situation)
4. **Niveau approprié** au public cible
5. **Alignement ABC LD** : suggère les types d'apprentissage pertinents

Exemples de transformation :
- ❌ "Apprendre Python" 
- ✅ "Être capable de créer un script Python simple pour automatiser une tâche répétitive"

- ❌ "Connaître la photosynthèse"
- ✅ "Expliquer le processus de photosynthèse en identifiant les réactifs et produits"

Améliore maintenant l'objectif en JSON :
`;

/**
 * Prompt pour analyser une séquence existante
 */
const ANALYZE_SEQUENCE_PROMPT = (sequence) => `
${ABC_LD_CONTEXT}

## Mission
Analyse la séquence pédagogique suivante et fournis des recommandations d'amélioration.

**Séquence à analyser :**
${JSON.stringify(sequence, null, 2)}

## Format de réponse attendu

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown) :

{
  "score_equilibre": 75,
  "repartition": {
    "Acquisition": 30,
    "Enquête": 10,
    "Discussion": 15,
    "Collaboration": 10,
    "Pratique": 20,
    "Production": 15
  },
  "points_forts": [
    "Bonne progression pédagogique",
    "Variété des outils utilisés"
  ],
  "points_amelioration": [
    "Manque d'activités d'enquête (seulement 10%)",
    "Trop d'acquisition au début (30%)"
  ],
  "suggestions": [
    {
      "type": "Enquête",
      "position": "après activité 2",
      "description": "Ajouter une activité de recherche documentaire",
      "outil_suggere": "Sondage ou Feedback"
    }
  ],
  "coherence_objectifs": "Bonne|Moyenne|Faible - Justification",
  "charge_cognitive": "Faible|Moyenne|Élevée - Justification",
  "recommandations_generales": "Conseils pour améliorer la séquence"
}

## Critères d'analyse

1. **Équilibre ABC LD** : Répartition des 6 types (idéal : 15-25% chacun)
2. **Progression pédagogique** : Acquisition → Pratique → Production
3. **Cohérence objectifs-activités** : Alignement avec les objectifs
4. **Charge cognitive** : Alternance activités légères/lourdes
5. **Évaluation** : Présence d'évaluations formatives et sommatives
6. **Modalités** : Équilibre individuel/collectif, présentiel/distanciel

Analyse maintenant la séquence en JSON :
`;

/**
 * Prompt pour suggérer des activités complémentaires
 */
const SUGGEST_ACTIVITIES_PROMPT = (context) => `
${ABC_LD_CONTEXT}

## Mission
Suggère 3 activités complémentaires pour enrichir la séquence en cours.

**Contexte :**
- Objectifs : ${context.objectifs}
- Types déjà présents : ${context.typesPresents.join(', ')}
- Types manquants : ${context.typesManquants.join(', ')}
- Durée disponible : ${context.dureeDisponible} minutes

## Format de réponse attendu

Réponds UNIQUEMENT avec un objet JSON valide (sans markdown) :

{
  "suggestions": [
    {
      "type": "Type d'apprentissage ABC LD",
      "titre": "Titre court de l'activité",
      "objectif": "Objectif spécifique",
      "outil": "Outil recommandé",
      "duree": 20,
      "justification": "Pourquoi cette activité est pertinente"
    }
  ]
}

Suggère maintenant 3 activités en JSON :
`;

/**
 * Prompt pour générer une check-list enseignant
 */
const GENERATE_CHECKLIST_PROMPT = (sequenceInfo, activites, options = {}) => {
  const detailLevel = options.detailLevel || 'standard';
  const formatType = options.formatType || 'simple';
  const startTime = options.startTime || '09:00';
  const sections = options.sections || { avant: true, deroulement: true, apres: true, attention: true };

  // Instructions selon le niveau de détail
  const detailInstructions = {
    synthetique: 'Génère une check-list TRÈS CONCISE avec seulement les points essentiels. Maximum 3-4 points par activité.',
    standard: 'Génère une check-list équilibrée avec les points clés et actions concrètes.',
    detaille: 'Génère une check-list DÉTAILLÉE avec exemples, conseils pédagogiques, erreurs courantes à éviter, et suggestions d\'adaptation.'
  };

  // Instructions selon le format
  const formatInstructions = {
    simple: `Format CHECK-LIST SIMPLE :
- Points d'action directs et concis
- Pas de contexte ou d'explications supplémentaires
- Juste ce qu'il faut faire, étape par étape
- Format : liste à puces avec cases à cocher`,

    complet: `Format GUIDE COMPLET PÉDAGOGIQUE :
- OBLIGATOIRE : Ajouter un encadré "📚 Contexte pédagogique" avant chaque activité
- OBLIGATOIRE : Ajouter une section "💡 Conseils de l'enseignant" avec astuces pratiques
- OBLIGATOIRE : Ajouter une section "🔄 Variantes possibles" avec alternatives
- OBLIGATOIRE : Ajouter une section "⚠️ Pièges à éviter" avec erreurs courantes
- OBLIGATOIRE : Suggérer des ressources complémentaires
- Le guide doit être 2-3 fois plus long que la check-list simple`
  };

  return `
${ABC_LD_CONTEXT}

## Mission
Génère une check-list d'action détaillée pour un enseignant qui va animer cette séquence pédagogique.

**IMPORTANT** : La check-list doit se concentrer sur les **points matières** et les **mises en activité concrètes des étudiants**, PAS sur des actions génériques comme "circuler dans la classe" ou "vérifier que les étudiants suivent".

**NIVEAU DE DÉTAIL** : ${detailInstructions[detailLevel]}

**FORMAT REQUIS** : ${formatInstructions[formatType]}

${formatType === 'complet' ? `
## ⚠️ ATTENTION - FORMAT GUIDE COMPLET
Vous DEVEZ inclure pour CHAQUE activité :
1. Un encadré "📚 Contexte pédagogique" expliquant le pourquoi
2. Une section "💡 Conseils de l'enseignant" avec 2-3 astuces pratiques
3. Une section "🔄 Variantes possibles" avec au moins 2 alternatives
4. Une section "⚠️ Pièges à éviter" avec erreurs courantes
5. Des suggestions de ressources complémentaires

Le guide complet doit être SIGNIFICATIVEMENT plus riche que la simple check-list.
` : ''}

## INFORMATIONS DE LA SÉQUENCE

**Nom :** ${sequenceInfo.name || 'Séquence pédagogique'}
**Objectifs :** ${sequenceInfo.objectives || 'Non spécifiés'}
**Niveau :** ${sequenceInfo.level || 'Non spécifié'}
**Durée totale :** ${sequenceInfo.duration || 'Non spécifiée'} minutes
**Public :** ${sequenceInfo.audience || 'Non spécifié'}
**Prérequis :** ${sequenceInfo.prerequisites || 'Non spécifiés'}
**Heure de début :** ${startTime}

## ACTIVITÉS PRÉVUES

${activites.map((act, i) => `
### Activité ${i + 1} - [${act.type}] (${act.duree} min)
- **Objectif :** ${act.objectif}
- **Outil :** ${act.outil}
- **Consignes :** ${act.consignes}
- **Modalité :** ${act.modalite}
- **Évaluation :** ${act.evaluation}
`).join('\n')}

## FORMAT DE RÉPONSE

${formatType === 'simple' ? `
Génère une CHECK-LIST SIMPLE en Markdown :

\`\`\`markdown
# ✅ CHECK-LIST ENSEIGNANT
## ${sequenceInfo.name || 'Séquence pédagogique'} - ${sequenceInfo.duration || 0} minutes

${sections.avant ? `### 📌 AVANT LA SÉANCE
- [ ] Point matériel/technique spécifique
- [ ] Point de préparation pédagogique spécifique
` : ''}
${sections.deroulement ? `### 🎓 DÉROULEMENT DE LA SÉANCE

#### ⏰ [HH:MM-HH:MM] : [Type] - [Titre activité]
- [ ] **Lancer l'activité :** [Action concrète]
- [ ] **Points clés à aborder :**
  - [Concept 1]
  - [Concept 2]
- [ ] **Mise en activité :** [Tâche étudiants]
- [ ] **Critères de réussite :** [Production attendue]
` : ''}
${sections.apres ? `### 📌 APRÈS LA SÉANCE
- [ ] Point de suivi
` : ''}
${sections.attention ? `### 💡 POINTS D'ATTENTION
⚠️ [Difficulté prévisible]
` : ''}\`\`\`
` : `
Génère un GUIDE COMPLET PÉDAGOGIQUE en Markdown :

\`\`\`markdown
# 📖 GUIDE PÉDAGOGIQUE COMPLET
## ${sequenceInfo.name || 'Séquence pédagogique'} - ${sequenceInfo.duration || 0} minutes

${sections.avant ? `### 📌 AVANT LA SÉANCE
- [ ] Point matériel/technique spécifique
- [ ] Point de préparation pédagogique spécifique
` : ''}
${sections.deroulement ? `### 🎓 DÉROULEMENT DE LA SÉANCE

#### ⏰ [HH:MM-HH:MM] : [Type] - [Titre activité]

**📚 Contexte pédagogique**
[Expliquer pourquoi cette activité, son rôle dans la progression]

**✅ Check-list d'action**
- [ ] **Lancer l'activité :** [Action concrète]
- [ ] **Points clés à aborder :**
  - [Concept 1 avec explication]
  - [Concept 2 avec explication]
- [ ] **Mise en activité :** [Tâche étudiants détaillée]
- [ ] **Critères de réussite :** [Production attendue avec exemples]

**💡 Conseils de l'enseignant**
- [Astuce pratique 1]
- [Astuce pratique 2]
- [Timing : comment gérer le temps]

**🔄 Variantes possibles**
- **Option A :** [Alternative 1]
- **Option B :** [Alternative 2]

**⚠️ Pièges à éviter**
- [Erreur courante 1 et comment l'éviter]
- [Erreur courante 2 et comment l'éviter]

**📚 Ressources complémentaires**
- [Ressource 1]
- [Ressource 2]

---
` : ''}
${sections.apres ? `### 📌 APRÈS LA SÉANCE
- [ ] Point de suivi
- [ ] Préparation prochaine séance
` : ''}
${sections.attention ? `### 💡 POINTS D'ATTENTION GÉNÉRAUX
⚠️ [Difficulté prévisible globale]
⚠️ [Point de vigilance]
` : ''}\`\`\`
`}

## CONSIGNES IMPORTANTES

1. **Focus contenu** : Chaque point doit mentionner les concepts, notions, compétences à travailler
2. **Actions concrètes** : Précise ce que les étudiants doivent FAIRE (créer, analyser, comparer, etc.)
3. **Critères de réussite** : Indique ce qui doit être produit/démontré par les étudiants
4. **Format horaire** : Utilise le format HH:MM-HH:MM en partant de ${startTime}
   - Convertis les durées cumulatives en heures
   - Exemple : Activité 1 (15 min) = ${startTime}-${addMinutes(startTime, 15)}, Activité 2 (20 min) = ${addMinutes(startTime, 15)}-${addMinutes(startTime, 35)}
5. **Points clés** : Liste les concepts/notions essentiels à aborder dans chaque activité
6. **Pas de généralités** : Évite "superviser", "circuler", "vérifier" sans préciser QUOI
${formatType === 'complet' ? `7. **GUIDE COMPLET OBLIGATOIRE** : 
   - Chaque activité DOIT avoir : Contexte pédagogique, Conseils, Variantes, Pièges à éviter, Ressources
   - Le guide doit être 2-3 fois plus long que la check-list simple
   - Sois TRÈS détaillé et pédagogique` : ''}

## EXEMPLES DE BONNES PRATIQUES

❌ **À ÉVITER :**
- "Circuler pour aider les étudiants"
- "Vérifier que tout le monde suit"
- "Superviser le travail de groupe"
- "0-15 min" ou "15-35 min" (format minutes)

✅ **À PRIVILÉGIER :**
- "Vérifier que les étudiants identifient correctement les 3 types de variables (int, float, string)"
- "S'assurer que chaque groupe a formulé au moins 2 hypothèses explicatives"
- "Valider que les étudiants appliquent la méthode QQOQCP dans leur analyse"
- "${startTime}-${addMinutes(startTime, 15)}" ou "${addMinutes(startTime, 15)}-${addMinutes(startTime, 35)}" (format horaire)

Génère maintenant la check-list en Markdown :
`;

  // Helper function to add minutes to time
  function addMinutes(time, minutes) {
    const [hours, mins] = time.split(':').map(Number);
    const totalMins = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMins / 60) % 24;
    const newMins = totalMins % 60;
    return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
  }
};

/**
 * Exporter les templates
 */
const PROMPT_TEMPLATES = {
  GENERATE_SEQUENCE: GENERATE_SEQUENCE_PROMPT,
  IMPROVE_OBJECTIVES: IMPROVE_OBJECTIVES_PROMPT,
  ANALYZE_SEQUENCE: ANALYZE_SEQUENCE_PROMPT,
  SUGGEST_ACTIVITIES: SUGGEST_ACTIVITIES_PROMPT,
  GENERATE_CHECKLIST: GENERATE_CHECKLIST_PROMPT,
  ABC_LD_CONTEXT
};
