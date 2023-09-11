import {
  TelegramBot,
  UpdateType,
} from "https://deno.land/x/telegram_bot_api/mod.ts";

const TOKEN = Deno.env.get("TOI_BOT_TOKEN");
if (!TOKEN) throw new Error("Bot token is not provided");
const bot = new TelegramBot(TOKEN);

const prefijo = Deno.args[0] || "asistencia";

const date = new Date().toISOString().slice(0, 10);
const asistenciaFile = `${prefijo}-${date}.txt`;

bot.on(UpdateType.Message, async ({ message }) => {
  console.log(message);
  const nick: string = message.from?.username?.toLowerCase();
  const checkInFile = await Deno.open(asistenciaFile, {
    create: true,
    write: true,
    append: true,
  });
  const mensaje: string = `👋 ${escapeLodash(nick)} 📅 ${escapeDash(date)}`;
  console.warn(mensaje);
  // append at the end of checkInFile the nick
  await Deno.writeAll(checkInFile, new TextEncoder().encode(`${nick}\n`));

  checkInFile.close();

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
  return nick.replaceAll("_", "\\_");
}

function escapeDash(nick) {
  return nick.replaceAll("-", "\\-");
}
