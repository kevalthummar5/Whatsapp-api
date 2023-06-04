const { MessageMedia, Client, LocalAuth } = require("whatsapp-web.js")

const express = require("express")
const multer = require("multer")

let filePath = null

const app = express()
const fileStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, __dirname + `/pdf`)
   },
   filename: (req, file, cb) => {
      const date = Date.now()
      cb(null, date + "-" + file.originalname)
      filePath = `${__dirname}/pdf/${date}-${file.originalname}`
   }
})
const upload = multer({ storage: fileStorage })

app.post("/upload", upload.single("file"), (req, res) => {
   const { mobileNumber } = req.body
   const file = req.file
   if (!mobileNumber || !file) {
      return res.status(400).json({ error: "mobileNumber and file are required" })
   }
   console.log(typeof mobileNumber)
   console.log(/^\d{10}$/.test(mobileNumber))
   if (/^\d{10}$/.test(mobileNumber)) {
      const media = MessageMedia.fromFilePath(filePath)
      client.sendMessage(`91${mobileNumber}@c.us`, "here is your invoice")
      client.sendMessage(`91${mobileNumber}@c.us`, media)
      res.json({ message: "File uploaded successfully" })
   } else {
      return res.status(401).json({ error: "mobileNumber should be 10 digit" })
   }
})
const client = new Client({
   puppeteer: {
      executablePath: "/usr/bin/brave-browser-stable"
   },
   authStrategy: new LocalAuth({
      clientId: "client-one"
   }),
   puppeteer: {
      headless: false
   }
})
// client.on("qr", (qr) => {
//    qrcode.generate(qr, { small: true })
// })

client.on("ready", () => {
   console.log("Client is ready!")
   // client.sendMessage("919924241202@c.us", "hii rohitya pada")
})

client.on("authenticated", (session) => {
   console.log("WHATSAPP WEB => Authenticated")
})

client.initialize()

app.listen(3100, () => {
   console.log("server run on 3100")
})
