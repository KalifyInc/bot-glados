const Discord = require("discord.js");
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
const ytdl = require("ytdl-core-discord");
require('dotenv/config');
let queue = [];

async function playQueue(connection) {
    connection.play(await ytdl(queue[0]), { type: 'opus' }).on("finish", () => {
        console.log(queue)
        queue = queue.filter(song => song != queue[0])
        if (queue.length > 0) {
            playQueue(connection);
        }
    });
}

client.once('ready', () => {
    client.user.setActivity('Portal with Chell', { type: 'STREAMING' });
    console.log('Iniciado com sucesso!');
});

client.on('message', message => {
    try {
        const prefix = process.env.PREFIX;
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const arguments = message.content.slice(prefix.length).trim().split(' ');
        const command = arguments.shift().toLowerCase();

        if (command === "ping") {
            message.channel.send(`🏓 PONG! | Sua latência com o servidor é **${Date.now() - message.createdTimestamp}ms** e a latência comigo é **${Math.round(client.ws.ping)}ms**`);
        }

        if (command === "play") {
            const voice = message.member.voice;
            const URL = arguments[0];

            if (!voice.channelID) {
                message.reply("É preciso estar em um canal de voz para utilizar esse comando!");
                return;
            }

            if (!URL) {
                message.reply("É preciso enviar a URL do vídeo para ser reproduzido");
                return;
            }

            if (!queue[0]) {
                queue.push(URL);
                console.log(queue);
                voice.channel.join().then((connection) => {
                    try {
                        playQueue(connection);
                    } catch (ex) {
                        message.reply("Erro ao reproduzir mídia, verifique se a URL é do Youtube!");
                        console.error(ex);
                    }
                });
            } else {
                queue.push(URL);
                console.log(queue);
            }
        }

        if (command === "leave") {
            const voice = message.member.voice;

            if (!voice.channelID) {
                message.reply("É preciso estar em um canal de voz para utilizar esse comando.");
                return;
            }

            voice.channel.leave();
        }

        if (command === "resetqueue") {
            console.log("Resetando queue");
            const voice = message.member.voice;

            if (!voice.channelID) {
                message.reply("É preciso estar em um canal de voz para utilizar esse comando.");
                return;
            }

            queue.forEach(() => {
                queue.pop();
            })

            message.reply("Queue resetada.");
            voice.channel.leave();
        }

// ************************************************************************************ //

if (command === "bin") {
message.reply(`
-
https://pastecord.com/
https://paste.gg/
https://hatebin.com/
`)
}

if (command === "code") {
message.reply(`
-
https://codepen.io/
https://jsfiddle.net/
`)
}

// ************************************************************************************* //

        if (command === "javascript") {
            message.reply('https://developer.mozilla.org/en-US/docs/Web/JavaScript')
        }

        if (command === "nodejs") {
            message.reply('https://nodejs.org/en/')
        }

        if (command === "discordjs") {
            message.reply('https://discord.js.org/')
        }

        if (command === "react") {
            message.reply('https://reactjs.org/')
        }

        if (command === "laravel") {
            message.reply('https://laravel.com/')
        }

        if (command === "vue") {
            message.reply('https://vuejs.org/')
        }

        if (command === "c#") {
            message.reply('https://docs.microsoft.com/en-us/dotnet/csharp/')
        }

        if (command === "c++") {
            message.reply('https://docs.microsoft.com/en-us/cpp/?view=msvc-170')
        }

        if (command === "c") {
            message.reply('https://docs.microsoft.com/en-us/cpp/?view=msvc-170')
        }

        if (command === "html") {
            message.reply('https://developer.mozilla.org/en-US/docs/Web/HTML')
        }

        if (command === "css") {
            message.reply('https://developer.mozilla.org/en-US/docs/Web/css')
        }

        if (command === "elixir") {
            message.reply('https://elixir-lang.org/getting-started/introduction.html')
        }

        if (command === "flutter") {
            message.reply('https://docs.flutter.dev/')
        }

        if (command === "reactnative") {
            message.reply('https://reactnative.dev/')
        }

        if (command === "java") {
            message.reply('https://docs.oracle.com/en/java/')
        }

        if (command === "kotlin") {
            message.reply('https://developer.android.com/kotlin/first')
        }

        if (command === "php") {
            message.reply('https://www.php.net/docs.php')
        }

        if (command === "python") {
            message.reply('https://docs.python.org/3/')
        }

        if (command === "ruby") {
            message.reply('https://ruby-doc.org/')
        }

        if (command === "rubyonrails") {
            message.reply('https://rubyonrails.org/')
        }

        if (command === "firebase") {
            message.reply('https://firebase.google.com/docs')
        }

        // ************************************************************************************* //
        
        if (message.content.toLowerCase().indexOf("Glados") > -1) {
            message.react("😳")
        }

        if (message.content.toLowerCase().indexOf("Pessoal") > -1) {
            message.react("🚀")
        }

        if (message.content.toLowerCase().indexOf("Github") > -1 || message.content.toLowerCase().indexOf("Linkedin") > -1) {
            message.react("🥳")
        }
        
        // ************************************************************************************* //

if (command === "help") {
message.reply(`
Essa é uma lista de comandos que eu, **GLaDOS** posso executar:

**!ping** - Eu te informo o ping do servidor e a latência da minha resposta - *PONG!*
**!play** - Eu toco uma música, mas a URL deverá ser do Youtube (!ping URL)
**!leave** - Eu simplesmente saio da sala de voz - *bye, bye*
**!resetqueue** - Eu limpo a lista de reprodução
**!linguagem** - Javascript, Python, etc - Informo o link da documentação dessa linguagem!

Qualquer sugestão de melhoria ou me ajudar a evoluir, 
você poderá informar no Github através de PR/Issue: https://github.com/ApertureLaboratory/bot-discord
`);
        }
    } catch (ex) {
        message.reply("Ocorreu um problema na syntax, verifique novamente!");
    }
})

client.login(process.env.API_TOKEN);