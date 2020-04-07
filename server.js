var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var cors = require('cors');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

var Message = mongoose.model('Message',{
  name : String,
  message : String
})

var dbUrl = 'mongodb://root:root123@ds145669.mlab.com:45669/chat-app'

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.post('/messages', (req, res) => {
  var message = new Message(req.body);
  message.save((err) =>{
    if(err)
      sendStatus(500);
    io.emit('message', req.body);
    res.sendStatus(200);
  })
})

io.on('connection', () =>{
  console.log('New connection made');
});

mongoose.connect(dbUrl ,{ useNewUrlParser: true, useUnifiedTopology: true } ,(err) => {
    if(err)
        console.log('Error connecting to Mongo db: ' + err)
    else
        console.log('Connected to Mongo db');
});

var server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});