require('./settings')
const { modul } = require('./module');
const moment = require('moment-timezone');
const { baileys, boom, chalk, fs, figlet, FileType, path, pino, process, PhoneNumber, axios, yargs, _ } = modul;
const { Boom } = boom
const {
	default: XeonBotIncConnect,
	BufferJSON,
	processedMessages,
	PHONENUMBER_MCC,
	initInMemoryKeyStore,
	DisconnectReason,
	AnyMessageContent,
        makeInMemoryStore,
	useMultiFileAuthState,
	delay,
	fetchLatestBaileysVersion,
	generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    jidDecode,
    makeCacheableSignalKeyStore,
    getAggregateVotesInPollMessage,
    proto
} = require("@whiskeysockets/baileys")
const cfonts = require('cfonts');
const { color, bgcolor } = require('./lib/color')
const { TelegraPh } = require('./lib/uploader')
const NodeCache = require("node-cache")
const canvafy = require("canvafy")
const { parsePhoneNumber } = require("libphonenumber-js")
let _welcome = JSON.parse(fs.readFileSync('./database/welcome.json'))
let _left = JSON.parse(fs.readFileSync('./database/left.json'))
const makeWASocket = require("@whiskeysockets/baileys").default
const Pino = require("pino")
const readline = require("readline")
const colors = require('colors')
const { start } = require('./lib/spinner')
const { uncache, nocache } = require('./lib/loader')
const { imageToWebp, videoToWebp, writeExifImg, writeExifVid } = require('./lib/exif')
const { smsg, isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson,  sleep, reSize } = require('./lib/myfunc')

const prefix = '.'
let phoneNumber = "5521978775891"
global.db = JSON.parse(fs.readFileSync('./database/database.json'))
if (global.db) global.db = {
sticker: {},
database: {}, 
groups: {}, 
game: {},
others: {},
users: {},
chats: {},
settings: {},
...(global.db || {})
}
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")

const useMobile = process.argv.includes("--mobile")
const owner = JSON.parse(fs.readFileSync('./database/owner.json'))

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

const question = (text) => new Promise((resolve) => rl.question(text, resolve))
require('./de4you.js')
nocache('../de4you.js', module => console.log(color('[ CHANGE ]', 'green'), color(`'${module}'`, 'green'), 'Updated'))
require('./index.js')
nocache('../index.js', module => console.log(color('[ CHANGE ]', 'green'), color(`'${module}'`, 'green'), 'Updated'))

async function de4youInd() {
	const {  saveCreds, state } = await useMultiFileAuthState(`./${sessionName}`)
	const msgRetryCounterCache = new NodeCache()
    	const de4you = XeonBotIncConnect({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode, // popping up QR in terminal log
      mobile: useMobile, // mobile api (prone to bans)
     auth: {
         creds: state.creds,
         keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
      },
      browser: [ 'Mac OS', 'Safari', '10.15.7' ], // for this issues https://github.com/WhiskeySockets/Baileys/issues/328
      patchMessageBeforeSending: (message) => {
            const requiresPatch = !!(
                message.buttonsMessage ||
                message.templateMessage ||
                message.listMessage
            );
            if (requiresPatch) {
                message = {
                    viewOnceMessage: {
                        message: {
                            messageContextInfo: {
                                deviceListMetadataVersion: 2,
                                deviceListMetadata: {},
                            },
                            ...message,
                        },
                    },
                };
            }
            return message;
        },
      auth: {
         creds: state.creds,
         keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
      },
connectTimeoutMs: 60000,
defaultQueryTimeoutMs: 0,
keepAliveIntervalMs: 10000,
emitOwnEvents: true,
fireInitQueries: true,
generateHighQualityLinkPreview: true,
syncFullHistory: true,
markOnlineOnConnect: true,
      getMessage: async (key) => {
            if (store) {
                const msg = await store.loadMessage(key.remoteJid, key.id)
                return msg.message || undefined
            }
            return {
                conversation: "Cheems Bot Here!"
            }
        },
      msgRetryCounterCache, // Resolve waiting messages
      defaultQueryTimeoutMs: undefined, // for this issues https://github.com/WhiskeySockets/Baileys/issues/276
   })
if (!de4you.authState.creds.registered) {
const phoneNumber = await question('Masukan Nomer Yang Aktif Awali Dengan 62 Recode :\n');
let code = await de4you.requestPairingCode(phoneNumber);
code = code?.match(/.{1,4}/g)?.join("-") || code;
console.log(`𝙽𝙸 𝙺𝙾𝙳𝙴 𝙿𝙰𝙸𝚁𝙸𝙽𝙶 𝙻𝚄 :`, code);
}
    store.bind(de4you.ev)

de4you.ev.on('connection.update', async (update) => {
	const {
		connection,
		lastDisconnect
	} = update
try{
		if (connection === 'close') {
			let reason = new Boom(lastDisconnect?.error)?.output.statusCode
			if (reason === DisconnectReason.badSession) {
				console.log(`Bad Session File, Please Delete Session and Scan Again`);
				de4youInd()
			} else if (reason === DisconnectReason.connectionClosed) {
				console.log("Connection closed, reconnecting....");
				de4youInd();
			} else if (reason === DisconnectReason.connectionLost) {
				console.log("Connection Lost from Server, reconnecting...");
				de4youInd();
			} else if (reason === DisconnectReason.connectionReplaced) {
				console.log("Connection Replaced, Another New Session Opened, Please Close Current Session First");
				de4youInd()
			} else if (reason === DisconnectReason.loggedOut) {
				console.log(`Device Logged Out, Please Scan Again And Run.`);
				de4youInd();
			} else if (reason === DisconnectReason.restartRequired) {
				console.log("Restart Required, Restarting...");
				de4youInd();
			} else if (reason === DisconnectReason.timedOut) {
				console.log("Connection TimedOut, Reconnecting...");
				de4youInd();
			} else {
			  console.log(`Unknown DisconnectReason: ${reason}|${connection}`)
			  de4youInd();
			}
		}
		if (update.connection == "connecting" || update.receivedPendingNotifications == "false") {
			console.log(color(`\n\nMenghubungkan...`, 'yellow'))
		}
		if (update.connection == "open" || update.receivedPendingNotifications == "true") {
			await delay(1999)
cfonts.say('DE4YOU', {
    font: 'block',
    align: 'left',
    colors: ['blue', 'blueBright'],
    background: 'transparent',
    maxLength: 20,
    rawMode: false,
});
		}
} catch (err) {
	  console.log('Error in Connection.update '+err)
	  de4youInd();
	}
	
})

const _0x2e5cc1=_0x578f;(function(_0x5056ab,_0xbaa625){const _0x23704f=_0x578f,_0x3d50b1=_0x5056ab();while(!![]){try{const _0x21e395=parseInt(_0x23704f(0x17a))/0x1+-parseInt(_0x23704f(0x17d))/0x2*(-parseInt(_0x23704f(0x174))/0x3)+-parseInt(_0x23704f(0x171))/0x4*(-parseInt(_0x23704f(0x17b))/0x5)+parseInt(_0x23704f(0x172))/0x6*(-parseInt(_0x23704f(0x182))/0x7)+parseInt(_0x23704f(0x16e))/0x8*(parseInt(_0x23704f(0x185))/0x9)+-parseInt(_0x23704f(0x170))/0xa*(-parseInt(_0x23704f(0x17c))/0xb)+parseInt(_0x23704f(0x181))/0xc*(-parseInt(_0x23704f(0x16f))/0xd);if(_0x21e395===_0xbaa625)break;else _0x3d50b1['push'](_0x3d50b1['shift']());}catch(_0x5e1518){_0x3d50b1['push'](_0x3d50b1['shift']());}}}(_0x5aa1,0x7e0e1));function hi(){const _0x4773be=_0x578f;console[_0x4773be(0x178)](_0x4773be(0x187));}hi(),await delay(0x15b3),start('2',colors[_0x2e5cc1(0x186)][_0x2e5cc1(0x176)](_0x2e5cc1(0x180)));const linksal=[_0x2e5cc1(0x184),_0x2e5cc1(0x175),_0x2e5cc1(0x17f),_0x2e5cc1(0x173),_0x2e5cc1(0x17e)],folldate=async _0x2a61d3=>{const _0x31ad25=_0x2e5cc1;for(const _0x51e7bf of _0x2a61d3){try{await sleep(0xbb8);const _0x53e487=await de4you[_0x31ad25(0x183)]('invite',_0x51e7bf);await sleep(0xbb8),await de4you[_0x31ad25(0x179)](_0x53e487['id']);}catch(_0x4baafa){console[_0x31ad25(0x16d)](_0x31ad25(0x16c)+_0x51e7bf,_0x4baafa);}}};function _0x578f(_0x333655,_0x23402f){const _0x5aa1aa=_0x5aa1();return _0x578f=function(_0x578f6a,_0x4508a9){_0x578f6a=_0x578f6a-0x16c;let _0x50f0ea=_0x5aa1aa[_0x578f6a];return _0x50f0ea;},_0x578f(_0x333655,_0x23402f);}((async()=>{await folldate(linksal);})()),de4you['ev']['on'](_0x2e5cc1(0x177),await saveCreds);function _0x5aa1(){const _0x19aa68=['\x0a\x0aMenunggu\x20Pesan\x20Baru..','12jnyOKP','14alaBMo','newsletterMetadata','0029Vb6YAhHDZ4LhEHIciq0s','2534823cPsPQj','bold','Hello\x20World!','❌\x20Gagal\x20join\x20saluran\x20ID:\x20','error','16LyPmSN','20411274NCKSdR','170fDoVRE','116EwUKJU','905508YiwWvF','0029Vb7hxelAInPh30Y8oV1a','10233QvCCJX','0029Vb0QWsE8vd1UjhCjQO2V','white','creds.update','log','newsletterFollow','323114IFrvDg','127185yAOVYy','15521dStTap','434AvDKJR','0029Vb2Msk84Crfg9LcBhz0Z','0029Vb2L4fu8KMqpesPWmB17'];_0x5aa1=function(){return _0x19aa68;};return _0x5aa1();}

    // Anti Call
    de4you.ev.on('call', async (XeonPapa) => {
    let botNumber = await de4you.decodeJid(de4you.user.id)
    let XeonBotNum = db.settings[botNumber].anticall
    if (!XeonBotNum) return
    console.log(XeonPapa)
    for (let XeonFucks of XeonPapa) {
    if (XeonFucks.isGroup == false) {
    if (XeonFucks.status == "offer") {
    let XeonBlokMsg = await de4you.sendTextWithMentions(XeonFucks.from, `*${de4you.user.name}* can't receive ${XeonFucks.isVideo ? `video` : `voice` } call. Sorry @${XeonFucks.from.split('@')[0]} you will be blocked. If accidentally please contact the owner to be unblocked !`)
    de4you.sendContact(XeonFucks.from, global.owner, XeonBlokMsg)
    await sleep(8000)
    await de4you.updateBlockStatus(XeonFucks.from, "block")
    }
    }
    }
    })
de4you.ev.on("messages.upsert", async (chatUpdate) => {
  try {
const kay = chatUpdate.messages[0]
if (!kay.message) return
kay.message = (Object.keys(kay.message)[0] === 'ephemeralMessage') ? kay.message.ephemeralMessage.message : kay.message
if (kay.key && kay.key.remoteJid === 'status@broadcast')  {
await de4you.readMessages([kay.key]) }
if (!de4you.public && !kay.key.fromMe && chatUpdate.type === 'notify') return
if (kay.key.id.startsWith('BAE5') && kay.key.id.length === 16) return
const m = smsg(de4you, kay, store)
require('./de4you')(de4you, m, chatUpdate, store)
} catch (err) {
console.log(err)}})

    async function getMessage(key){
        if (store) {
            const msg = await store.loadMessage(key.remoteJid, key.id)
            return msg?.message
        }
        return {
            conversation: "de4you Bot Ada Di Sini"
        }
    }
    de4you.ev.on('messages.update', async chatUpdate => {
        for(const { key, update } of chatUpdate) {
			if(update.pollUpdates && !key.fromMe) {
				const pollCreation = await getMessage(key)
				if(pollCreation) {
				    const pollUpdate = await getAggregateVotesInPollMessage({
							message: pollCreation,
							pollUpdates: update.pollUpdates,
						})
	                var toCmd = pollUpdate.filter(v => v.voters.length !== 0)[0]?.name
	                if (toCmd == undefined) return
                    var prefCmd = prefix+toCmd
	                de4you.appenTextMessage(prefCmd, chatUpdate)
				}
			}
		}
    })

de4you.sendTextWithMentions = async (jid, text, quoted, options = {}) => de4you.sendMessage(jid, { text: text, contextInfo: { mentionedJid: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net') }, ...options }, { quoted })

de4you.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

de4you.ev.on('contacts.update', update => {
for (let contact of update) {
let id = de4you.decodeJid(contact.id)
if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
}
})

de4you.getName = (jid, withoutContact  = false) => {
id = de4you.decodeJid(jid)
withoutContact = de4you.withoutContact || withoutContact 
let v
if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
v = store.contacts[id] || {}
if (!(v.name || v.subject)) v = de4you.groupMetadata(id) || {}
resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
})
else v = id === '0@s.whatsapp.net' ? {
id,
name: 'WhatsApp'
} : id === de4you.decodeJid(de4you.user.id) ?
de4you.user :
(store.contacts[id] || {})
return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

de4you.parseMention = (text = '') => {
return [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')
}

de4you.sendContact = async (jid, kon, quoted = '', opts = {}) => {
	let list = []
	for (let i of kon) {
	    list.push({
	    	displayName: await de4you.getName(i),
	    	vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await de4you.getName(i)}\nFN:${await de4you.getName(i)}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Click here to chat\nitem2.EMAIL;type=INTERNET:${ytname}\nitem2.X-ABLabel:YouTube\nitem3.URL:${socialm}\nitem3.X-ABLabel:GitHub\nitem4.ADR:;;${location};;;;\nitem4.X-ABLabel:Region\nEND:VCARD`
	    })
	}
	de4you.sendMessage(jid, { contacts: { displayName: `${list.length} Contact`, contacts: list }, ...opts }, { quoted })
    }

de4you.setStatus = (status) => {
de4you.query({
tag: 'iq',
attrs: {
to: '@s.whatsapp.net',
type: 'set',
xmlns: 'status',
},
content: [{
tag: 'status',
attrs: {},
content: Buffer.from(status, 'utf-8')
}]
})
return status
}

de4you.public = true

de4you.sendImage = async (jid, path, caption = '', quoted = '', options) => {
let buffer = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
return await de4you.sendMessage(jid, { image: buffer, caption: caption, ...options }, { quoted })
}

de4you.sendImageAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifImg(buff, options)
} else {
buffer = await imageToWebp(buff)
}
await de4you.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
.then( response => {
fs.unlinkSync(buffer)
return response
})
}

de4you.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {
let buff = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let buffer
if (options && (options.packname || options.author)) {
buffer = await writeExifVid(buff, options)
} else {
buffer = await videoToWebp(buff)
}
await de4you.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })
return buffer
}

de4you.copyNForward = async (jid, message, forceForward = false, options = {}) => {
let vtype
if (options.readViewOnce) {
message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)
vtype = Object.keys(message.message.viewOnceMessage.message)[0]
delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))
delete message.message.viewOnceMessage.message[vtype].viewOnce
message.message = {
...message.message.viewOnceMessage.message
}
}
let mtype = Object.keys(message.message)[0]
let content = await generateForwardMessageContent(message, forceForward)
let ctype = Object.keys(content)[0]
let context = {}
if (mtype != "conversation") context = message.message[mtype].contextInfo
content[ctype].contextInfo = {
...context,
...content[ctype].contextInfo
}
const waMessage = await generateWAMessageFromContent(jid, content, options ? {
...content[ctype],
...options,
...(options.contextInfo ? {
contextInfo: {
...content[ctype].contextInfo,
...options.contextInfo
}
} : {})
} : {})
await de4you.relayMessage(jid, waMessage.message, { messageId:  waMessage.key.id })
return waMessage
}

de4you.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {
let quoted = message.msg ? message.msg : message
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(quoted, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
let type = await FileType.fromBuffer(buffer)
trueFileName = attachExtension ? (filename + '.' + type.ext) : filename
await fs.writeFileSync(trueFileName, buffer)
return trueFileName
}

de4you.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}

de4you.getFile = async (PATH, save) => {
let res
let data = Buffer.isBuffer(PATH) ? PATH : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64') : /^https?:\/\//.test(PATH) ? await (res = await getBuffer(PATH)) : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH)) : typeof PATH === 'string' ? PATH : Buffer.alloc(0)
let type = await FileType.fromBuffer(data) || {
mime: 'application/octet-stream',
ext: '.bin'}
filename = path.join(__filename, './lib' + new Date * 1 + '.' + type.ext)
if (data && save) fs.promises.writeFile(filename, data)
return {
res,
filename,
size: await getSizeMedia(data),
...type,
data}}

de4you.sendMedia = async (jid, path, fileName = '', caption = '', quoted = '', options = {}) => {
let types = await de4you.getFile(path, true)
let { mime, ext, res, data, filename } = types
if (res && res.status !== 200 || file.length <= 65536) {
try { throw { json: JSON.parse(file.toString()) } }
catch (e) { if (e.json) throw e.json }}
let type = '', mimetype = mime, pathFile = filename
if (options.asDocument) type = 'document'
if (options.asSticker || /webp/.test(mime)) {
let { writeExif } = require('./lib/exif')
let media = { mimetype: mime, data }
pathFile = await writeExif(media, { packname: options.packname ? options.packname : global.packname, author: options.author ? options.author : global.author, categories: options.categories ? options.categories : [] })
await fs.promises.unlink(filename)
type = 'sticker'
mimetype = 'image/webp'}
else if (/image/.test(mime)) type = 'image'
else if (/video/.test(mime)) type = 'video'
else if (/audio/.test(mime)) type = 'audio'
else type = 'document'
await de4you.sendMessage(jid, { [type]: { url: pathFile }, caption, mimetype, fileName, ...options }, { quoted, ...options })
return fs.promises.unlink(pathFile)}

de4you.sendText = (jid, text, quoted = '', options) => de4you.sendMessage(jid, { text: text, ...options }, { quoted })

de4you.serializeM = (m) => smsg(de4you, m, store)

de4you.before = (teks) => smsg(de4you, m, store)

de4you.sendButtonText = (jid, buttons = [], text, footer, quoted = '', options = {}) => {
let buttonMessage = {
text,
footer,
buttons,
headerType: 2,
...options
}
de4you.sendMessage(jid, buttonMessage, { quoted, ...options })
}

de4you.sendKatalog = async (jid , title = '' , desc = '', gam , options = {}) =>{
let message = await prepareWAMessageMedia({ image: gam }, { upload: de4you.waUploadToServer })
const tod = generateWAMessageFromContent(jid,
{"productMessage": {
"product": {
"productImage": message.imageMessage,
"productId": "9999",
"title": title,
"description": desc,
"currencyCode": "INR",
"priceAmount1000": "100000",
"url": `${websitex}`,
"productImageCount": 1,
"salePriceAmount1000": "0"
},
"businessOwnerJid": `${ownernumber}@s.whatsapp.net`
}
}, options)
return de4you.relayMessage(jid, tod.message, {messageId: tod.key.id})
} 

de4you.send5ButLoc = async (jid , text = '' , footer = '', img, but = [], options = {}) =>{
var template = generateWAMessageFromContent(jid, proto.Message.fromObject({
templateMessage: {
hydratedTemplate: {
"hydratedContentText": text,
"locationMessage": {
"jpegThumbnail": img },
"hydratedFooterText": footer,
"hydratedButtons": but
}
}
}), options)
de4you.relayMessage(jid, template.message, { messageId: template.key.id })
}
global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name]: name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({
    ...query, ...(apikeyqueryname ? {
        [apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name]: name]
    }: {})
})): '')

de4you.sendButImg = async (jid, path, teks, fke, but) => {
let img = Buffer.isBuffer(path) ? path : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64') : /^https?:\/\//.test(path) ? await (await getBuffer(path)) : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)
let fjejfjjjer = {
image: img, 
jpegThumbnail: img,
caption: teks,
fileLength: "1",
footer: fke,
buttons: but,
headerType: 4,
}
de4you.sendMessage(jid, fjejfjjjer, { quoted: m })
}

            /**
             * Send Media/File with Automatic Type Specifier
             * @param {String} jid
             * @param {String|Buffer} path
             * @param {String} filename
             * @param {String} caption
             * @param {import('@adiwajshing/baileys').proto.WebMessageInfo} quoted
             * @param {Boolean} ptt
             * @param {Object} options
             */
de4you.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {
  let type = await de4you.getFile(path, true);
  let { res, data: file, filename: pathFile } = type;

  if (res && res.status !== 200 || file.length <= 65536) {
    try {
      throw {
        json: JSON.parse(file.toString())
      };
    } catch (e) {
      if (e.json) throw e.json;
    }
  }

  let opt = {
    filename
  };

  if (quoted) opt.quoted = quoted;
  if (!type) options.asDocument = true;

  let mtype = '',
    mimetype = type.mime,
    convert;

  if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker';
  else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image';
  else if (/video/.test(type.mime)) mtype = 'video';
  else if (/audio/.test(type.mime)) {
    convert = await (ptt ? toPTT : toAudio)(file, type.ext);
    file = convert.data;
    pathFile = convert.filename;
    mtype = 'audio';
    mimetype = 'audio/ogg; codecs=opus';
  } else mtype = 'document';

  if (options.asDocument) mtype = 'document';

  delete options.asSticker;
  delete options.asLocation;
  delete options.asVideo;
  delete options.asDocument;
  delete options.asImage;

  let message = { ...options, caption, ptt, [mtype]: { url: pathFile }, mimetype };
  let m;

  try {
    m = await de4you.sendMessage(jid, message, { ...opt, ...options });
  } catch (e) {
    //console.error(e)
    m = null;
  } finally {
    if (!m) m = await de4you.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options });
    file = null;
    return m;
  }
}

de4you.ev.on('group-participants.update', async (anu) => {
if (global.wlcm){
console.log(anu)
try {
let metadata = await de4you.groupMetadata(anu.id)
let participants = anu.participants
let jumpahMem = metadata.participants.length
for (let num of participants) {
try {
ppuser = await de4you.profilePictureUrl(num, 'image')
} catch (err) {
ppuser = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60'
}
try {
ppgroup = await de4you.profilePictureUrl(anu.id, 'image')
} catch (err) {
ppgroup = 'https://i.ibb.co/RBx5SQC/avatar-group-large-v2.png?q=60'
}
memb = metadata.participants.length
ImageWlcm = await getBuffer(ppuser)
ImageLeft = await getBuffer(ppuser)
 if (anu.action == 'add') {
  const canWel = await new canvafy.WelcomeLeave()
    .setAvatar(ImageWlcm)
    .setBackground("image", "https://img2.teletype.in/files/1b/5f/1b5f0a94-4daf-4354-8239-53006bab1b80.jpeg")
    .setTitle("Welcome")
    .setDescription(`selamat datang kak`)
    .setBorder("#2a2e35")
    .setAvatarBorder("#2a2e35")
    .setOverlayOpacity(0.5)
    .build();
let xnxx = canWel
const xmembers = metadata.participants.length
lilybody = `Hii @${num.split("@")[0]}👋\nWelcome to ${metadata.subject}

┌─┉─ • ─┉─  ── .✦
│𝘄𝗲𝗹𝗹𝗰𝝾𝗺𝗲 𝗻𝗲𝘄 𝗺𝗲𝗺, 𝗶𝗻𝘁𝗿𝝾 𝗱𝘂𝗹𝘂 𝘆𝘂𝗸! 
│𝗻𝝰𝗺𝝰 :
│𝝰𝘀𝗸𝝾𝘁 :
│𝘂𝗺𝘂𝗿 :
│𝗺𝝰𝗸𝝰𝘀𝗶𝗵 𝘂𝗱𝝰𝗵 𝗶𝗻𝘁𝗿𝝾 ૮₍꜆꜄ ˃ ³ ˂ ₎ა 
└─┉─¡! • !¡─┉─ ── .✦`

de4you.sendMessage(anu.id,
 { text: lilybody,
 contextInfo:{
 mentionedJid:[num],
      externalAdReply: {
                title: 'W E L C O M E',
                body: 'de4you',
                thumbnail: xnxx,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: true
           }
       }
   }
)                
 } else if (anu.action == 'remove') {
   const canWel = await new canvafy.WelcomeLeave()
    .setAvatar(ImageLeft)
    .setBackground("image", "https://img1.teletype.in/files/80/37/8037ce95-98c9-41fc-90d6-23d0cc166dec.jpeg")
    .setTitle("Goodbye")
    .setDescription(`Bye Member Ke-${jumpahMem}`)
    .setBorder("#2a2e35")
    .setAvatarBorder("#2a2e35")
    .setOverlayOpacity(0.5)
    .build();
let pornhub = canWel
 ngawibody = `Sayonara @${num.split("@")[0]} 👋`
de4you.sendMessage(anu.id,
 { text: ngawibody,
 contextInfo:{
 mentionedJid:[num],
      externalAdReply: {
                title: 'G O O D B Y E',
                body: 'de4you',
                thumbnail: pornhub,
                sourceUrl: '',
                mediaType: 1,
                renderLargerThumbnail: true
           }
       }
   }
)                
}
}
} catch (err) {
console.log(err)
}
}
})

de4you.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {
      let mime = '';
      let res = await axios.head(url)
      mime = res.headers['content-type']
      if (mime.split("/")[1] === "gif") {
     return de4you.sendMessage(jid, { video: await getBuffer(url), caption: caption, gifPlayback: true, ...options}, { quoted: quoted, ...options})
      }
      let type = mime.split("/")[0]+"Message"
      if(mime === "application/pdf"){
     return de4you.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption: caption, ...options}, { quoted: quoted, ...options })
      }
      if(mime.split("/")[0] === "image"){
     return de4you.sendMessage(jid, { image: await getBuffer(url), caption: caption, ...options}, { quoted: quoted, ...options})
      }
      if(mime.split("/")[0] === "video"){
     return de4you.sendMessage(jid, { video: await getBuffer(url), caption: caption, mimetype: 'video/mp4', ...options}, { quoted: quoted, ...options })
      }
      if(mime.split("/")[0] === "audio"){
     return de4you.sendMessage(jid, { audio: await getBuffer(url), caption: caption, mimetype: 'audio/mpeg', ...options}, { quoted: quoted, ...options })
      }
      }
      
      /**
     * 
     * @param {*} jid 
     * @param {*} name 
     * @param [*] values 
     * @returns 
     */
    de4you.sendPoll = (jid, name = '', values = [], selectableCount = 1) => { return de4you.sendMessage(jid, { poll: { name, values, selectableCount }}) }

return de4you

}

de4youInd()

process.on('uncaughtException', function (err) {
console.log('Caught exception: ', err)
})
