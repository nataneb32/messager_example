import { createMessageRepository } from './src/repository/messageRepository'
import { createMessageService } from './src/service/message'
import * as path from 'path'
import { connect } from 'mongoose'
// const io = require('socket.io')(80)
import Handlebars from 'handlebars'

const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
connect('mongodb://localhost/test', { useNewUrlParser: true })

const messageRepo = createMessageRepository()
const messageService = createMessageService(messageRepo)

Handlebars.registerHelper('renderMsgs', function (msgs, block) {
  var accum = ''
  for (var i = 0; i < msgs.length; i++) {
    block.data.body = msgs[i].body
    block.data.username = msgs[i].username
    accum += block.fn(this)
  }
  console.log(accum)
  return accum
})

app.engine('handlebars', exphbs())
app.set('view engine', 'handlebars')

app.get('/', async (req, res) => {
  const to = new Date()
  const from = new Date()
  from.setHours(from.getHours() - 2)

  const oldMsgs = await messageService.getMessages(from, to)
  res.render('home', { oldMsgs })
})

app.get('/msgs', async (req, res) => {
  const to = new Date()
  const from = new Date()
  from.setHours(from.getHours() - 2)
  console.log(to.toString(), from.toString())
  res.json(await messageService.getMessages(from, to))
})

app.use(express.static(path.join(__dirname, '/public')))

function broadcastMessage (msg) {
  io.emit('chat message', msg)
}

io.on('connection', (socket) => {
  console.log('conectado')

  socket.on('disconnect', () => {
    console.log('desconectado')
  })
  socket.on('chat send', (msg) => {
    if (!msg.username | !msg.body) {
      return
    }
    messageService.sendMessage(msg, broadcastMessage)
  })
})

http.listen(8080)
