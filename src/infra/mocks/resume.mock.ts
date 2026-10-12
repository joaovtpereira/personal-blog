import type { ResumeModel } from "@/domain/models";

/* Partes que não mudam com o idioma. */
const COMMON = {
  location: "UBERLÂNDIA - MG, BR",
  career_start_year: 2018,
  companies_count: 1,
  stack: [
    "TypeScript",
    "React Native",
    "Expo",
    "Next.js",
    "Firebase",
    "React",
    "Cloud Functions",
    "Firestore",
    "watchOS",
    "Wear OS",
    ".NET",
    "C#",
    "Node.js",
    "Python",
    "MongoDB",
    "CQRS",
    "DDD",
    "SOLID",
  ],
  languages: [
    { code: "pt", level: "nativo" },
    { code: "en", level: "basico-intermediario" },
    { code: "es", level: "basico" },
  ] as ResumeModel["languages"],
  pdf_url: null,
};

const PERIODS = {
  bytekick: { start: "2026", end: null },
  techLead: { start: "2026-10", end: null },
  senior: { start: "2025-03", end: "2026-09" },
  mobile: { start: "2021", end: "2025-02" },
  zarb: { start: "2020", end: "2021" },
} as const;

const THESIS_URL = "https://repositorio.ufu.br/handle/123456789/36140";

const PT: ResumeModel = {
  ...COMMON,
  locale: "pt",
  summary:
    "Desenvolvedor mobile e web, com experiência em back-end usando .NET e Node.js. Apaixonado por pensar e planejar soluções inovadoras.",
  platforms: ["Web", "Mobile", "Back-end", "Banco de dados"],
  stack: [...COMMON.stack.slice(0, 15), "Microsserviços", ...COMMON.stack.slice(15)],
  experiences: [
    {
      id: "bytekick",
      ...PERIODS.bytekick,
      role: "Cofundador & Sócio",
      organization: "ByteKickStudio",
      description: "Criação do FotSquad, app de futebol entre amigos para iOS, Android, watchOS e Wear OS.",
    },
    {
      id: "5by5-tech-lead",
      ...PERIODS.techLead,
      role: "Tech Lead",
      organization: "5by5 Soluções em Sistemas",
      description:
        "Liderança técnica de um projeto web das plataformas da Azul: conduzo code reviews, quebro e priorizo entregas com o time de produto e apoio o desenvolvimento dos devs.",
    },
    {
      id: "5by5-senior",
      ...PERIODS.senior,
      role: "Desenvolvedor Sênior",
      organization: "5by5 Soluções em Sistemas",
      description:
        "Desenvolvimento de novas features para o app Minha Azul, manutenção e controle de releases na App Store e na Play Store. Atuei no time responsável por novas features e manutenção dos portais B2B da Azul, incluindo APIs em microsserviços com .NET.",
    },
    {
      id: "5by5-mobile",
      ...PERIODS.mobile,
      role: "Desenvolvedor Pleno · Mobile",
      organization: "5by5 Soluções em Sistemas",
      description:
        "Desenvolvimento de novas features para o app Minha Azul, manutenção e controle de releases na App Store e na Play Store.",
    },
    {
      id: "zarb",
      ...PERIODS.zarb,
      role: "Estagiário → Júnior → Pleno",
      organization: "Zarb Solutions",
      description: "Desenvolvimento com React Native, React JS e Laravel.",
    },
  ],
  education: [
    {
      id: "ufu",
      degree: "Bacharelado em Sistemas de Informação",
      institution: "Universidade Federal de Uberlândia",
      institution_short: "UFU",
      start_year: 2017,
      end_year: 2022,
      thesis: {
        title: "Aplicando redes neurais na predição de valores da moeda Bitcoin",
        summary:
          "Comparação entre LSTM, Multilayer Perceptron e KNN na previsão do preço do Bitcoin com dados reais de mercado — a rede recorrente LSTM teve o melhor resultado, com 72% de acurácia.",
        year: 2022,
        url: THESIS_URL,
      },
    },
  ],
  skills: [
    { id: "languages", label: "LINGUAGENS", items: ["TypeScript", "JavaScript", "C#", "Python"] },
    { id: "mobile", label: "MOBILE", items: ["React Native", "Expo", "watchOS", "Wear OS"] },
    { id: "web", label: "WEB", items: ["React", "Next.js"] },
    { id: "backend", label: "BACKEND", items: [".NET", "Node.js", "MongoDB", "Firebase", "Firestore", "Cloud Functions"] },
    { id: "architecture", label: "ARQUITETURA", items: ["Microsserviços", "CQRS", "DDD", "SOLID"] },
  ],
  current_company: { name: "5by5 Soluções em Sistemas", role: "Tech Lead", url: "https://www.5by5.com.br" },
};

const ES: ResumeModel = {
  ...COMMON,
  locale: "es",
  summary:
    "Desarrollador mobile y web, con experiencia en back-end usando .NET y Node.js. Apasionado por pensar y planificar soluciones innovadoras.",
  platforms: ["Web", "Mobile", "Back-end", "Base de datos"],
  stack: [...COMMON.stack.slice(0, 15), "Microservicios", ...COMMON.stack.slice(15)],
  experiences: [
    {
      id: "bytekick",
      ...PERIODS.bytekick,
      role: "Cofundador y Socio",
      organization: "ByteKickStudio",
      description: "Creación de FotSquad, app de fútbol entre amigos para iOS, Android, watchOS y Wear OS.",
    },
    {
      id: "5by5-tech-lead",
      ...PERIODS.techLead,
      role: "Tech Lead",
      organization: "5by5 Soluções em Sistemas",
      description:
        "Liderazgo técnico de un proyecto web de las plataformas de Azul: conduzco code reviews, divido y priorizo entregas con el equipo de producto y apoyo el desarrollo de los devs.",
    },
    {
      id: "5by5-senior",
      ...PERIODS.senior,
      role: "Desarrollador Sénior",
      organization: "5by5 Soluções em Sistemas",
      description:
        "Desarrollo de nuevas funcionalidades para la app Minha Azul, mantenimiento y control de releases en App Store y Play Store. Trabajé en el equipo responsable de nuevas funcionalidades y mantenimiento de los portales B2B de Azul, incluidas APIs en microservicios con .NET.",
    },
    {
      id: "5by5-mobile",
      ...PERIODS.mobile,
      role: "Desarrollador Semi Sénior · Mobile",
      organization: "5by5 Soluções em Sistemas",
      description:
        "Desarrollo de nuevas funcionalidades para la app Minha Azul, mantenimiento y control de releases en App Store y Play Store.",
    },
    {
      id: "zarb",
      ...PERIODS.zarb,
      role: "Pasante → Júnior → Semi Sénior",
      organization: "Zarb Solutions",
      description: "Desarrollo con React Native, React JS y Laravel.",
    },
  ],
  education: [
    {
      id: "ufu",
      degree: "Licenciatura en Sistemas de Información",
      institution: "Universidad Federal de Uberlândia",
      institution_short: "UFU",
      start_year: 2017,
      end_year: 2022,
      thesis: {
        title: "Aplicando redes neuronales en la predicción de valores de la moneda Bitcoin",
        summary:
          "Comparación entre LSTM, Multilayer Perceptron y KNN en la predicción del precio de Bitcoin con datos reales de mercado — la red recurrente LSTM obtuvo el mejor resultado, con 72% de precisión.",
        year: 2022,
        url: THESIS_URL,
      },
    },
  ],
  skills: [
    { id: "languages", label: "LENGUAJES", items: ["TypeScript", "JavaScript", "C#", "Python"] },
    { id: "mobile", label: "MOBILE", items: ["React Native", "Expo", "watchOS", "Wear OS"] },
    { id: "web", label: "WEB", items: ["React", "Next.js"] },
    { id: "backend", label: "BACKEND", items: [".NET", "Node.js", "MongoDB", "Firebase", "Firestore", "Cloud Functions"] },
    { id: "architecture", label: "ARQUITECTURA", items: ["Microservicios", "CQRS", "DDD", "SOLID"] },
  ],
  current_company: { name: "5by5 Soluções em Sistemas", role: "Tech Lead", url: "https://www.5by5.com.br" },
};

const EN: ResumeModel = {
  ...COMMON,
  locale: "en",
  summary:
    "Mobile and web developer with back-end experience using .NET and Node.js. Passionate about thinking through and planning innovative solutions.",
  platforms: ["Web", "Mobile", "Back-end", "Databases"],
  stack: [...COMMON.stack.slice(0, 15), "Microservices", ...COMMON.stack.slice(15)],
  experiences: [
    {
      id: "bytekick",
      ...PERIODS.bytekick,
      role: "Co-founder & Partner",
      organization: "ByteKickStudio",
      description: "Building FotSquad, a football app for friends on iOS, Android, watchOS and Wear OS.",
    },
    {
      id: "5by5-tech-lead",
      ...PERIODS.techLead,
      role: "Tech Lead",
      organization: "5by5 Soluções em Sistemas",
      description:
        "Technical lead on a web project for Azul’s platforms: I run code reviews, break down and prioritize deliveries with the product team and support the developers’ work.",
    },
    {
      id: "5by5-senior",
      ...PERIODS.senior,
      role: "Senior Developer",
      organization: "5by5 Soluções em Sistemas",
      description:
        "Built new features for the Minha Azul app and handled maintenance and release management on the App Store and Play Store. Worked on the team responsible for new features and maintenance of Azul’s B2B portals, including .NET microservice APIs.",
    },
    {
      id: "5by5-mobile",
      ...PERIODS.mobile,
      role: "Mid-level Developer · Mobile",
      organization: "5by5 Soluções em Sistemas",
      description:
        "Built new features for the Minha Azul app and handled maintenance and release management on the App Store and Play Store.",
    },
    {
      id: "zarb",
      ...PERIODS.zarb,
      role: "Intern → Junior → Mid-level",
      organization: "Zarb Solutions",
      description: "Development with React Native, React JS and Laravel.",
    },
  ],
  education: [
    {
      id: "ufu",
      degree: "Bachelor’s in Information Systems",
      institution: "Federal University of Uberlândia",
      institution_short: "UFU",
      start_year: 2017,
      end_year: 2022,
      thesis: {
        title: "Applying neural networks to predict Bitcoin prices",
        summary:
          "A comparison of LSTM, Multilayer Perceptron and KNN for predicting the price of Bitcoin with real market data — the LSTM recurrent network performed best, with 72% accuracy.",
        year: 2022,
        url: THESIS_URL,
      },
    },
  ],
  skills: [
    { id: "languages", label: "LANGUAGES", items: ["TypeScript", "JavaScript", "C#", "Python"] },
    { id: "mobile", label: "MOBILE", items: ["React Native", "Expo", "watchOS", "Wear OS"] },
    { id: "web", label: "WEB", items: ["React", "Next.js"] },
    { id: "backend", label: "BACKEND", items: [".NET", "Node.js", "MongoDB", "Firebase", "Firestore", "Cloud Functions"] },
    { id: "architecture", label: "ARCHITECTURE", items: ["Microservices", "CQRS", "DDD", "SOLID"] },
  ],
  current_company: { name: "5by5 Soluções em Sistemas", role: "Tech Lead", url: "https://www.5by5.com.br" },
};

export const RESUME_MOCK: ResumeModel[] = [PT, ES, EN];
