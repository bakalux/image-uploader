
# Image Uploader App

Полноценное приложение для загрузки, обработки и отображения изображений.

## ♻️ Стек технологий

**Backend:**
- NestJS + gRPC
- PostgreSQL + TypeORM
- Redis + BullMQ
- Sharp (обработка изображений)
- MinIO (объектное хранилище)

**Frontend:**
- React + TypeScript
- React Router, React Query
- TailwindCSS + shadcn/ui
- react-dropzone
- axios
- Vite

## 📦 Как запустить

### 1. Клонируйте репозиторий
```bash
git clone https://github.com/your-name/image-uploader.git
cd image-uploader
```

### 2. Заполните .env файлы
Создайте `.env` файлы в `server/apps/auth`, `server/apps/image` по примеру `.env.example`:

```bash
cp server/apps/auth/.env.example server/apps/auth/.env
cp server/apps/image/.env.example server/apps/image/.env
```

### 3. Соберите и запустите проект
```bash
docker-compose up --build
```

### 4. Доступы
- **Frontend:** http://localhost:5173
- **API Gateway:** http://localhost:3000
- **MinIO UI:** http://localhost:9001 (логин: `minioadmin`, пароль: `minioadmin`)

## 🌟 Автор
Иван Малиновский