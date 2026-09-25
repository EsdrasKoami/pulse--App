# INSTRUCTIONS DE LIVRAISON - PROJET PULSE (JUMELAGE CEGPTR)

**Équipe :** Pulse Team
**Date de remise :** 11 Mai 2026
**Membres :**
- KEREN LILIA BOMBO
- KOAMI ESDRAS AMEDJIKO
- GOUAM SILUE MYRIAM

---

## 📂 Contenu de la remise

Vous trouverez dans ce répertoire tous les éléments requis pour la remise finale du projet :

### 1. Rapports de Projet (Markdown & Word)
Chaque étudiant dispose d'un rapport complet en format Markdown et d'une version Word "Magnifique" avec logo et mise en page professionnelle :
- **KEREN LILIA BOMBO :** [LIVRABLE_BOMBO.md](./LIVRABLE_BOMBO.md) | [RAPPORT_FINAL_KEREN_LILIA_BOMBO.docx](./RAPPORT_FINAL_KEREN_LILIA_BOMBO.docx)
- **KOAMI ESDRAS AMEDJIKO :** [LIVRABLE_AMEDJIKO.md](./LIVRABLE_AMEDJIKO.md) | [RAPPORT_FINAL_KOAMI_ESDRAS_AMEDJIKO.docx](./RAPPORT_FINAL_KOAMI_ESDRAS_AMEDJIKO.docx)
- **GOUAM SILUE MYRIAM :** [LIVRABLE_MYRIAM.md](./LIVRABLE_MYRIAM.md) | [RAPPORT_FINAL_GOUAM_SILUE_MYRIAM.docx](./RAPPORT_FINAL_GOUAM_SILUE_MYRIAM.docx)

### 2. Document des Visuels (Word)
Un document complet, mis en page de manière premium, incluant la page de présentation en double exemplaire, la table des matières, l'état de livraison, toutes les captures d'écran des interfaces, et le guide utilisateur :
- **[LIVRABLE_VISUELS_FINAL_PULSE.docx](./LIVRABLE_VISUELS_FINAL_PULSE.docx)**

### 3. Application Fonctionnelle
L'application est prête pour le déploiement ou l'exécution locale :
- **Base de données :** Utilise SQLite (`database/database.sqlite`).
- **Données réalistes :** Chargeables via `php artisan migrate --seed`.
- **Plug-ins :** Toutes les dépendances sont listées dans `composer.json` et `package.json`.

---

## 🚀 Instructions d'installation rapide

1.  **Installation des dépendances :**
    ```bash
    composer install
    npm install
    ```
2.  **Configuration de l'environnement :**
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```
3.  **Initialisation de la base de données (avec données réalistes) :**
    ```bash
    php artisan migrate:fresh --seed
    ```
4.  **Lancement de l'application :**
    ```bash
    npm run dev
    ```
    L'application sera accessible sur `http://localhost:8000`.

---

## ⚠️ État du projet (Bugs & Incomplets)
Consultez la première page de chaque document de livrable pour la liste détaillée des éléments incomplets et des bugs identifiés.

---
*Document généré automatiquement le 11 Mai 2026 à 10:47.*
