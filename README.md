#EN
# Spam Bot

Telegram bot for spam automation and user management with multi-account support.

## Features

- **Multi-account Management**: Support for multiple Telegram accounts (spam bots)
- **User Group Analysis**: Extract user information from Telegram groups
- **Authentication System**: Secure admin authentication with token-based access
- **Session Management**: Automatic session handling and storage
- **Bot Validation**: Automated bot status validation and monitoring

## Project Structure

```
.
├── src/
│   ├── client.js          # Main bot client implementation
│   ├── initBot.js         # Bot initialization logic
│   ├── prisma.js          # Database service with Prisma ORM
│   ├── sleepBot.js        # Bot validation and monitoring
│   └── spamBot.js         # Spam functionality and user extraction
├── .env                   # Environment variables
└── package.json           # Project dependencies
```

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Aleksey10832/spam_bot
cd spam-bot
```

2. **Install dependencies:**
```bash
npm install
```

3. **Setup environment variables:**
Create a `.env` file with:
```
CLIENT_BOT_TOKEN=your_client_bot_token
ADMIN_TOKEN=your_admin_token
```

4. **Start the bot:**
```bash
node app.js
```

## Usage

### Admin Commands

- `/start` - Start authentication process
- `/new_spam_bot` - Add new spam bot account
- `/check_group_users` - Extract users from Telegram group

### Bot Setup Process

1. Use `/start` to authenticate as admin
2. Enter the admin token when prompted
3. Use `/new_spam_bot` to add new spam bot accounts
4. Follow the wizard to enter API credentials and phone details

## Current Status

⚠️ **Project in Development** ⚠️

### Features Not Yet Implemented:
- Message sending functionality to user base
- Complete user identifier collection system

### In Progress:
- Bot session management and validation
- User data extraction from groups
- Admin notification system

## Technical Details

### Data Storage
- **Database**: Prisma ORM with PostgreSQL
- **Session Storage**: Telegram session files
- **Temporary Files**: Process tracking in `/process` directory

### Dependencies
- `telegraf`: Telegram bot framework
- `telegram`: Telegram API client
- `@prisma/client`: Database ORM
- `dotenv`: Environment variable management

## Configuration

Create `.env` file with:
```
CLIENT_BOT_TOKEN=your_telegram_bot_token
ADMIN_TOKEN=your_admin_access_token
```

## Directory Structure

- `/spam_bots` - Stores bot configuration files (JSON)
- `/process` - Temporary files for process tracking
- `/src` - Main application source code

## Important Notes

⚠️ **This project is for educational purposes only**
- Use responsibly and in compliance with Telegram's terms of service
- Implement proper rate limiting to avoid account bans
- Ensure you have proper permissions for any group operations

## License

MIT License

---

*Note: This is a development version. Some features are not yet implemented.*
#RU
# Spam Bot

Телеграм бот для спам автоматизации и управления пользователями с поддержкой многоконтный учетных записей.

## Возможности

- **Управление несколькими аккаунтами**: Поддержка множественных Telegram аккаунтов (спам ботов)
- **Анализ групп пользователей**: Извлечение информации о пользователях из Telegram групп
- **Система аутентификации**: Безопасная аутентификация администраторов с токеном доступа
- **Управление сессиями**: Автоматическое управление и хранение сессий
- **Валидация ботов**: Автоматическая проверка статуса ботов и мониторинг

## Структура проекта

```
.
├── src/
│   ├── client.js          # Основная реализация клиента бота
│   ├── initBot.js         # Логика инициализации бота
│   ├── prisma.js          # Сервис базы данных с Prisma ORM
│   ├── sleepBot.js        # Валидация и мониторинг ботов
│   └── spamBot.js         # Функционал спама и извлечения пользователей
├── .env                   # Переменные окружения
└── package.json           # Зависимости проекта
```

## Установка

1. **Клонируйте репозиторий:**
```bash
git clone https://github.com/Aleksey10832/spam_bot
cd spam-bot
```

2. **Установите зависимости:**
```bash
npm install
```

3. **Настройте переменные окружения:**
Создайте файл `.env` со следующим содержимым:
```
CLIENT_BOT_TOKEN=ваш_токен_бота
ADMIN_TOKEN=ваш_админский_токен
```

4. **Запустите бота:**
```bash
node app.js
```

## Использование

### Команды администратора

- `/start` - Начать процесс аутентификации
- `/new_spam_bot` - Добавить новый спам бот аккаунт
- `/check_group_users` - Извлечь пользователей из Telegram группы

### Процесс настройки бота

1. Используйте `/start` для аутентификации как администратор
2. Введите админский токен по запросу
3. Используйте `/new_spam_bot` для добавления новых спам бот аккаунтов
4. Следуйте мастеру настройки для ввода API данных и номера телефона

## Текущий статус

⚠️ **Проект в разработке** ⚠️

### Функции которые еще не реализованы:
- Функционал отправки сообщений по базе пользователей
- Полная система сбора идентификаторов пользователей

### В процессе:
- Управление сессиями ботов и их валидация
- Извлечение данных пользователей из групп
- Система уведомлений администраторам

## Технические детали

### Хранение данных
- **База данных**: Prisma ORM с PostgreSQL
- **Хранение сессий**: Файлы сессий Telegram
- **Временные файлы**: Отслеживание процессов в директории `/process`

### Зависимости
- `telegraf`: Фреймворк для Telegram ботов
- `telegram`: Клиент API Telegram
- `@prisma/client`: ORM базы данных
- `dotenv`: Управление переменными окружения

## Конфигурация

Создайте файл `.env` со следующими переменными:
```
CLIENT_BOT_TOKEN=ваш_токен_telegram_бота
ADMIN_TOKEN=ваш_админский_токен
```

## Структура директорий

- `/spam_bots` - Хранит файлы конфигурации ботов (JSON)
- `/process` - Временные файлы для отслеживания процессов
- `/src` - Основной исходный код приложения

## Важные замечания

⚠️ **Этот проект предназначен только для образовательных целей**
- Используйте ответственно и в соответствии с условиями использования Telegram
- Реализуйте правильное ограничение частоты запросов чтобы избежать блокировки аккаунтов
- Убедитесь что у вас есть соответствующие разрешения для операций с группами

## Лицензия

Лицензия MIT

---

*Примечание: Это версия в разработке. Некоторые функции еще не реализованы.*
