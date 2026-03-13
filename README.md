# 🎡 Колесо Фортуны

Крутилки для нашей команды.

## Деплой на GitHub Pages (один раз)

### 1. Репозиторий на GitHub
Репозиторий уже создан: `ZaikoPewPew/wheel-of-fortune`.

### 2. Заливка проекта (один раз)
Если будешь делать это на другом компьютере, последовательность такая:

```bash
git clone https://github.com/ZaikoPewPew/wheel-of-fortune.git
cd wheel-of-fortune
# скопировать сюда файлы проекта, если нужно
git add .
git commit -m "init"
git push -u origin main
```

### 3. Включить GitHub Pages через Actions
В репозитории: **Settings → Pages → Source → GitHub Actions** → Save.

### 4. Готово!
После первого пуша GitHub сам соберёт и задеплоит по ссылке:
`https://ZaikoPewPew.github.io/wheel-of-fortune/`

---

## Локальный запуск

```bash
npm install
npm run dev
```
