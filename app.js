const { Client, Intents } = require("discord.js");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
const ytdl = require("ytdl-core-discord");
require("dotenv/config");

let queue = [];

async function playQueue(messageCreate) {
  try {
    messageCreate
      .play(await ytdl(queue[0]), { type: "opus" })
      .on("finish", () => {
        console.log(queue);
        queue = queue.filter((song) => song != queue[0]);
        if (queue.length > 0) {
          playQueue(messageCreate);
        }
      });
  } catch (err) {
    console.error(err);
    messageCreate.reply(
      "Ocorreu um erro ao reproduzir a música, verifique a URL e tente novamente."
    );
  }
}

const links = {
  javascript: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
  nodejs: "https://nodejs.org/en/",
  discordjs: "https://discord.js.org/",
  react: "https://reactjs.org/",
  laravel: "https://laravel.com/",
  vue: "https://vuejs.org/",
  "c#": "https://docs.microsoft.com/en-us/dotnet/csharp/",
  "c++": "https://docs.microsoft.com/en-us/cpp/?view=msvc-170",
  c: "https://docs.microsoft.com/en-us/cpp/?view=msvc-170",
  html: "https://developer.mozilla.org/en-US/docs/Web/HTML",
  css: "https://developer.mozilla.org/en-US/docs/Web/css",
  elixir: "https://elixir-lang.org/getting-started/introduction.html",
  flutter: "https://docs.flutter.dev/",
  reactnative: "https://reactnative.dev/",
  java: "https://docs.oracle.com/en/java/",
  kotlin: "https://developer.android.com/kotlin/first",
  php: "https://www.php.net/docs.php",
  python: "https://docs.python.org/3/",
  ruby: "https://ruby-doc.org/",
  rubyonrails: "https://rubyonrails.org/",
  firebase: "https://firebase.google.com/docs",
};

client.once("ready", () => {
  client.user.setActivity("Portal with Chell", { type: "STREAMING" });
  console.log("Iniciado com sucesso!");
});

client.on("messageCreate", async (messageCreate) => {
  try {
    const prefix = process.env.PREFIX;
    if (!messageCreate.content.startsWith(prefix) || messageCreate.author.bot)
      return;

    const arguments = message.content.slice(prefix.length).trim().split(" ");
    const command = arguments.shift().toLowerCase();

    if (command === "ping") {
      handlePingCommand(messageCreate);
    }

    //

    if (command === "play") {
      const voice = messageCreate.member.voice;
      const URL = arguments[0];

      if (!voice.channelID) {
        messageCreate.reply(
          "Você precisa estar em um canal de voz para utilizar esse comando!"
        );
        return;
      }

      if (!URL || !ytdl.validateURL(URL)) {
        messageCreate.reply(
          "Você precisa enviar uma URL válida do YouTube para ser reproduzido."
        );
        return;
      }

      if (!queue[0]) {
        queue.push(URL);
        console.log(queue);
        voice.channel.join().then((connection) => {
          try {
            playQueue(connection);
            messageCreate.channel.send(`Adicionado à fila: ${URL}`);
          } catch (ex) {
            messageCreate.reply(
              "Erro ao reproduzir mídia, verifique se a URL é do Youtube!"
            );
            console.error(ex);
          }
        });
      } else {
        queue.push(URL);
        console.log(queue);
        messageCreate.channel.send(`Adicionado à fila: ${URL}`);
      }
    }

    if (command === "resetqueue") {
      console.log("Resetando queue");
      const voice = messageCreate.member.voice;

      if (!voice.channelID) {
        messageCreate.reply(
          "É preciso estar em um canal de voz para utilizar esse comando."
        );
        return;
      }

      queue.splice(0, queue.length);

      messageCreate.reply("Queue resetada.");
      voice.channel.leave();

      //

      if (command === "bin") {
        const options = [
          "https://pastecord.com/",
          "https://paste.gg/",
          "https://hatebin.com/",
        ];
        sendOptionsMessage(
          messageCreate,
          "Opções de serviços de bin:",
          options
        );
      }

      //

      if (command === "code") {
        const options = ["https://codepen.io/", "https://jsfiddle.net/"];
        sendOptionsMessage(
          messageCreate,
          "Opções de serviços de código:",
          options
        );
      }

      //

      if (command in links) {
        messageCreate.reply(links[command]);
      }

      //

      if (command === "help") {
        messageCreate.reply(`
        Essa é uma lista de comandos que eu, **GLaDOS** posso executar:
        
        **!ping** - Eu te informo o ping do servidor e a latência da minha resposta - *PONG!*
        **!play** - Eu toco uma música, mas a URL deverá ser do Youtube (!ping URL)
        **!leave** - Eu simplesmente saio da sala de voz - *bye, bye*
        **!resetqueue** - Eu limpo a lista de reprodução
        **!linguagem** - Informo o link da documentação da linguagem especificada (!linguagem nome_da_linguagem)
        **!bin** - Informo o link de um serviço de bin
        **!code** - Informo o link de um serviço de código
        **!lofi** - Eu toco um stream de Lofi 24/7
        
        Qualquer sugestão de melhoria ou me ajudar a evoluir, 
        você poderá informar no Github através de PR/Issue: https://github.com/KalifyInc/bot-discord
        `);

        //

        if (command === "lofi") {
          if (messageCreate.member.voice.channel) {
            const connection = await message.member.voice.channel.join();
            const stream = ytdl("https://www.youtube.com/watch?v=jfKfPfyJRdk", {
              filter: "audioonly",
            });
            dispatcher = connection.play(stream, { volume: 0.5 });

            dispatcher.on("finish", () => {
              stream.resume();
            });

            messageCreate.reply("Tocando Lofi 24/7");
          } else {
            messageCreate.reply(
              "Você precisa estar em um canal de voz para usar esse comando"
            );
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
    messageCreate.reply("Ocorreu um erro ao processar o comando.");
  }
});

function handlePingCommand(messageCreate) {
  const latencyToServer = Date.now() - messageCreate.createdTimestamp;
  const latencyToBot = Math.round(client.ws.ping);
  messageCreate.channel.send(
    `🏓 PONG! | Sua latência com o servidor é **${latencyToServer}ms** e a latência comigo é **${latencyToBot}ms**`
  );
}

function sendOptionsMessage(messageCreate, title, options) {
  messageCreate.reply(`
      ${title}
      ${options.map((option) => `- ${option}`).join("\n")}
      `);
}

client.login(process.env.API_TOKEN);
