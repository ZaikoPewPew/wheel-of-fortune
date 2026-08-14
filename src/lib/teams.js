export const COLORS = [
  ["#C45C5C", "#A84A4A"],
  ["#C4A24A", "#A88838"],
  ["#4A9A62", "#3D7A4E"],
  ["#4A7AB8", "#3A6496"],
  ["#C47A3A", "#A86630"],
  ["#8A6AB0", "#6E5490"],
  ["#B04A6E", "#8E3A58"],
  ["#3A9A9A", "#2E7A7A"],
  ["#B08A4A", "#8E6E3A"],
  ["#3A7A9A", "#2E6280"],
];

export const FIXED_PARTICIPANTS = [
  "Александр Козловский",
  "Владислав Кургузов",
  "Виктория Кистова",
  "Денис Орехов",
  "Роман Булаткин",
  "Александра Матвеева",
  "Алина Сунгатуллина",
  "Николай Турков",
  "Алёна Конышева",
  "Илона Коско",
];

export const RKO_PARTICIPANTS = [
  "Ваня Недбай",
  "Вика Кистова",
  "Таня Жмайло",
  "Саша Демидов",
  "Игорь Ефремов",
  "Макс Завадский",
  "Оля Копьева",
  "Настя Роледер",
  "Тёма Помозов",
  "Леша Мидиницин",
  "Катя Радченко",
  "Ксюша Плаксина",
  "Ваня Яблоновский",
  "Лена Вилкова",
];

export const NEFIN_PARTICIPANTS = [
  "Али Аскеров",
  "Артем Никулкин",
  "Анна Петроченкова",
  "Олег Шевнин",
  "Андрей Шипигузов",
  "Наталья Родина",
  "Ирина Дуркина",
];

export const PRODUCTS_PARTICIPANTS = [
  "Денис",
  "Ваня",
  "Виталя",
  "Макс",
  "Кирилл",
  "Лена",
  "Костя",
  "Настя",
];

export const TEAMS = [
  { id: "acquiring", label: "Эквайринг", fixed: FIXED_PARTICIPANTS },
  { id: "rko", label: "РКО", fixed: RKO_PARTICIPANTS },
  { id: "nefin", label: "Нефины", fixed: NEFIN_PARTICIPANTS },
  { id: "products", label: "Продакты", fixed: PRODUCTS_PARTICIPANTS },
];

export const TEAM_SYNC_TEAMS = TEAMS.filter((t) => t.id !== "products");
export const OTHER_SYNC_TEAMS = TEAMS.filter((t) => t.id === "products");

export const WHEEL_SIZE = 560;

export const VIKA_WINNER_IMAGE =
  "https://static-cdn.jtvnw.net/jtv_user_pictures/92d2f6bf-fcf8-4fc7-a8e6-5fadc57ca820-profile_image-70x70.png";

export const WINNER_MEME_IMAGE =
  "https://images.meme-arsenal.com/a40fe7393d739a369ae2d4bd7e111f4d.jpg";

const TEAMS_WITH_MEME_WINNER = new Set(["acquiring", "rko", "nefin"]);

let winnerMemePreload = null;

export function preloadWinnerMeme() {
  if (winnerMemePreload) return winnerMemePreload;
  winnerMemePreload = new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = WINNER_MEME_IMAGE;
  });
  return winnerMemePreload;
}

preloadWinnerMeme();

export function getWinnerVisual(teamId, winnerName) {
  if (teamId === "products") return null;
  if (teamId === "acquiring" && winnerName === "Виктория Кистова") {
    return { src: VIKA_WINNER_IMAGE, kind: "avatar" };
  }
  if (TEAMS_WITH_MEME_WINNER.has(teamId)) {
    return { src: WINNER_MEME_IMAGE, kind: "meme" };
  }
  return null;
}

export function emptyTeamMap(value) {
  const resolve = (list) => {
    if (typeof value === "function") return value(list);
    if (Array.isArray(value)) return [...value];
    if (value && typeof value === "object") return { ...value };
    return value;
  };
  return {
    acquiring: resolve(FIXED_PARTICIPANTS),
    rko: resolve(RKO_PARTICIPANTS),
    nefin: resolve(NEFIN_PARTICIPANTS),
    products: resolve(PRODUCTS_PARTICIPANTS),
  };
}
