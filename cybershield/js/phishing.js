const apiUrl =
  "https://newsapi.org/v2/everything?q=cybersecurity&language=fr&apiKey=b8a59e4e0bf44ba5a84427105778b931";

function formatArticleText(a) {
  const source = a.source && (a.source.name || JSON.stringify(a.source));
  return [
    `Titre: ${a.title || ""}`,
    `Auteur: ${a.author || ""}`,
    `Source: ${source || ""}`,
    `Publié: ${a.publishedAt || ""}`,
    `URL: ${a.url || ""}`,
    `Image: ${a.urlToImage || ""}`,
    `Description: ${a.description || ""}`,
    `Content: ${a.content || ""}`,
  ].join("\n");
}

const phishingRules = {
  urgencyKeywords: [
    "urgent",
    "immédiatement",
    "action requise",
    "votre compte sera suspendu",
    "expire dans",
    "dernière chance",
    "sans délai",
    "agissez maintenant",
    "sans attendre",
    "sans plus attendre",
    "maintenant",
  ],
  suspiciousDomains: [
    "paypa1.com",
    "amaz0n.fr",
    "secure-update.com",
    "noreply-security.tk",
    "login-verif.net",
  ],
  redFlags: [
    "cliquez ici",
    "mot de passe expiré",
    "connexion sécurisée",
    "vous avez gagné",
    "félicitations",
    "confirmez vos informations",
    "vérifier votre compte",
    "FÉLICITATIONS",
    "RÉCUPÉREZ VOTRE CADEAU",
    "récompense exclusive",
    "compte compromis",
    "cadeau gratuit",
    "offre limitée",
    "confirmez votre identité",
    "confirmez votre adresse",
    "confirmation de compte",
    "votre compte a été bloqué",
    "Réclamer la récompense",
    "récompense",
    "Obtenez-le maintenant",
    "prix exclusif",
  ],
  legitimateSenders: [
    "@impots.gouv.fr",
    "@pole-emploi.fr",
    "@banque-france.fr",
    "@caf.fr",
  ],
};

const email = {
  subject: "",
  body: "",
  from: "",
};

function renderEmailAnalysis(result, outputEl) {
  const level =
    result.score >= 70
      ? "Risque élevé"
      : result.score >= 40
        ? "Risque modéré"
        : "Risque faible";

  const reasonsHtml = result.reasons.length
    ? `<ul>${result.reasons.map((reason) => `<li>${reason}</li>`).join("")}</ul>`
    : "<p>Aucun signal particulier détecté.</p>";

  outputEl.innerHTML = `
    <h3>Résultat de l'analyse</h3>
    <div class="score">Score: ${result.score}/100 — ${level}</div>
    ${reasonsHtml}
  `;
}

function setupEmailAnalyzer() {
  if (typeof document === "undefined") return;

  const form = document.getElementById("email-form");
  const fromInput = document.getElementById("email-from");
  const subjectInput = document.getElementById("email-subject");
  const bodyInput = document.getElementById("email-body");
  const output = document.getElementById("email-result");

  if (!form || !fromInput || !subjectInput || !bodyInput || !output) return;

  form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    email.from = fromInput.value.trim();
    email.subject = subjectInput.value.trim();
    email.body = bodyInput.value.trim();

    const result = analyzeEmail(email);
    renderEmailAnalysis(result, output);
  });
}

function analyzeEmail(email) {
  const text = (email.subject + " " + email.body).toLowerCase();
  const from = email.from.toLowerCase();

  // 1) .some() : y a‑t‑il au moins un mot d’urgence ?
  const foundUrgency = phishingRules.urgencyKeywords.some((keyword) =>
    text.includes(keyword.toLowerCase()),
  );

  // 2) .filter() : liste des redFlags trouvés
  const matchedRedFlags = phishingRules.redFlags.filter((flag) =>
    text.includes(flag.toLowerCase()),
  );

  // 3) .find() : domaine suspect dans l’expéditeur ?
  const suspiciousDomain = phishingRules.suspiciousDomains.find((domain) =>
    from.includes(domain.toLowerCase()),
  );

  // 4) .every() : vérifier que l’expéditeur n’est PAS un sender légitime
  const isFromLegitDomain = phishingRules.legitimateSenders.some((domain) =>
    from.endsWith(domain.toLowerCase()),
  );
  const allLegitRulesOk = phishingRules.legitimateSenders.every(
    (domain) => !from.endsWith(domain.toLowerCase()),
  );
  // Ici, allLegitRulesOk sera false si l’email vient d’un domaine légitime.

  // Calcul du score
  let score = 0;
  const reasons = [];

  if (foundUrgency) {
    score += 30;
    reasons.push("Présence de termes d’urgence dans l’objet/corps.");
  }

  if (matchedRedFlags.length > 0) {
    score += matchedRedFlags.length * 20; // 20 points par red flag
    reasons.push(
      `Expressions suspectes détectées: ${matchedRedFlags.join(", ")}.`,
    );
  }

  if (suspiciousDomain) {
    score += 50;
    reasons.push(`Domaine d’expéditeur suspect: ${suspiciousDomain}.`);
  }

  if (!isFromLegitDomain && allLegitRulesOk) {
    score += 20;
    reasons.push("Expéditeur non reconnu comme domaine légitime.");
  } else {
    score -= 15; // on réduit le score si domaine légitime
    reasons.push("Expéditeur identifié comme domaine légitime.");
  }

  // bornes 0–100
  if (score < 0) score = 0;
  if (score > 100) score = 100;

  return {
    score,
    reasons,
  };
}

function showArticleModal(a) {
  if (typeof document === "undefined") return;
  // remove existing modal
  const existing = document.getElementById("article-modal-overlay");
  if (existing) existing.remove();
  const overlay = document.createElement("div");
  overlay.id = "article-modal-overlay";
  overlay.className = "modal-overlay";

  const box = document.createElement("div");
  box.className = "modal-box";

  const title = document.createElement("h2");
  title.className = "modal-title";
  title.textContent = a.title || "Sans titre";
  box.appendChild(title);

  const meta = document.createElement("div");
  meta.className = "modal-meta";
  meta.textContent = `${a.author ? "Par " + a.author + " — " : ""}${(a.source && (a.source.name || a.source)) || ""} • ${a.publishedAt || ""}`;
  box.appendChild(meta);

  if (a.urlToImage) {
    const img = document.createElement("img");
    img.src = a.urlToImage;
    img.alt = a.title || "";
    img.className = "modal-image";
    box.appendChild(img);
  }

  if (a.description) {
    const desc = document.createElement("p");
    desc.className = "modal-text";
    desc.textContent = a.description;
    box.appendChild(desc);
  }

  if (a.content) {
    const cont = document.createElement("p");
    cont.className = "modal-text";
    cont.textContent = a.content;
    box.appendChild(cont);
  }

  const link = document.createElement("a");
  link.href = a.url || "#";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Lire l'article original";
  link.className = "modal-link";
  box.appendChild(link);

  const close = document.createElement("button");
  close.textContent = "Fermer";
  close.className = "modal-close";
  close.addEventListener("click", () => overlay.remove());
  box.appendChild(close);

  // close when clicking outside the box
  overlay.addEventListener("click", (ev) => {
    if (ev.target === overlay) overlay.remove();
  });

  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

async function main() {
  setupEmailAnalyzer();

  // prepare container early so we can show loading/errors
  const container =
    document.getElementById("titles") ||
    document.getElementById("news-list") ||
    document.body;
  let root = container;
  if (container === document.body) {
    const wrap = document.createElement("div");
    wrap.style.padding = "16px";
    document.body.prepend(wrap);
    root = wrap;
  }
  root.classList.add("articles-grid");

  // show loading
  root.innerHTML = `<div class="loading">Chargement des articles…</div>`;

  try {
    const res = await fetch(apiUrl);
    if (!res.ok) {
      throw new Error("Erreur HTTP " + res.status);
    }

    const data = await res.json();
    const articles = data.articles || [];

    // If no DOM (Node.js), print everything to console
    if (typeof document === "undefined") {
      console.log(`Récupéré ${articles.length} articles`);
      articles.forEach((a, i) => {
        console.log("--- Article " + (i + 1) + " ---");
        console.log(formatArticleText(a));
      });
      return;
    }

    if (!articles.length) {
      root.innerHTML = `<div class="notice">Aucun article trouvé.</div>`;
      return;
    }

    // render articles
    root.innerHTML = "";
    articles.forEach((article) => {
      const card = document.createElement("article");
      card.className = "article-card";

      if (article.urlToImage) {
        const img = document.createElement("img");
        img.src = article.urlToImage;
        img.alt = article.title || "";
        card.appendChild(img);
      }

      const title = document.createElement("h3");
      title.className = "article-title";
      title.textContent = article.title || "Sans titre";
      card.appendChild(title);

      if (article.description) {
        const desc = document.createElement("p");
        desc.className = "article-desc";
        desc.textContent = article.description;
        card.appendChild(desc);
      }

      const meta = document.createElement("div");
      meta.className = "article-meta";
      meta.textContent = `${(article.source && (article.source.name || article.source)) || ""} • ${article.publishedAt || ""}`;
      card.appendChild(meta);

      card.addEventListener("click", () => showArticleModal(article));
      root.appendChild(card);
    });
  } catch (err) {
    console.error("Erreur dans main()", err);
    // show friendly error + fallback sample articles
    root.innerHTML = `<div class="notice">Impossible de charger les articles (vérifiez la connexion ou la clé API).</div>`;
    const sample = [
      {
        title: "Exemple : renforcement de la sécurité des mots de passe",
        description:
          "Conseils pratiques pour créer et gérer des mots de passe robustes.",
        url: "#",
        urlToImage: "",
        source: { name: "CyberShield" },
        publishedAt: new Date().toISOString(),
        author: "Equipe CyberShield",
        content:
          "Voici quelques bonnes pratiques : utiliser un gestionnaire, activer la 2FA, et éviter les réutilisations.",
      },
    ];
    // render sample articles
    sample.forEach((article) => {
      const card = document.createElement("article");
      card.className = "article-card";
      if (article.urlToImage) {
        const img = document.createElement("img");
        img.src = article.urlToImage;
        img.alt = article.title || "";
        card.appendChild(img);
      }
      const title = document.createElement("h3");
      title.className = "article-title";
      title.textContent = article.title || "Sans titre";
      card.appendChild(title);
      if (article.description) {
        const desc = document.createElement("p");
        desc.className = "article-desc";
        desc.textContent = article.description;
        card.appendChild(desc);
      }
      const meta = document.createElement("div");
      meta.className = "article-meta";
      meta.textContent = `${(article.source && (article.source.name || article.source)) || ""} • ${article.publishedAt || ""}`;
      card.appendChild(meta);
      card.addEventListener("click", () => showArticleModal(article));
      root.appendChild(card);
    });
  }
}

main();
