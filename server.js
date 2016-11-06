//////////////////////////////////////////////////////////
//                      Requires                        //
//////////////////////////////////////////////////////////
var bodyParser      = require("body-parser"),
    express         = require("express"),
    path            = require("path"),
    port            = require(path.join(__dirname,"./server/config/settings.js")).port,
    app             = express(),
    clients         = [];

////////////////////////////////////////////////////////////
//             App.use (Body Parser, Static)              //
////////////////////////////////////////////////////////////
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "./client")));

////////////////////////////////////////////////////////////
//                        Mongoose                        //
////////////////////////////////////////////////////////////
require('./server/config/mongoose.js');
////////////////////////////////////////////////////////////
//                         Routes                         //
////////////////////////////////////////////////////////////
require('./server/config/routes.js')(app)

////////////////////////////////////////////////////////////
//                     Listen to Port                     //
////////////////////////////////////////////////////////////
var server = app.listen(port, function() {
    console.log("Typing Dojo! ("+port+")");
})

var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
  clients.push(socket);
  console.log("User connected");
  console.log(clients.length);

  socket.on('disconnect', function(socket) {
    var i = clients.indexOf(socket);
    clients.splice(i, 1);
    console.log(clients.length);
    io.emit('player join', clients.length);
  });

  io.emit('total users', clients.length);
  if (io.engine.clientsCount > 1){
    console.log('start game countdown');

  }

  socket.on("update",function(data){
    socket.broadcast.emit('update position', data); 
  })

  // setInterval(function(){
  //   socket.emit('update position', 'Cow goes moo'); 
  // }, 2000);

  
socket.on("game on", function (data){
  io.emit('player join', clients.length);
})

})
