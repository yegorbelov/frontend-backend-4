# Практики 19–23

Работа с **PostgreSQL** и **MongoDB**, **кэширование в Redis**, **балансировка нагрузки** (Nginx, HAProxy) и **контейнеризация** (Docker, Docker Compose).

## Практика 19 — реляционные СУБД (PostgreSQL)

- Введение в РБД и **PostgreSQL**: SQL, схема данных, отличия от NoSQL.
- Подключение к Node.js через **`pg`** и **Sequelize** (локально или облако, например ElephantSQL).
- Модели и связи (пример `users` / `tasks`, связь 1:N), **CRUD**, транзакции и агрегации.

## Практика 20 — NoSQL (MongoDB)

- Документная модель, **BSON**, **Mongoose** (схемы и модели).
- Установка MongoDB (в т.ч. Linux), опционально **аутентификация** в `mongod.conf`.
- **CRUD** через Express, индексы и простые агрегации.

## Практика 21 — кэширование с Redis

- **Redis** как key-value in-memory: middleware чтения из кэша, запись с TTL, инвалидация при изменениях.
- Пример на приложении с **RBAC** (JWT): кэш для `GET /api/users`, `GET /api/users/:id`, `GET /api/products`, `GET /api/products/:id` (1 минута для пользователей, 10 минут для товаров).

## Практика 22 — балансировка нагрузки

- Назначение **load balancing**: масштабирование, отказоустойчивость, разделение статики и API.
- **Nginx:** `upstream`, алгоритмы (round robin, least_conn, ip_hash), резервный сервер `backup`, **`max_fails`** и **`fail_timeout`**.
- **HAProxy:** frontend/backend, `balance roundrobin`, `check`.
- **Docker Compose** и кратко **Kubernetes** (Service, балансировка между Pod’ами).

## Практика 23 — Docker и Docker Compose

- Образ, контейнер, **Dockerfile**, **Docker Compose**; сети, тома, переменные окружения.
- Пример микросервисов (gateway, users, orders), прослушивание на **`0.0.0.0`** внутри контейнера, связка **Nginx + несколько backend** в Compose.

## Структура проекта

```text
frontend-backend-4/
├── README.md
├── 19/                    Express + Sequelize + PostgreSQL
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── 20/                    Express + Mongoose + MongoDB
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── 21/                    Redis-кэш (RBAC + товары/пользователи)
│   ├── package.json
│   └── server.js
└── 22/                    Nginx, Docker Compose
    ├── Dockerfile
    ├── docker-compose.yml
    ├── nginx.conf
    ├── package.json
    └── server.js
```

---

## Запуск

### Практика 19 (PostgreSQL)

Скопируйте `.env.example` в `.env` и укажите **`DATABASE_URL`**

```bash
cd 19 && cp .env.example .env
npm install && npm start
```

Маршруты в коде: **`/users`**, **`/users/:id`**.

### Практика 20 (MongoDB)

```bash
cd 20 && cp .env.example .env
npm install && npm start
```

Маршруты: **`/users`**, **`/users/:id`**.

### Практика 21 (Redis)

Redis, например через Docker:

```bash
docker run -d --name redis-cache -p 6379:6379 redis
```

Сервер (порт по умолчанию **3000**, URL Redis задаётся переменной **`REDIS_URL`**):

```bash
cd 21 && npm install && npm start
```

### Практика 22 / 23 (Docker Compose)

```bash
cd 22 && docker compose up --build
```

Балансировщик Nginx слушает порт **80** на хосте. Проверка распределения между backend:

```bash
curl http://localhost/
```

Повторные запросы должны поочерёдно отдавать ответы разных экземпляров (в конфигурации проекта — метка сервера в JSON).

```bash
cd 22 && npm install
npm run backend:3000
```
