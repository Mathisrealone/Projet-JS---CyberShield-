/**
 * DataManager - Gestion centralisée des données via localStorage
 * Permet à tous les modules de persister et récupérer les données
 */

class DataManager {
	constructor() {
		this.storagePrefix = "cybershield-";
	}

	/**
	 * Sauvegarde une valeur dans localStorage
	 */
	set(key, value) {
		try {
			localStorage.setItem(this.storagePrefix + key, JSON.stringify(value));
		} catch (e) {
			console.error("Erreur localStorage (set):", e);
		}
	}

	/**
	 * Récupère une valeur depuis localStorage
	 */
	get(key, defaultValue = null) {
		try {
			const stored = localStorage.getItem(this.storagePrefix + key);
			return stored ? JSON.parse(stored) : defaultValue;
		} catch (e) {
			console.error("Erreur localStorage (get):", e);
			return defaultValue;
		}
	}

	/**
	 * QUIZ - Ajouter un score
	 */
	addQuizScore(score) {
		const scores = this.get("quiz-scores", []);
		scores.push({
			score: score,
			date: new Date().toISOString(),
		});
		this.set("quiz-scores", scores);
	}

	/**
	 * QUIZ - Obtenir le score moyen
	 */
	getQuizAverageScore() {
		const scores = this.get("quiz-scores", []);
		if (scores.length === 0) return 0;
		const sum = scores.reduce((acc, s) => acc + s.score, 0);
		return Math.round(sum / scores.length);
	}

	/**
	 * PASSWORD - Ajouter une analyse
	 */
	addPasswordAnalysis(strength, score) {
		this.set("password-last-strength", strength);
		this.set("password-last-score", score);

		const analyses = this.get("password-analyses", []);
		analyses.push({
			strength: strength,
			score: score,
			date: new Date().toISOString(),
		});
		// Garder seulement les 10 dernières
		if (analyses.length > 10) analyses = analyses.slice(-10);
		this.set("password-analyses", analyses);
	}

	/**
	 * PASSWORD - Obtenir la robustesse actuelle
	 */
	getPasswordStrength() {
		return this.get("password-last-strength", "-");
	}

	/**
	 * PHISHING - Ajouter une analyse
	 */
	addPhishingAnalysis(isPhishing) {
		const analyses = this.get("email-analyses", []);
		analyses.push({
			isPhishing: isPhishing,
			date: new Date().toISOString(),
		});
		this.set("email-analyses", analyses);
	}

	/**
	 * PHISHING - Calculer le taux de détection
	 */
	getPhishingRate() {
		const analyses = this.get("email-analyses", []);
		if (analyses.length === 0) return 0;
		const phishingCount = analyses.filter((a) => a.isPhishing).length;
		return Math.round((phishingCount / analyses.length) * 100);
	}

	/**
	 * PHISHING - Obtenir le total d'e-mails analysés
	 */
	getTotalEmailsAnalyzed() {
		const analyses = this.get("email-analyses", []);
		return analyses.length;
	}

	/**
	 * NEWS - Mettre en cache les actualités
	 */
	cacheNews(articles) {
		this.set("news-cache", articles.slice(0, 5)); // Garder max 5
	}

	/**
	 * NEWS - Récupérer les actualités en cache
	 */
	getCachedNews() {
		return this.get("news-cache", []);
	}

	/**
	 * NEWS - Compter le nombre d'actualités en cache
	 */
	getNewsCount() {
		const visibleCount = this.get("news-visible-count", null);
		if (typeof visibleCount === "number") return visibleCount;

		const news = this.get("news-cache", []);
		return news.length;
	}

	/**
	 * NEWS - Définir le nombre d'actualités visibles (après filtre)
	 */
	setVisibleNewsCount(count) {
		this.set("news-visible-count", Number(count) || 0);
	}

	/**
	 * NEWS - Définir les actualités actuellement visibles
	 */
	setVisibleNewsArticles(articles) {
		this.set("news-visible-articles", Array.isArray(articles) ? articles : []);
	}

	/**
	 * NEWS - Récupérer les actualités actuellement visibles
	 */
	getVisibleNewsArticles() {
		return this.get("news-visible-articles", []);
	}

	/**
	 * Effacer toutes les données
	 */
	clear() {
		for (let i = 0; i < localStorage.length; i++) {
			const key = localStorage.key(i);
			if (key && key.startsWith(this.storagePrefix)) {
				localStorage.removeItem(key);
			}
		}
	}
}

// Instanciation globale
const dataManager = new DataManager();
