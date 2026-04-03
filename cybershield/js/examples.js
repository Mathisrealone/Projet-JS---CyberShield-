/**
 * EXEMPLE D'UTILISATION - Comment intégrer les modules
 *
 * Ce fichier démontre comment utiliser le DataManager et le système de tabs
 */

// ============================================================================
// EXEMPLE 1: Ajouter un score de quiz et mettre à jour le dashboard
// ============================================================================

function exempleQuiz() {
	// Simuler un score de quiz
	const score = 85; // en pourcentage

	// Sauvegarder via le DataManager
	dataManager.addQuizScore(score);

	// Notifier le dashboard de la mise à jour
	window.dispatchEvent(new Event("data-updated"));

	console.log("Quiz score sauvegardé:", score);
	console.log("Moyenne actuelle:", dataManager.getQuizAverageScore());
}

// ============================================================================
// EXEMPLE 2: Récupérer et afficher les données du dashboard
// ============================================================================

function afficherStatistiques() {
	const stats = {
		quizScore: dataManager.getQuizAverageScore(),
		passwordStrength: dataManager.getPasswordStrength(),
		phishingRate: dataManager.getPhishingRate(),
		emailsAnalyzed: dataManager.getTotalEmailsAnalyzed(),
		newsCount: dataManager.getNewsCount(),
	};

	console.log("📊 Statistiques actuelles:", stats);
}

// ============================================================================
// EXEMPLE 3: Mettre en cache des actualités
// ============================================================================

function exempleNews() {
	const articles = [
		{
			title: "Nouvelle faille zéro-day découverte",
			description: "Les chercheurs en sécurité ont découvert...",
			source: { name: "SecurityDaily" },
			url: "https://example.com/article1",
		},
		{
			title: "MFA devient obligatoire pour les entreprises",
			description: "Les nouvelles régulations imposent...",
			source: { name: "TechNews" },
			url: "https://example.com/article2",
		},
	];

	// Mettre en cache
	dataManager.cacheNews(articles);

	// Vérifier le cache
	console.log("Actualités en cache:", dataManager.getCachedNews());
	console.log("Nombre d'actualités:", dataManager.getNewsCount());

	// Notifier le dashboard
	window.dispatchEvent(new Event("data-updated"));
}

// ============================================================================
// EXEMPLE 4: Gérer les analyses de phishing
// ============================================================================

function exemplePhishing() {
	// Ajouter plusieurs analyses
	dataManager.addPhishingAnalysis(false); // Email légitime
	dataManager.addPhishingAnalysis(true); // Email malveillant
	dataManager.addPhishingAnalysis(false);
	dataManager.addPhishingAnalysis(true);

	console.log("Total e-mails analysés:", dataManager.getTotalEmailsAnalyzed());
	console.log("Taux de phishing:", dataManager.getPhishingRate() + "%");

	// Notifier le dashboard
	window.dispatchEvent(new Event("data-updated"));
}

// ============================================================================
// EXEMPLE 5: Naviguer entre les onglets programmatiquement
// ============================================================================

function allerAuQuiz() {
	// Afficher l'onglet du quiz
	tabNavigator.showTab("quiz"); // Remplacer par le bon nom d'onglet
}

function allerAuPassword() {
	tabNavigator.showTab("password");
}

function allerAuTableaudeBord() {
	tabNavigator.showTab("home");
}

// ============================================================================
// EXEMPLE 6: Écouter les changements d'onglets
// ============================================================================

window.addEventListener("tab-changed", (event) => {
	const tab = event.detail.tab;
	console.log("🔄 Onglet actif:", tab);

	if (tab === "home") {
		// Rafraîchir le dashboard quand on le visite
		dashboard.refresh();
	}
});

// ============================================================================
// EXEMPLE 7: Écouter les mises à jour de données
// ============================================================================

window.addEventListener("data-updated", () => {
	console.log("📡 Données mises à jour");
	// Le dashboard se met à jour automatiquement
});

// ============================================================================
// EXEMPLE 8: Effacer toutes les données (réinitialisation)
// ============================================================================

function reinitialiserDonnees() {
	if (confirm("Êtes-vous sûr de vouloir effacer toutes les données ?")) {
		dataManager.clear();
		dashboard.refresh();
		console.log("✅ Données réinitialisées");
	}
}

// ============================================================================
// EXEMPLE 9: Récupérer directement depuis localStorage
// ============================================================================

function consulterLocalStorage() {
	// Récupérer avec valeur par défaut
	const scores = dataManager.get("quiz-scores", []);
	const password = dataManager.get("password-last-strength", "Aucune");

	console.log("Scores de quiz:", scores);
	console.log("Dernière force de mot de passe:", password);
}

// ============================================================================
// TESTS - À exécuter dans la console du navigateur
// ============================================================================

/*

// Test 1: Ajouter un quiz score
exempleQuiz();
exempleQuiz(); // Ajouter un autre score
afficherStatistiques();

// Test 2: Mettre en cache des actualités
exempleNews();

// Test 3: Simuler des analyses de phishing
exemplePhishing();

// Test 4: Consulter localStorage
consulterLocalStorage();

// Test 5: Naviguer entre les onglets
allerAuPassword();
allerAuTableaudeBord();

// Test 6: Réinitialiser (attention!)
// reinitialiserDonnees();

*/
