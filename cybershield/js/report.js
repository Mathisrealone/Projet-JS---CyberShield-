(function () {
	const STORAGE_KEYS = {
		quizScores: "cybershield-quiz-scores",
		passwordStrength: "cybershield-password-last-strength",
		emailAnalyses: "cybershield-email-analyses",
		newsCache: "cybershield-news-cache",
		newsVisibleArticles: "cybershield-news-visible-articles",
		newsVisibleCount: "cybershield-news-visible-count",
	};

	function readJsonFromStorage(key, defaultValue) {
		try {
			const raw = localStorage.getItem(key);
			if (!raw) return defaultValue;
			const parsed = JSON.parse(raw);
			return parsed ?? defaultValue;
		} catch (error) {
			console.error("Erreur lecture localStorage:", key, error);
			return defaultValue;
		}
	}

	function getUserSecurityData() {
		const quizScores = readJsonFromStorage(STORAGE_KEYS.quizScores, []);
		const passwordStrength = readJsonFromStorage(
			STORAGE_KEYS.passwordStrength,
			"-",
		);
		const emailAnalyses = readJsonFromStorage(STORAGE_KEYS.emailAnalyses, []);
		const newsCache = readJsonFromStorage(STORAGE_KEYS.newsCache, []);
		const newsVisibleArticles = readJsonFromStorage(
			STORAGE_KEYS.newsVisibleArticles,
			[],
		);
		const newsVisibleCount = readJsonFromStorage(
			STORAGE_KEYS.newsVisibleCount,
			null,
		);

		return {
			quizScores: Array.isArray(quizScores) ? quizScores : [],
			passwordStrength:
				typeof passwordStrength === "string" ? passwordStrength : "-",
			emailAnalyses: Array.isArray(emailAnalyses) ? emailAnalyses : [],
			newsCache: Array.isArray(newsCache) ? newsCache : [],
			newsVisibleArticles: Array.isArray(newsVisibleArticles)
				? newsVisibleArticles
				: [],
			newsVisibleCount:
				typeof newsVisibleCount === "number" ? newsVisibleCount : null,
		};
	}

	function generateSecurityReport() {
		const data = getUserSecurityData();

		const quizTotal = data.quizScores.length;
		const quizAverage =
			quizTotal > 0
				? Math.round(
						data.quizScores.reduce((sum, entry) => {
							const current = Number(entry && entry.score);
							return sum + (Number.isFinite(current) ? current : 0);
						}, 0) / quizTotal,
					)
				: 0;

		const emailsTotal = data.emailAnalyses.length;
		const emailsPhishing = data.emailAnalyses.filter(
			(entry) => entry && entry.isPhishing === true,
		).length;
		const phishingRate =
			emailsTotal > 0 ? Math.round((emailsPhishing / emailsTotal) * 100) : 0;

		const report = {
			quiz: {
				average: quizAverage,
				total: quizTotal,
			},
			password: {
				strength: data.passwordStrength || "-",
			},
			emails: {
				total: emailsTotal,
				phishing: emailsPhishing,
				phishingRate: phishingRate,
			},
			news: data.newsVisibleArticles.length
				? data.newsVisibleArticles
				: data.newsCache,
			newsVisibleCount:
				data.newsVisibleCount !== null
					? data.newsVisibleCount
					: data.newsVisibleArticles.length || data.newsCache.length,
			generatedAt: new Date().toISOString(),
			generatedAtReadable: new Date().toLocaleString("fr-FR"),
		};

		return report;
	}

	function downloadReportAsJson(report) {
		const json = JSON.stringify(report, null, 2);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = "security-report.json";
		document.body.appendChild(link);
		link.click();
		link.remove();

		URL.revokeObjectURL(url);
	}

	function initReportDownload() {
		const downloadButton = document.getElementById("downloadReportBtn");
		if (!downloadButton) {
			return;
		}

		downloadButton.addEventListener("click", () => {
			const report = generateSecurityReport();
			downloadReportAsJson(report);
		});
	}

	document.addEventListener("DOMContentLoaded", initReportDownload);
})();
