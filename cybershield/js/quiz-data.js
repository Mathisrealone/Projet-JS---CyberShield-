const quizData = [
  {
    id: 1,
    difficulty: "débutant",
    question: "Que signifie l'acronyme 'MFA' ?",
    options: [
      "Multi-Factor Authentication",
      "Main File Access",
      "Military Firewall Area",
      "Most Frequent Attack",
    ],
    answer: "Multi-Factor Authentication",
  },
  {
    id: 2,
    difficulty: "débutant",
    question:
      "Quelle méthode de fraude utilise des e-mails trompeurs pour voler des données ?",
    options: ["Le Phishing", "Le Skimming", "Le Ping", "Le Farming"],
    answer: "Le Phishing",
  },
  {
    id: 3,
    difficulty: "débutant",
    question: "Parmi ces mots de passe, lequel est le plus sécurisé ?",
    options: ["123456", "Azerty123", "P@ssw0rd2024!", "MonChien"],
    answer: "P@ssw0rd2024!",
  },
  {
    id: 4,
    difficulty: "débutant",
    question: "Que permet de chiffrer un VPN ?",
    options: [
      "Le disque dur",
      "La connexion internet",
      "L'écran",
      "Le clavier",
    ],
    answer: "La connexion internet",
  },
  {
    id: 5,
    difficulty: "débutant",
    question:
      "Quel logiciel est conçu pour détecter et supprimer les programmes malveillants ?",
    options: ["Un compilateur", "Un navigateur", "Un antivirus", "Un tableur"],
    answer: "Un antivirus",
  },
  {
    id: 6,
    difficulty: "débutant",
    question: "Que signifie le 'S' dans HTTPS ?",
    options: ["System", "Secure", "Server", "Speed"],
    answer: "Secure",
  },
  {
    id: 7,
    difficulty: "débutant",
    question:
      "Comment appelle-t-on un logiciel qui bloque vos fichiers en échange d'une rançon ?",
    options: ["Un Ransomware", "Un Spyware", "Un Adware", "Un Cookie"],
    answer: "Un Ransomware",
  },
  {
    id: 8,
    difficulty: "débutant",
    question:
      "Est-il prudent d'utiliser le même mot de passe sur tous ses comptes ?",
    options: [
      "Oui, c'est plus simple",
      "Seulement si le mot de passe est long",
      "Non, c'est un risque majeur",
      "Oui, si on a un antivirus",
    ],
    answer: "Non, c'est un risque majeur",
  },
  {
    id: 9,
    difficulty: "intermédiaire",
    question: "Quel est le but d'une attaque par déni de service (DDoS) ?",
    options: [
      "Lire des e-mails",
      "Saturer un serveur pour le rendre indisponible",
      "Voler une base de données",
      "Modifier un site web",
    ],
    answer: "Saturer un serveur pour le rendre indisponible",
  },
  {
    id: 10,
    difficulty: "intermédiaire",
    question: "Qu'est-ce qu'une attaque 'Man-in-the-Middle' (MitM) ?",
    options: [
      "Une attaque physique",
      "Une interception de communications",
      "Un vol d'ordinateur",
      "Une panne de courant",
    ],
    answer: "Une interception de communications",
  },
  {
    id: 11,
    difficulty: "intermédiaire",
    question:
      "Dans le modèle OSI, à quelle couche travaille un pare-feu (firewall) standard ?",
    options: ["Couche 1", "Couche 3 ou 4", "Couche 6", "Toutes les couches"],
    answer: "Couche 3 ou 4",
  },
  {
    id: 12,
    difficulty: "intermédiaire",
    question:
      "Comment appelle-t-on un hacker qui utilise ses compétences de manière éthique ?",
    options: ["Black Hat", "Grey Hat", "White Hat", "Red Hat"],
    answer: "White Hat",
  },
  {
    id: 13,
    difficulty: "intermédiaire",
    question: "Qu'est-ce qu'une vulnérabilité 'Zero-Day' ?",
    options: [
      "Une faille corrigée le jour même",
      "Une faille connue depuis longtemps",
      "Une faille exploitée avant qu'un correctif n'existe",
      "Une faille mineure",
    ],
    answer: "Une faille exploitée avant qu'un correctif n'existe",
  },
  {
    id: 14,
    difficulty: "intermédiaire",
    question:
      "Lequel de ces protocoles est utilisé pour sécuriser le transfert de fichiers ?",
    options: ["HTTP", "FTP", "SFTP", "UDP"],
    answer: "SFTP",
  },
  {
    id: 15,
    difficulty: "intermédiaire",
    question: "Que signifie le terme 'Social Engineering' ?",
    options: [
      "La programmation de réseaux sociaux",
      "La manipulation psychologique",
      "L'optimisation d'un moteur de recherche",
      "La réparation de matériel",
    ],
    answer: "La manipulation psychologique",
  },
  {
    id: 16,
    difficulty: "intermédiaire",
    question:
      "Quel outil est souvent utilisé pour scanner les ports d'une machine ?",
    options: ["Wireshark", "Nmap", "Metasploit", "VLC"],
    answer: "Nmap",
  },
  {
    id: 17,
    difficulty: "avancé",
    question:
      "Quelle est la différence principale entre le chiffrement symétrique et asymétrique ?",
    options: [
      "La vitesse uniquement",
      "L'usage d'une seule clé vs une paire de clés",
      "Le type de fichiers",
      "Il n'y a pas de différence",
    ],
    answer: "L'usage d'une seule clé vs une paire de clés",
  },
  {
    id: 18,
    difficulty: "avancé",
    question: "Qu'est-ce qu'un 'Salt' (sel) en cryptographie ?",
    options: [
      "Un type de malware",
      "Une donnée aléatoire ajoutée au hachage d'un mot de passe",
      "Une erreur réseau",
      "Un protocole de routage",
    ],
    answer: "Une donnée aléatoire ajoutée au hachage d'un mot de passe",
  },
  {
    id: 19,
    difficulty: "avancé",
    question:
      "Quelle attaque consiste à injecter du code malveillant dans une page web pour qu'il soit exécuté par le client ?",
    options: [
      "SQL Injection",
      "XSS (Cross-Site Scripting)",
      "Buffer Overflow",
      "Brute Force",
    ],
    answer: "XSS (Cross-Site Scripting)",
  },
  {
    id: 20,
    difficulty: "avancé",
    question: "Que signifie SIEM ?",
    options: [
      "Security Information and Event Management",
      "System Internal Encryption Mode",
      "Secure Internet Entry Method",
      "Software Integrated Error Monitoring",
    ],
    answer: "Security Information and Event Management",
  },
  {
    id: 21,
    difficulty: "avancé",
    question:
      "Quelle vulnérabilité permet de déborder de l'espace mémoire alloué à une variable ?",
    options: [
      "Directory Traversal",
      "Buffer Overflow",
      "Privilege Escalation",
      "Race Condition",
    ],
    answer: "Buffer Overflow",
  },
  {
    id: 22,
    difficulty: "avancé",
    question: "Dans le protocole TLS, à quoi sert le 'Handshake' ?",
    options: [
      "À terminer la connexion",
      "À authentifier les parties et échanger les clés",
      "À compresser les données",
      "À bloquer les attaques par force brute",
    ],
    answer: "À authentifier les parties et échanger les clés",
  },
  {
    id: 23,
    difficulty: "avancé",
    question: "Lequel de ces algorithmes est considéré comme asymétrique ?",
    options: ["AES", "DES", "RSA", "Blowfish"],
    answer: "RSA",
  },
  {
    id: 24,
    difficulty: "avancé",
    question: "Qu'est-ce que l'analyse 'heuristique' dans un antivirus ?",
    options: [
      "L'analyse de la signature exacte",
      "L'analyse basée sur le comportement suspect",
      "L'analyse de la date de création",
      "L'analyse du nom du fichier",
    ],
    answer: "L'analyse basée sur le comportement suspect",
  },
  {
    id: 25,
    difficulty: "avancé",
    question:
      "Quel principe stipule qu'un utilisateur ne doit avoir que les accès nécessaires à son travail ?",
    options: [
      "Zero Trust",
      "Least Privilege (Moindre privilège)",
      "Open Source",
      "Defense in Depth",
    ],
    answer: "Least Privilege (Moindre privilège)",
  },
];

export default quizData;
