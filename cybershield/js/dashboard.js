class Dashboard {
	constructor() {
		this.updateInterval = null;
	}

	init() {
		this.updateDisplay();

		window.addEventListener("tab-changed", (e) => {
			if (e.detail.tab === "home") {
				this.updateDisplay();
			}
		});

		window.addEventListener("data-updated", () => {
			this.updateDisplay();
		});
	}

	updateDisplay() {
		this.updateQuizScore();
		this.updatePasswordStrength();
		this.updatePhishingStats();
		this.updateNewsCount();
	}

	updateQuizScore() {
		const score = dataManager.getQuizAverageScore();
		const element = document.getElementById("quiz-score");
		if (element) {
			element.textContent = score + "%";
		}
	}

	updatePasswordStrength() {
		const strength = dataManager.getPasswordStrength();
		const element = document.getElementById("password-strength");
		if (element) {
			element.textContent = strength;
			// Colorer selon la robustesse
			if (strength.includes("Très Fort")) {
				element.style.color = "#27ae60";
			} else if (strength.includes("Moyen")) {
				element.style.color = "#f39c12";
			} else if (strength.includes("Faible") || strength === "-") {
				element.style.color = "#e74c3c";
			}
		}
	}

	updatePhishingStats() {
		const rate = dataManager.getPhishingRate();
		const total = dataManager.getTotalEmailsAnalyzed();

		const rateElement = document.getElementById("phishing-rate");
		if (rateElement) {
			rateElement.textContent = rate + "%";
		}
	}

	updateNewsCount() {
		const count = dataManager.getNewsCount();
		const element = document.getElementById("news-count");
		if (element) {
			element.textContent = count;
		}
	}

	refresh() {
		this.updateDisplay();
	}
}

const dashboard = new Dashboard();

document.addEventListener("DOMContentLoaded", () => {
	dashboard.init();
	console.log("✅ Dashboard initialisé");
});
