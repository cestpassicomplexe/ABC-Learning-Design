# Sécurité et Gestion des Clés API

Ce document détaille les mesures de sécurité mises en place pour la gestion des clés API dans l'application ABC Learning Design, ainsi que les bonnes pratiques à suivre.

## 🔒 Stockage des Clés API

L'application fonctionne entièrement côté client (dans votre navigateur). Cela signifie que **votre clé API ne quitte jamais votre ordinateur** (sauf pour être envoyée aux serveurs de Google/OpenAI pour générer du contenu). Elle n'est jamais envoyée à nos serveurs ou à des tiers.

### Options de Stockage

L'application propose trois niveaux de stockage pour votre clé :

1.  **Session (Recommandé)** : La clé est stockée temporairement dans l'onglet du navigateur. Elle est effacée dès que vous fermez l'onglet ou le navigateur. C'est le meilleur compromis entre confort et sécurité.
2.  **Mémoire uniquement** : La clé est stockée dans la mémoire vive (RAM). Elle est effacée si vous rafraîchissez la page (F5). C'est l'option la plus sécurisée pour les ordinateurs publics.
3.  **Local (Persistant)** : La clé est stockée dans le navigateur de manière permanente. Elle reste disponible même après redémarrage.
    *   ⚠️ **Attention** : À n'utiliser que sur votre ordinateur personnel sécurisé par un mot de passe.
    *   Si quelqu'un accède à votre session Windows/Mac, il pourrait potentiellement récupérer la clé.

## 🛡️ Chiffrement

Actuellement, la clé est "obfusquée" (encodée en Base64) avant d'être stockée dans le navigateur.
*   **Note importante** : Ce n'est pas un chiffrement de niveau militaire. C'est une mesure pour éviter que la clé ne soit lisible en clair si quelqu'un regarde par-dessus votre épaule ou inspecte rapidement le navigateur.
*   Sans mot de passe maître (que vous devriez retenir), il est techniquement impossible de chiffrer parfaitement une donnée dans un navigateur de manière totalement autonome.

## ✅ Bonnes Pratiques

1.  **Ne partagez jamais votre clé API**.
2.  **N'écrivez jamais votre clé API directement dans le code** (fichiers `.js`, `.html`).
3.  Si vous utilisez un ordinateur partagé, utilisez le mode **"Mémoire uniquement"** ou **"Session"** et pensez à fermer le navigateur après usage.
4.  Si vous pensez que votre clé a été compromise, révoquez-la immédiatement sur la console de votre fournisseur (Google AI Studio, OpenAI Platform) et générez-en une nouvelle.

## 🚫 Ce que l'application NE FAIT PAS

*   Elle n'envoie **pas** vos données pédagogiques à des serveurs tiers autres que l'IA choisie.
*   Elle ne stocke **pas** vos clés sur un serveur distant.
*   Elle ne traque **pas** votre utilisation.
