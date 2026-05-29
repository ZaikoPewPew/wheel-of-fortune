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

В каждой команде можно включать/выключать участников (Дефолтные), добавлять до 5 своих имён (Свои) и смотреть историю розыгрышей.

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

Деплой **автоматический**: при каждом пуше в ветку `main` срабатывает workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) — сборка Vite и публикация в GitHub Pages.

### Однократная настройка репозитория

1. Открыть [репозиторий](https://github.com/ZaikoPewPew/wheel-of-fortune) → **Settings** → **Pages**.
2. В **Build and deployment** → **Source** выбрать **GitHub Actions** → **Save**.

### Как выкатить изменения

```bash
git add .
git commit -m "описание изменений"
git push origin main
```

Через 1–2 минуты обновится сайт: [https://zaikopewpew.github.io/wheel-of-fortune/](https://zaikopewpew.github.io/wheel-of-fortune/)

Статус деплоя: вкладка **Actions** в репозитории → workflow **Deploy to GitHub Pages**.

Ручной запуск деплоя без коммита: **Actions** → **Deploy to GitHub Pages** → **Run workflow**.

### Клонирование на другой компьютер

```bash
git clone https://github.com/ZaikoPewPew/wheel-of-fortune.git
cd wheel-of-fortune
npm install
npm run dev
```

## Стек

- React 18 + Vite 5
- GitHub Pages + GitHub Actions
