/**
 * Navigation - Système de gestion des onglets (tabs)
 * Gère le changement d'onglets sans rechargement de page
 */

class TabNavigator {
	constructor() {
		this.currentTab = "home";
		this.init();
	}

	init() {
		this.attachTabListeners();
		this.attachQuickNavigationListeners();
		// Afficher l'onglet par défaut
		this.showTab("home");
	}

	/**
	 * Attacher les écouteurs aux boutons d'onglets
	 */
	attachTabListeners() {
		const tabButtons = document.querySelectorAll(".tab-btn");

		tabButtons.forEach((btn) => {
			btn.addEventListener("click", (e) => {
				const tabName = btn.getAttribute("data-tab");
				this.showTab(tabName);
			});
		});
	}

	/**
	 * Attacher les écouteurs pour les liens internes de navigation
	 * (ex: boutons du dashboard avec data-open-tab="quiz")
	 */
	attachQuickNavigationListeners() {
		const quickNavButtons = document.querySelectorAll("[data-open-tab]");

		quickNavButtons.forEach((btn) => {
			btn.addEventListener("click", (e) => {
				e.preventDefault();
				const tabName = btn.getAttribute("data-open-tab");
				if (tabName) {
					this.showTab(tabName);
				}
			});
		});
	}

	/**
	 * Afficher un onglet spécifique
	 * @param {string} tabName - Nom de l'onglet (ex: 'home', 'password', etc.)
	 */
	showTab(tabName) {
		// Masquer tous les onglets
		const allTabs = document.querySelectorAll(".tab-content");
		allTabs.forEach((tab) => tab.classList.remove("active"));

		// Désactiver tous les boutons
		const allButtons = document.querySelectorAll(".tab-btn");
		allButtons.forEach((btn) => btn.classList.remove("active"));

		// Afficher l'onglet demandé
		const targetTab = document.getElementById(tabName + "-tab");
		if (targetTab) {
			targetTab.classList.add("active");
		}

		// Activer le bouton correspondant
		const targetButton = document.querySelector(`[data-tab="${tabName}"]`);
		if (targetButton) {
			targetButton.classList.add("active");
		}

		this.currentTab = tabName;

		// Notifier les autres modules du changement d'onglet
		window.dispatchEvent(
			new CustomEvent("tab-changed", { detail: { tab: tabName } }),
		);
	}

	/**
	 * Obtenir l'onglet actuellement affiché
	 */
	getCurrentTab() {
		return this.currentTab;
	}
}

// Instanciation globale
const tabNavigator = new TabNavigator();

// Initialiser au chargement du DOM
document.addEventListener("DOMContentLoaded", () => {
	console.log("✅ Navigation par onglets initialisée");
});
