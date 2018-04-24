const bodyParser = require('body-parser')
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var axios = require('axios')
var port = process.env.PORT || 3000;

app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.post('/restart', function (req, res) {
  console.log(req.body)
  io.emit('restart', JSON.stringify(req.body))
  res.send()
});

app.post('/maintenance', function (req, res) {
  console.log(req.body)
  io.emit('maintenance', JSON.stringify(req.body))
  res.send()
});

var sendEvent = event => {
  axios.post('https://paas-bizagi-commands.centralus-1.eventgrid.azure.net/api/events', event, {
    headers:
      {
        'aeg-sas-key': 'JbnuyKZUgHtxD/LTJkasGXvkThUqDA0rqfwemV5CINI=',
        'Content-Type': 'application/json'
      }
  })
  .then(response => console.log('event send'))
}

io.on('connection', function (socket) {
  socket.on('restart', function (data) {
    var event = [
      {
        id: "1",
        eventType: "restart",
        subject: "myapp/vehicles/motorcycles",
        eventTime: "2018-04-23T15:57:18-0500",
        data: data,
        dataVersion: "1.0"
      }
    ]
    console.log(event)
    sendEvent(event)
  });
  socket.on('maintenance', function (data) {
    var event = [
      {
        id: "1",
        eventType: "maintenance",
        subject: "myapp/vehicles/motorcycles",
        eventTime: "2018-04-23T15:57:18-0500",
        data: data,
        dataVersion: "1.0"
      }
    ]
    console.log(event)
    sendEvent(event)
  });
});

http.listen(port, function () {
  console.log('listening on *:' + port);
});



