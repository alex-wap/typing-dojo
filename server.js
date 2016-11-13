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

// on connection
io.sockets.on('connection', function (socket) {
  // add id to client list
  clients.push(socket.id);

  // update client list on client
  io.emit('all users', clients);
  // console.log("User connected");
  // console.log(clients.length);

  // update client list on disconnect
  socket.on('disconnect', function(socket) {
    var i = clients.indexOf(socket.id);
    clients.splice(i, 1);
    console.log(clients.length);
    // update client list on client
    io.emit('all users', clients);
  });


  // broadcast positions
  socket.on("update",function(data){
    socket.broadcast.emit('update position', data); 
  })

  // setInterval(function(){
  //   socket.emit('update position', 'Cow goes moo'); 
  // }, 2000);

  // start game if client count is greater than 1
  socket.on("game on", function (data){
    if (io.engine.clientsCount > 1){
      io.emit('player join', clients);
    }
  })

})
