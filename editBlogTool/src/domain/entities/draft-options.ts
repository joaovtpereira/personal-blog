/** Vocabulário fixo dos campos obrigatórios. */
export const BOOK_GENRES = ["Romance", "Ficção científica", "Fantasia", "Filosofia", "Religião", "História", "Biografia", "Não ficção"] as const;
export const GAME_PLATFORMS = ["PC", "PlayStation 5", "Xbox Series", "Nintendo Switch", "Mobile", "Outra"] as const;
export const GAME_GENRES = ["Ação", "Aventura", "RPG", "Plataforma", "Estratégia", "Esporte", "Simulação", "Puzzle", "Outro"] as const;
export const GAME_WORTH = ["Sim", "Só em promoção", "Não"] as const;
export const GAME_DIFFICULTY = ["Fácil", "Média", "Difícil", "Muito difícil"] as const;
export const SCORES = [0, 1, 2, 3, 4, 5] as const;

export const CONTENT_LOCALES = ["pt", "es", "en"] as const;
export type ContentLocale = (typeof CONTENT_LOCALES)[number];
