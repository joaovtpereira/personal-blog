export const THEME_STORAGE_KEY = "jvp-theme";

/** Roda antes da pintura para aplicar o tema salvo sem piscar. */
export const themeInitScript = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t==="light"||t==="dark"){document.documentElement.dataset.theme=t;}}catch(e){}})();`;
