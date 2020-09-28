const express = require('express')
// const io = require('socket.io')(80)
const exphbs  = require('express-handlebars')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

import {createMessageRepository} from './src/repository/messageRepository'
import {createMessageService} from './src/service/message'

import {connect} from 'mongoose'
connect('mongodb://localhost/test', {useNewUrlParser: true});

const messageRepo = createMessageRepository()
const messageService = createMessageService(messageRepo)

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/',async (req, res) => {
    res.render("home")
});

app.get('/msgs', async (req, res) => {
  res.json(await messageRepo.getMessages({}))
})

app.use(express.static( __dirname + '/public'))

function broadcastMessage(msg) {
  io.emit('chat message', msg)
}

io.on('connection', (socket) => {
  
  console.log('conectado')
  
  socket.on('disconnect', () => {
    console.log('desconectado')
  })
  socket.on('chat send', (msg) => {
    if(!msg.username | !msg.body) {
      return
    }
    messageService.sendMessage(msg, broadcastMessage)
  })
})

http.listen(8080)
