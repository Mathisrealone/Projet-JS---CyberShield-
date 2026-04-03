/**
 * Reset Dashboard - Remise à zéro des données CyberShield
 * N'altère pas la logique des autres modules.
 */

(function () {
	function getCyberShieldKeys() {
		const keys = [];

		for (let i = 0; i < localStorage.length; i += 1) {
			const key = localStorage.key(i);
			if (!key) continue;

			if (key.startsWith("cybershield")) {
				keys.push(key);
			}
		}

		return keys;
	}

	function resetDashboardValuesInDom() {
		const quizScore = document.getElementById("quiz-score");
		const passwordStrength = document.getElementById("password-strength");
		const phishingRate = document.getElementById("phishing-rate");
		const newsCount = document.getElementById("news-count");

		if (quizScore) quizScore.textContent = "0%";
		if (passwordStrength) passwordStrength.textContent = "-";
		if (phishingRate) phishingRate.textContent = "0%";
		if (newsCount) newsCount.textContent = "0";
	}

	function clearCyberShieldData() {
		const keys = getCyberShieldKeys();
		keys.forEach((key) => localStorage.removeItem(key));
	}

	function handleResetClick() {
		const confirmed = window.confirm(
			"Voulez-vous vraiment remettre à zéro toutes les données du tableau de bord ?",
		);
		if (!confirmed) return;

		clearCyberShieldData();
		resetDashboardValuesInDom();

		window.dispatchEvent(new Event("data-updated"));
		alert("Le tableau de bord a été remis à zéro.");
	}

	function initResetButton() {
		const resetButton = document.getElementById("resetDashboardBtn");
		if (!resetButton) return;

		resetButton.addEventListener("click", handleResetClick);
	}

	document.addEventListener("DOMContentLoaded", initResetButton);
})();
