const express = require('express')
// const io = require('socket.io')(80)
const exphbs  = require('express-handlebars')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/',(req, res) => {
    res.render('home')
});

app.use(express.static( __dirname + '/public'))

io.on('connection', (socket) => {
  console.log('conectado')

  socket.on('disconnect', () => {
    console.log('desconectado')
  })
  socket.on('chat send', (msg) => {
    io.emit('chat message', msg)
  })
})

http.listen(8080)
