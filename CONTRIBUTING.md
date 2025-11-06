# 🧭 Guide de mise à jour des versions – Projet Ifrit Ticket

Ce document explique comment **mettre à jour la version du projet** de manière cohérente, à la fois sur **GitHub** et dans les fichiers de configuration du projet (`package.json`, etc.).
L’objectif est de garder une **traçabilité claire** entre les versions, les branches et les déploiements.

---

## 📌 1. Principe de versionnage sémantique

Le projet suit la convention **[SemVer](https://semver.org/lang/fr/)** :

```bash
MAJEURE.MINOR.PATCH
```

* **MAJEURE (x.0.0)** → rupture de compatibilité (refonte, gros changement)
* **MINOR (1.x.0)** → ajout de fonctionnalités rétrocompatibles
* **PATCH (1.0.x)** → corrections de bugs ou petits ajustements

Exemples :

| Action                                                           | Nouvelle version |
| ---------------------------------------------------------------- | ---------------- |
| Première version stable                                          | `1.0.0`          |
| Ajout d’une nouvelle vue ou d’une feature (Docker, Kanban, etc.) | `1.1.0`          |
| Correction de bug sur une version stable                         | `1.0.1`          |

---

## ⚙️ 2. Mise à jour de la version locale

### 🔹 Si le projet est en **Node.js** (React, Vite, etc.)

1. Assure-toi d’être sur la branche `main` :

   ```bash
   git checkout main
   git pull origin main
   ```

2. Mets à jour la version avec :

   ```bash
   npm version <type>
   ```

   où `<type>` peut être :

   * `patch` → pour corriger un bug
   * `minor` → pour ajouter une fonctionnalité
   * `major` → pour un changement important

   Exemple :

   ```bash
   npm version minor
   ```

   Cela va :

   * Mettre à jour le champ `"version"` dans `package.json`
   * Créer un commit `v1.1.0`
   * Créer un tag Git `v1.1.0`

3. Pousse les changements vers GitHub :

   ```bash
   git push origin main --follow-tags
   ```

---

## 🏷️ 3. Création d’une version (release) sur GitHub

1. Va dans l’onglet **"Releases"** de ton dépôt GitHub.
2. Clique sur **"Draft a new release"**.
3. Sélectionne le tag créé (`v1.1.0`, `v1.0.1`, etc.).
4. Ajoute un titre et une description :

   * Titre : `v1.1.0 – Ajout de Docker Compose`
   * Notes de version : liste les nouveautés, correctifs, etc.
5. Clique sur **"Publish release"**.

> 💡 Cette étape te permet de marquer clairement les versions visibles dans l’historique GitHub, utiles pour les autres développeurs et pour le déploiement.

---

## 🧩 4. Cohérence entre fichiers et GitHub

* Toujours modifier la version **via la commande** (`npm version` ou équivalent Python)
  → Cela met à jour le fichier et crée automatiquement le tag Git.
* Ne **modifie jamais manuellement** le champ `"version"` dans le code sans créer de tag.
* Chaque version taguée sur GitHub doit correspondre à la version du fichier de configuration (`package.json`, etc.).

---

## 🧱 5. Exemple de workflow complet

```bash
# 1. Je merge ma feature dans main
git checkout main
git merge feature/kanban
git push origin main

# 2. Je teste et valide la version stable
npm run build
npm test

# 3. Je mets à jour la version
npm version minor

# 4. Je pousse la nouvelle version et le tag
git push origin main --follow-tags

# 5. Je crée une release GitHub à partir du tag v1.1.0
```

---

## 🔄 6. (Optionnel) Automatisation

Tu peux automatiser la création des versions avec :

* [`standard-version`](https://github.com/conventional-changelog/standard-version)
  → génère automatiquement la version et le changelog à partir des commits.
* [`semantic-release`](https://github.com/semantic-release/semantic-release)
  → gère la version, le tag, le changelog et la release GitHub automatiquement via CI/CD.

---

## 📘 7. Bonnes pratiques

* Toujours créer une **branche `feature/...`** pour les nouvelles fonctionnalités.
* Ne merge dans `main` que du code **stabilisé et testé**.
* Une **version stable (`v1.x.x`)** doit toujours être **déployable**.
* Ajouter un **CHANGELOG.md** pour suivre les évolutions si nécessaire.

---

✍️ **Exemple de description de release :**

> **v1.0.0 – Première version stable**
>
> * Visualisation des tickets (admin)
> * Création de tickets (client)
> * Vue Kanban fonctionnelle
> * Base prête pour intégration Docker

---

Souhaites-tu que je te fasse aussi la **version adaptée à ton projet précis (Ifrit Ticket)** avec les bonnes commandes `pnpm` et les sections déjà remplies (comme le changelog initial `v1.0.0`) ?
Ça rendrait ton README prêt à copier-coller dans ton dépôt.
