// ==========================================
// Сервер для бота Захара
// Принимает сообщения из Telegram и запоминает
// последнюю команду, чтобы сайт мог её увидеть.
// ==========================================

const express = require('express');
const cors = require('cors');
const TelegramBot = require('node-telegram-bot-api');

// 1) Вставь сюда токен своего бота, который дал @BotFather
const BOT_TOKEN = 'ВСТАВЬ_СЮДА_СВОЙ_ТОКЕН';

const app = express();
app.use(cors());

// Текущее состояние — что сайт должен показать прямо сейчас
let state = {
  command: 'idle',      // название команды
  text: '',             // само сообщение целиком
  updatedAt: Date.now() // время последнего изменения
};

// Сайт будет спрашивать сюда: "что нового?"
app.get('/state', (req, res) => {
  res.json(state);
});

app.get('/', (req, res) => {
  res.send('Сервер бота Захара работает ✅');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Сервер запущен на порту ' + PORT);
});

// ==========================================
// Сам бот
// ==========================================
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Список известных команд — сюда легко добавлять новые!
// Ключ — слово, которое ты пишешь боту (маленькими буквами)
// Значение — название команды, которое увидит сайт
const COMMANDS = {
  'снег':     'snow',
  'музыка':   'music',
  'чёрный':   'blackout',
  'черный':   'blackout',
  'трясти':   'shake',
  'переверни':'flip',
  'цвет':     'invert',
  'привет':   'hello'
};

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = (msg.text || '').trim().toLowerCase();

  const command = COMMANDS[text] || 'message';

  state = {
    command: command,
    text: msg.text || '',
    updatedAt: Date.now()
  };

  console.log('Получена команда:', command, '| текст:', msg.text);
  bot.sendMessage(chatId, 'Принято! Команда: ' + command + ' ✅');
});

console.log('Бот запущен и слушает сообщения...');
