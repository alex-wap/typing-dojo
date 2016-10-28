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
  clients.push(socket.id);
  console.log("User connected");
  io.emit('total users', io.engine.clientsCount);
  
socket.on("game on", function (data){
  socket.emit('player join');
})

})
