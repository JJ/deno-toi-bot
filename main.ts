import {
  TelegramBot,
  UpdateType,
} from "https://deno.land/x/telegram_bot_api/mod.ts";

const TOKEN = Deno.env.get("TOI_BOT_TOKEN");
if (!TOKEN) throw new Error("Bot token is not provided");
const bot = new TelegramBot(TOKEN);

const date = new Date().toISOString().slice(0, 10);
const asistenciaFile = `asistencia-${date}.json`;
const file = await Deno.open(asistenciaFile, { create: true, write: true });

bot.on(UpdateType.Message, async ({ message }) => {
  console.log(message);
  const nick: string = message.from?.username?.toLowerCase();
  let mensaje: string = `👋*${escapeLodash(nick)} 📅 ${date}`;
  console.warn(mensaje);
  await bot.sendMessage({
    chat_id: message.chat.id,
    parse_mode: "MarkdownV2",
    text: mensaje,
  });
});

bot.run({
  polling: true,
});

function escapeLodash(nick) {
  return nick.replace("_", "\\_");
}
