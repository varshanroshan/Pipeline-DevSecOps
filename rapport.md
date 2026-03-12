# Rapport de Projet DevSecOps

**Auteur** : Varshan Roshan
**Référentiel GitHub** : [varshanroshan/Pipeline-DevSecOps](https://github.com/varshanroshan/Pipeline-DevSecOps)

## 1. Introduction
Ce projet avait pour objectif de mettre en place un pipeline CI/CD sécurisé en appliquant les principes DevSecOps à une application Node.js initialement vulnérable. Le travail a consisté à identifier les failles existantes grâce à divers outils d'analyse (SAST, SCA, scan de conteneur, etc.), puis à apporter les correctifs nécessaires pour obtenir un pipeline d'intégration continue entièrement vert et sans vulnérabilité critique.

## 2. Vulnérabilités trouvées (Avant)
L'application vulnérable souffrait de multiples défauts de sécurité, détectés par les outils automatiques de notre pipeline GitHub Actions :

- **SAST (Semgrep)** :
  - **Secrets hardcodés** : Présence de clés `DB_CONNECTION`, `STRIPE_SECRET_KEY`, `SENDGRID_API_KEY`, et `JWT_SECRET` en clair dans le code source (`server.js`).
  - **Manque de validation** : Les endpoints ne disposaient d'audune validation des entrées utilisateur, permettant des injections et des requêtes malformées.
- **SCA (npm audit)** :
  - **Dépendances obsolètes** : Des versions anciennes de `express` (4.17.1) et `jsonwebtoken` (8.5.1) présentaient des CVE connues (CVE de type Cross-Site Scripting, prototype pollution, etc.).
- **Détection de Secrets (Gitleaks)** :
  - Alertes levées par rapport à la présence des tokens Stripe et Sendgrid directements committés.
- **Conteneur (Trivy)** :
  - **Vulnérabilités de l'image de base** : Utilisation de l'image Docker `node:14` désuète contenant plusieurs dizaines de vulnérabilités graves (OS et bibliothèques standard).
  - **Exécution en root** : L'application fonctionnait en tant qu'utilisateur `root` par défaut.

## 3. Corrections Appliquées (Après)
Afin de sécuriser l'application de bout-en-bout :

- **Mise à jour et sécurité des dépendances** : Passage à `express` ^4.18.2 et `jsonwebtoken` ^9.0.2. Ajout des librairies essentielles comme `helmet` (sécurisation des entêtes HTTP), `express-rate-limit` (protection contre le brute force), et `express-validator` (validation stricte des entrées).
- **Assainissement du Code** :
  - Remplacement de tous les secrets en dur par l'utilisation de variables d'environnement centralisées (fichier `.env` avec modèle `.env.example`).
  - Validation minutieuse sur l'endpoint `/api/login` pour s'assurer que les chaînes soient conformes, sans espaces inutiles, et de la bonne longueur.
- **Infrastructure Sécurisée (Docker)** :
  - Bascule vers l'image `node:22-alpine`, qui minimise considérablement la surface d'attaque.
  - Création d'un utilisateur non-root restreint (`nodejs`).
  - Ajout d'une directive `HEALTHCHECK` et installation sélective uniquement pour la production via `npm ci --only=production`.

## 4. Métriques et Statistiques
| Outil | Vulnérabilités (Avant) | Vulnérabilités (Après) |
|---|---|---|
| **Semgrep (SAST)** | > 5 | 0 |
| **npm audit (SCA)** | > 10 (Plusieurs High/Critical) | 0 |
| **Gitleaks (Secrets)** | > 3 secrets détectés | 0 (via historique nettoyé / réécriture) |
| **Trivy (Conteneur)** | > 50 (OS et dépendances Debian 10) | 0 (Image Alpine propre) |

*Le pipeline de validation a bloqué les commits lors du premier push, jusqu'à ce que `0` vulnérabilité `CRITICAL` ne soit tolérée.*

## 5. Leçons Apprises
- **Shift-Left Security** : Résoudre les vulnérabilités le plus tôt possible dans la phase de développement (avant même le merge sur la branche principale) coûte nettement moins cher en temps et en risque que corriger une fois en production.
- **Moindre Privilège** : Écrire un Dockerfile efficace requiert toujours de renoncer à l'utilisateur root par défaut.
- **Automatisation** : Le recours à un pipeline unifié avec des outils standards (Trivy, Semgrep, Gitleaks, CodeQL) garantit une hygiène de sécurité continue et évite l'oubli humain.
