         case 'openai': {
    const axios = require("axios");

    // API Key සහ URL වෙනස් කරලා
    const OPENAI_API_KEY = 'AIzaSyDKG2kbHCfenwjiFhQCk-m3EXFotzmrrW4';  // මෙහි ඔයාගේ Gemini API key
    const OPENAI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${OPENAI_API_KEY}`;

    // user input එක ගන්නවා (conversation/text/caption වලින්)
    const q = msg.message?.conversation ||
              msg.message?.extendedTextMessage?.text ||
              msg.message?.imageMessage?.caption ||
              msg.message?.videoMessage?.caption || '';

    if (!q || q.trim() === '') {
        return await socket.sendMessage(sender, { text: "ඕ කියන්න බන් මම OPENAI 🤖" }, { quoted: msg });
    }

    // OpenAI වගේ වැඩ කරන Prompt එක (සමහර සිංහල + English mix)
    const prompt = `
You are a helpful and friendly AI assistant. Please answer briefly and clearly.
Avoid greetings like "hello" or "how are you".
Keep your answers under 100 characters.
Respond naturally and politely as if you were a real person.
User message: ${q}
    `.trim();

    const payload = {
        contents: [{
            parts: [{ text: prompt }]
        }]
    };

    try {
        const response = await axios.post(OPENAI_API_URL, payload, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        const aiResponse = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiResponse) {
            return await socket.sendMessage(sender, { text: "❌ උත්සාහෙ පාලුවක් වුනා බන් 😓" }, { quoted: msg });
        }

        await socket.sendMessage(sender, { text: aiResponse }, { quoted: msg });

    } catch (err) {
        console.error("OpenAI Error:", err.response?.data || err.message);
        await socket.sendMessage(sender, { text: "❌ Error 😢 පස්සේ බලන්නකෝ" }, { quoted: msg });
    }

    break;
       }
       
       
       
//========================== SEARCH ============///

   case 'google':
case 'gsearch':
case 'search':
    try {
        // Check if query is provided
        if (!args || args.length === 0) {
            await socket.sendMessage(sender, {
                text: '⚠️ *Please provide a search query.*\n\n*Example:*\n.google how to code in javascript'
            });
            break;
        }

        const query = args.join(" ");
        const apiKey = "AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI";
        const cx = "baf9bdb0c631236e5";
        const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&key=${apiKey}&cx=${cx}`;

        // API call
        const response = await axios.get(apiUrl);

        // Check for results
        if (response.status !== 200 || !response.data.items || response.data.items.length === 0) {
            await socket.sendMessage(sender, {
                text: `⚠️ *No results found for:* ${query}`
            });
            break;
        }

        // Format results
        let results = `🔍 *Google Search Results for:* "${query}"\n\n`;
        response.data.items.slice(0, 5).forEach((item, index) => {
            results += `*${index + 1}. ${item.title}*\n\n🔗 ${item.link}\n\n📝 ${item.snippet}\n\n`;
        });

        // Send results with thumbnail if available
        const firstResult = response.data.items[0];
        const thumbnailUrl = firstResult.pagemap?.cse_image?.[0]?.src || firstResult.pagemap?.cse_thumbnail?.[0]?.src || 'https://via.placeholder.com/150';

        await socket.sendMessage(sender, {
            image: { url: thumbnailUrl },
            caption: results.trim()
        });

    } catch (error) {
        console.error(`Error in Google search: ${error.message}`);
        await socket.sendMessage(sender, {
            text: `⚠️ *An error occurred while fetching search results.*\n\n${error.message}`
        });
    }
    break;





💐💐💐💐💐💐


             case 'img': {
    const prefix = config.PREFIX;
    const q = body.replace(/^[.\/!]img\s*/i, '').trim();

    if (!q) return await socket.sendMessage(sender, {
        text: '🔍 Please provide a search query. Ex: `.img sunset`'
    }, { quoted: msg });

    try {
        const res = await axios.get(`https://allstars-apis.vercel.app/pinterest?search=${encodeURIComponent(q)}`);
        const data = res.data.data;

        if (!data || data.length === 0) {
            return await socket.sendMessage(sender, {
                text: '❌ No images found for your query.'
            }, { quoted: msg });
        }

        const randomImage = data[Math.floor(Math.random() * data.length)];

        const buttons = [
            {
                buttonId: `${prefix}img ${q}`,
                buttonText: { displayText: "⏩ Next Image" },
                type: 1,
            }
        ];

        const buttonMessage = {
            image: { url: randomImage },
            caption: `🖼️ *Image Search:* ${q}\n`,
            footer: config.FOOTER || '🧚‍♂️𝐂ʏʙᴇʀ-𝐅ʀᴇᴇᴅᴏᴍ-𝐌ɪɴɪ-𝐁ᴏᴛ🧚‍♂️',
            buttons: buttons,
            headerType: 4
        };

        await socket.sendMessage(from, buttonMessage, { quoted: msg });

    } catch (err) {
        console.error("❌ image axios error:", err.message);
        await socket.sendMessage(sender, {
            text: '❌ Failed to fetch images.'
        }, { quoted: msg });
    }

    break;
}


💐💐💐💐💐


      case 'ts': {
    const axios = require('axios');

    const q = msg.message?.conversation ||
              msg.message?.extendedTextMessage?.text ||
              msg.message?.imageMessage?.caption ||
              msg.message?.videoMessage?.caption || '';

    const query = q.replace(/^[.\/!]ts\s*/i, '').trim();

    if (!query) {
        return await socket.sendMessage(sender, {
            text: '[❗] TikTok එකේ මොකද්ද බලන්න ඕනෙ කියපං! 🔍'
        }, { quoted: msg });
    }

    async function tiktokSearch(query) {
        try {
            const searchParams = new URLSearchParams({
                keywords: query,
                count: '10',
                cursor: '0',
                HD: '1'
            });

            const response = await axios.post("https://tikwm.com/api/feed/search", searchParams, {
                headers: {
                    'Content-Type': "application/x-www-form-urlencoded; charset=UTF-8",
                    'Cookie': "current_language=en",
                    'User-Agent': "Mozilla/5.0"
                }
            });

            const videos = response.data?.data?.videos;
            if (!videos || videos.length === 0) {
                return { status: false, result: "No videos found." };
            }

            return {
                status: true,
                result: videos.map(video => ({
                    description: video.title || "No description",
                    videoUrl: video.play || ""
                }))
            };
        } catch (err) {
            return { status: false, result: err.message };
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    try {
        const searchResults = await tiktokSearch(query);
        if (!searchResults.status) throw new Error(searchResults.result);

        const results = searchResults.result;
        shuffleArray(results);

        const selected = results.slice(0, 6);

        const cards = await Promise.all(selected.map(async (vid) => {
            const videoBuffer = await axios.get(vid.videoUrl, { responseType: "arraybuffer" });

            const media = await prepareWAMessageMedia({ video: videoBuffer.data }, {
                upload: socket.waUploadToServer
            });

            return {
                body: proto.Message.InteractiveMessage.Body.fromObject({ text: '' }),
                footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "CYBER-FREEDOM" }),
                header: proto.Message.InteractiveMessage.Header.fromObject({
                    title: vid.description,
                    hasMediaAttachment: true,
                    videoMessage: media.videoMessage // 🎥 Real video preview
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
                    buttons: [] // ❌ No buttons
                })
            };
        }));

        const msgContent = generateWAMessageFromContent(sender, {
            viewOnceMessage: {
                message: {
                    messageContextInfo: {
                        deviceListMetadata: {},
                        deviceListMetadataVersion: 2
                    },
                    interactiveMessage: proto.Message.InteractiveMessage.fromObject({
                        body: { text: `🔎 *TikTok Search:* ${query}` },
                        footer: { text: "> CYBER FREEDOM MINI BOT" },
                        header: { hasMediaAttachment: false },
                        carouselMessage: { cards }
                    })
                }
            }
        }, { quoted: msg });

        await socket.relayMessage(sender, msgContent.message, { messageId: msgContent.key.id });

    } catch (err) {
        await socket.sendMessage(sender, {
            text: `❌ Error: ${err.message}`
        }, { quoted: msg });
    }

    break;
}


💐💐💐💐💐

        // group settings

        case 'promote':
          await dragon.sendMessage(from, { react: { text: `🕓`, key: m.key } });

          if (!m.isGroup) return m.reply('group cmd')
            if (!m.isAdmin) return m.reply('admin only')
            if (!m.isBotAdmin) return m.reply('owner only')
          let blockwwwww = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
          await dragon.groupParticipantsUpdate(m.chat, [blockwwwww], 'promote')
          reply('Done')
          break

          case 'demote':
            await dragon.sendMessage(from, { react: { text: `🕓`, key: m.key } });

            if (!m.isGroup) return reply('group cmd')
              if (!m.isAdmin) return reply('admin only')
              if (!m.isBotAdmin) return reply('owner only')
                let blockwwwwwa = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                await dragon.groupParticipantsUpdate(m.chat, [blockwwwwwa], 'demote')
                reply('Done')
                break

                case 'kick':
                  await dragon.sendMessage(from, { react: { text: `🕓`, key: m.key } });
                  if (!m.isGroup) return m.reply('group cmd')
                    if (!m.isAdmin) return m.reply('admin only')
                    if (!m.isBotAdmin) return m.reply('owner only')
                let blockwww = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
                await dragon.groupParticipantsUpdate(m.chat, [blockwww], 'remove')
                reply('Done....')
                break

                case 'opentime':
                  await dragon.sendMessage(from, { react: { text: `🕓`, key: m.key } });
                  if (!m.isGroup) return m.reply('group cmd')
                    if (!m.isAdmin) return m.reply('admin only')
                    if (!m.isBotAdmin) return m.reply('owner only')
                if (args[1] == 'second') {
                    var timer = args[0] * `1000`
                } else if (args[1] == 'minute') {
                    var timer = args[0] * `60000`
                } else if (args[1] == 'hour') {
                    var timer = args[0] * `3600000`
                } else if (args[1] == 'day') {
                    var timer = args[0] * `86400000`
                } else {
                    return reply('*select:*\nsecond\nminute\nhour\n\n*example*\n10 second')
                }
                reply(`Open time ${q} starting from now`)
                setTimeout(() => {
                    var nomor = m.participant
                    const open = `*Open time* the group was opened by admin\n now members can send messages`
                    dragon.groupSettingUpdate(m.chat, 'not_announcement')
                    reply('Group open Now ')
                }, timer)
                break

                case 'closetime':
                  await dragon.sendMessage(from, { react: { text: `🕓`, key: m.key } });
                  if (!m.isGroup) return m.reply('group cmd')
                    if (!m.isAdmin) return m.reply('admin only')
                    if (!m.isBotAdmin) return m.reply('owner only')
                if (args[1] == 'second') {
                    var timer = args[0] * `1000`
                } else if (args[1] == 'minute') {
                    var timer = args[0] * `60000`
                } else if (args[1] == 'hour') {
                    var timer = args[0] * `3600000`
                } else if (args[1] == 'day') {
                    var timer = args[0] * `86400000`
                } else {
                    return reply('*select:*\nsecond\nminute\nhour\n\n*Example*\n10 second')
                }
                reply(`Close time ${q} starting from now`)
                setTimeout(() => {
                    var nomor = m.participant
                    const close = `*Close time* group closed by admin\nnow only admin can send messages`
                    dragon.groupSettingUpdate(m.chat, 'announcement')
                    reply('Group closed Now')
                }, timer)
                break

                case 'group':
            case 'grup':
            if (!m.isGroup) return m.reply('group cmd')
              if (!m.isAdmin) return m.reply('admin only')
              if (!m.isBotAdmin) return m.reply('owner only')
                if (args[0] === 'close') {
                    await dragon.groupSettingUpdate(m.chat, 'announcement').then((res) => reply(`Success Closing Group`))
                } else if (args[0] === 'open') {
                    await dragon.groupSettingUpdate(m.chat, 'not_announcement').then((res) => reply(`Success Opening Group`))
                } else {
                    reply(`Mode open/close`)
                }
            break

                case 'setnamegc':
            case 'setsubject':
              await dragon.sendMessage(from, { react: { text: `🕓`, key: m.key } });
              if (!m.isGroup) return m.reply('group cmd')
                if (!m.isAdmin) return m.reply('admin only')
                if (!m.isBotAdmin) return m.reply('owner only')
                if (!text) return reply('Text ?')
                await dragon.groupUpdateSubject(m.chat, text)
                reply('Succesfully Changed group name')
                break

                case 'linkgroup':
                  case 'linkgrup':
                  case 'linkgc':
                  case 'gclink':
                  case 'grouplink':
                  case 'gruplink':
                    await dragon.sendMessage(from, { react: { text: `🕓`, key: m.key } });

                    if (!m.isGroup) return m.reply('group cmd')
                      let response = await dragon.groupInviteCode(m.chat)
                      dragon.sendText(m.chat, `👥 *GROUP LINK*\n\n📛 *Name :* ${groupMetadata.subject}\n👤 *Owner Grup :* ${groupMetadata.owner !== undefined ? '+'+ groupMetadata.owner.split`@`[0] : 'Not known'}\n🌱 *ID :* ${groupMetadata.id}\n🔗 *Chat Link :* https://chat.whatsapp.com/${response}\n👥 *Member :* ${groupMetadata.participants.length}\n`, m, {
                          detectLink: true
                      })
                  break

 
 💐💐💐💐
 
 
 
case "ai":
        {
          await dragon.sendMessage(from, { react: { text: `👾`, key: m.key } });
          if (!text) return reply("❗ Please enter the query");
          const { data } = await axios.get(
            `https://apis.davidcyriltech.my.id/ai/chatbot?query=${text}`
          );
          await dragon.sendMessage(
            from,
            {
              text: data.result,
              contextInfo: {
                forwardingScore: 10,
                isForwarded: true,
              },
            },
            { quoted: ai }
          );
        }
        break;
        
        
        
        💐💐💐💐💐
        
        
        
        case "xnxx":
case "xnxxvideo":
  if (!config.PREMIUM.includes(m.sender.split('@')[0])) {
    return reply('ම්ම් වැල් බලන්න ආසද 🫣 එහෙනම් පොඩිම පොඩි මුදලක් ගෙවා Premium Access ලබා ගන්න. UNLIMITED වැල් ගන්න Puluwan')
}
    if (!text) return reply(`❌ Please provide a Name.`);
    if (!m.isGroup) return reply("Group only!");

    try {
        await dragon.sendMessage(from, {
            react: { text: "🎥", key: m.key },
        });

        const response = await axios.get(`https://api.genux.me/api/download/xnxx-download?query=${encodeURIComponent(text)}&apikey=GENUX-SANDARUX`);
        const data = response.data; 

        const wait = await dragon.sendMessage(
            from,
            { text: "Downloading.... " },
            { quoted: m }
        );

        if (!data || !data.result || !data.result.files) {
            return reply("❌ No results found or invalid response structure.");
        }

        await dragon.sendMessage(from, {
            image: { url: data.result.image },
            caption: `💬 *Title*: ${data.result.title}\n\n👀 *Duration*: ${data.result.duration}\n\n🗯 *Description*: ${data.result.description}\n\n💦 *Tags*: ${data.result.tags}`,
            contextInfo: {
                forwardingScore: 10,
                isForwarded: true,
            }
        });

        await dragon.sendMessage(
            from,
            {
                video: { url: data.result.files.high },
                fileName: data.result.title + ".mp4",
                mimetype: "video/mp4",
                caption: "*Done ✅*",
                contextInfo: {
                    forwardingScore: 10,
                    isForwarded: true,
                },
            },
            { quoted: m }
        );

        await dragon.sendMessage(from, {
            text: `*Uploaded✅*`,
            edit: wait.key,
        });

    } catch (error) {
        console.error(error);
        reply("❌ An error occurred while fetching the video.");
    }
    break;



💐💐💐💐💐💐💐

      case "hirunews":
        {
          try {
            const api = await axios.get(
              `https://api.genux.me/api/news/hiru-news?apikey=${global.API_KEY}`
            );
            if (!api.data.status) {
              reply("API Not Working ( Conatct Nimesh Piyumal )");
            }

            const { key } = await dragon.sendMessage(
              from,
              { text: "Checking... News " + api.data.result[0].title },
              { quoted: m }
            );

            await delay(10000);

            let caption = `Title: ${api.data.result[0].title}\n\n`;
            caption += `Published: ${api.data.result[0].published}\n\n`;
            caption += `Link: ${api.data.result[0].link}\n\n`;
            caption += `Description: ${api.data.result[0].description}`;

            return await dragon.sendMessage(from, { text: caption, edit: key });
          } catch (e) {
            console.log(e);
          }
        }
        break;




💐💐💐💐💐💐
 case "cinesub34":
        case "movie67": {
          try {
            await dragon.sendMessage(from, { react: { text: `🕐`, key: m.key } });
        
            const searchQuery = encodeURIComponent(text);
            const { data } = await axios.get(`https://apis.davidcyriltech.my.id/movies/search?query=${searchQuery}`);
        
            if (!data.status || !data.results.length) {
              return m.reply("❗ No movies found. Try a different name.");
            }
        
            const movie = data.results[0]; // Take the first search result
            let caption = `🎬 *${movie.title}*\n📅 *Year:* ${movie.year}\n⭐ *${movie.imdb}*\n\n📥 Choose quality:\n\n*1.* 720p\n*2.* 480p\n\n_Reply with the number!_`;
        
            const qlive = {
              key: {
                participant: "0@s.whatsapp.net",
                ...(m.chat ? { remoteJid: "status@broadcast" } : {}),
              },
              message: {
                liveLocationMessage: {
                  caption: `FREEDOM-MINI MD`,
                  jpegThumbnail: "",
                },
              },
            };
        
            const waitMsg = await dragon.sendMessage(
              from,
              { text: "*Loading*...80%" },
              { quoted: m}
            );
        
            const sentMessage = await dragon.sendMessage(
              m.chat,
              {
                image: { url: movie.image },
                caption: caption,
                contextInfo: {
                  mentionedJid: [m.sender],
                  forwardingScore: 999,
                  isForwarded: true,
                  externalAdReply: {
                    title: "FREEDOM-MINI",
                    body: "Movie Download",
                    mediaType: 2,
                    previewType: 0,
                    renderLargerThumbnail: true,
                    thumbnailUrl: movie.image,
                    sourceUrl: movie.link,
                  },
                },
              },
              { quoted: ai }
            );
        
            // Now wait for user reply
            dragon.ev.on("messages.upsert", async (chatUpdate) => {
              try {
                const mek = chatUpdate.messages[0];
                if (
                  mek.message &&
                  mek.message.extendedTextMessage &&,
                  mek.message.extendedTextMessage.contextInfo &&
                  mek.message.extendedTextMessage.contextInfo.stanzaId === sentMessage.key.id
                ) {
                  const comm = mek.message.extendedTextMessage.text.trim();
                  if (comm !== "1" && comm !== "2") {
                    return m.reply("❗ Invalid option. Reply with *1* or *2*.");
                  }
        
                  await dragon.sendMessage(from, { react: { text: `🎬`, key: m.key } });
        
                  // Now fetch download links
                  const { data: downloadData } = await axios.get(`https://apis.davidcyriltech.my.id/movies/download?url=${encodeURIComponent(movie.link)}`);
                  
                  if (!downloadData.status || !downloadData.movie) {
                    return m.reply("❗ Failed to fetch download links.");
                  }
        
                  let chosenQuality = comm === "1" ? "HD 720p" : "SD 480p";
                  const found = downloadData.movie.download_links.find(link => link.quality === chosenQuality);
        
                  if (!nonfound) {
                    return m.reply(`❗ ${chosenQuality} download not available.`);
                  }
        
                  await dragon.sendMessage(
                    from,
                    {
                      document: { url: found.direct_download },
                      mimetype: "video/mp4",
                      fileName: `(download.data).mp4`,
                    },
                    { quoted: mek }
                  );
        
                  await dragon.sendMessage(from, { react: { text: `✅`, key: m.key } });
                }
              } catch (err) {
                console.error("Error handling user reply:", err);
              }
            });
        
          } catch (error) {
            console.error("Error in movie command:", error);
            m.reply("❌ An error occurred while processing your request.");
          }
        }
        break;


💐💐💐💐


                case 'pair': {
    // ✅ Fix for node-fetch v3.x (ESM-only module)
    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const q = msg.message?.conversation ||
              msg.message?.extendedTextMessage?.text ||
              msg.message?.imageMessage?.caption ||
              msg.message?.videoMessage?.caption || '';

    const number = q.replace(/^[.\/!]pair\s*/i, '').trim();

    if (!number) {
        return await socket.sendMessage(sender, {
            text: '*📌 Usage:* .pair +94770690xxx'
        }, { quoted: msg });
    }

    try {
        const url = `https://solo-leveling-free-bot-0-7296035881e9.herokuapp.com/code?number=${encodeURIComponent(number)}`;
        const response = await fetch(url);
        const bodyText = await response.text();

        console.log("🌐 API Response:", bodyText);

        let result;
        try {
            result = JSON.parse(bodyText);
        } catch (e) {
            console.error("❌ JSON Parse Error:", e);
            return await socket.sendMessage(sender, {
                text: '❌ Invalid response from server. Please contact support.'
            }, { quoted: msg });
        }

        if (!result || !result.code) {
            return await socket.sendMessage(sender, {
                text: '❌ Failed to retrieve pairing code. Please check the number.'
            }, { quoted: msg });
        }

        await socket.sendMessage(sender, {
            text: `>*🧚‍♂️𝐂ʏʙᴇʀ-𝐅ʀᴇᴇᴅᴏᴍ-𝐌ɪɴɪ-𝐁ᴏᴛ🧚‍♂️* ✅\n\n*🔑 Your pairing code is:* ${result.code}`
        }, { quoted: msg });

        await sleep(2000);

        await socket.sendMessage(sender, {
            text: `${result.code}`
        }, { quoted: msg });

    } catch (err) {
        console.error("❌ Pair Command Error:", err);
        await socket.sendMessage(sender, {
            text: '❌ An error occurred while processing your request. Please try again later.'
        }, { quoted: msg });
    }

    break;
    
    
    
    💐💐💐💐
    
    
          case "owner":
        {
          await dragon.sendMessage(from, { react: { text: `👤`, key: m.key } });
          const vcard =
            "BEGIN:VCARD\n" +
            "VERSION:3.0\n" +
            "FN:Sandaru \n" +
            "ORG:Owner;\n" +
            "TEL;type=CELL;type=VOICE;waid=94764497078:+94772797288\n" +
            "END:VCARD";

          

          await dragon.sendMessage(
            from,
            { contacts: { displayName: "Gay", contacts: [{ vcard }] } },
            { quoted: fkontak }
          );
        }
        break;

 case 'restart': {
                if (!isCreator) return reply(`This is a Owner Command ❌`)
                await dragon.sendMessage(from, { react: { text: `🔄`, key: m.key }});
                const { exec } = require("child_process")
                reply('*Done* ✅')
                await sleep(1500)
                exec("pm2 restart all")
            }
            break

  