# Колесо фортуны

Крутилки для нашей команды.

**Сайт:** [https://zaikopewpew.github.io/wheel-of-fortune/](https://zaikopewpew.github.io/wheel-of-fortune/)  
**Репозиторий:** [https://github.com/ZaikoPewPew/wheel-of-fortune](https://github.com/ZaikoPewPew/wheel-of-fortune)

## Команды на колесе

| Таб | Участники |
|-----|-----------|
| Эквайринг | Фиксированный список команды |
| РКО | Фиксированный список команды |
| Нефины | Фиксированный список команды |
| Продакты | Денис, Ваня, Виталя, Макс, Кирилл, Лена, Костя, Настя |

В каждой команде: вкладки **Дефолтные** / **Свои** (до 5 имён), история розыгрышей, переключатель команд над панелью участников.

## Особенности

- Крупное колесо с анимацией вращения
- Победная карточка: «молочный» взрыв брызг от карточки
- **Эквайринг, РКО, Нефины** — картинка вместо смайлика (мем предзагружается при открытии страницы)
- **Эквайринг → Виктория Кистова** — отдельный аватар Twitch
- **Продакты** — классический смайлик в карточке
- В **Эквайринге** нет конфетти при победе; в остальных командах — есть

## Локальный запуск

```bash
git clone https://github.com/ZaikoPewPew/wheel-of-fortune.git
cd wheel-of-fortune
npm install
npm run dev
```

Сборка продакшена:

```bash
npm run build
npm run preview
```

## Деплой на GitHub Pages

Деплой **автоматический**: при каждом пуше в ветку `main` запускается workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) — сборка Vite и публикация на GitHub Pages.

### Однократная настройка репозитория

1. [Репозиторий](https://github.com/ZaikoPewPew/wheel-of-fortune) → **Settings** → **Pages**
2. **Build and deployment** → **Source** → **GitHub Actions** → **Save**

### Выкатить изменения

```bash
git add .
git commit -m "описание изменений"
git push origin main
```

Через 1–2 минуты обновится: [https://zaikopewpew.github.io/wheel-of-fortune/](https://zaikopewpew.github.io/wheel-of-fortune/)

Статус: **Actions** → **Deploy to GitHub Pages**.

Ручной деплой: **Actions** → **Deploy to GitHub Pages** → **Run workflow**.

## Стек

- React 18 + Vite 5
- GitHub Pages + GitHub Actions
