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

var paragraphs = ["Right now there are three people in chat, but there's no way of knowing exactly who until you are in there, and the chat room she finds not so comforting.",
                        "Prior to joining our bootcamp, we want to get you up to speed with our learning platform as you will be spending a lot of time learning new concepts.",
                        "Never gonna give you up, never gonna let you down. Never gonna run around and desert you. Never gonna make you cry, never gonna say goodbye.",
                        "First appearing in 1991, Python is a general-purpose, high-level, interpreted programming language whose design focus emphasizes code readability.",
                        "As you progress through the platform, you'll be seeing snippets of code that will help you complete the assignments.",
                        "There are three ways of attaching CSS to a document: inline, internal, and external. Inline and internal CSS are considered to be bad practices.",
                        "Why is jQuery useful? First, it saves you tons of lines of code. Look at the script file for jQuery when you get a chance.",
                        "The next step in becoming familiar with the terminal is being well acquainted with version control with Git.",
                        "With the introduction of Swift, there really is never a better time to get into iOS development. Here are some of the prerequisites for this course.",
                        "At this stage of the bootcamp, many people ask whether they are following best practices or not. This is an important question, and we want to address this to everyone.",
                        "For web developers, URLs, files, or code that are specifically designed to be used by other developers are called APIs."
                        ];

var paragraph;
var room;

// on connection
io.sockets.on('connection', function (socket) {
  if (io.engine.clientsCount % 2 == 1){
    clients.push(socket.id);
    room = socket.id;
    socket.join(room);
    console.log("number of users in room "+ room +": "+io.sockets.adapter.rooms[room].length)
  }
  // if (io.engine.clientsCount > 2){
  //   io.to(socket.id).emit('sorry');
  //   socket.disconnect();
  // } 
  if (io.engine.clientsCount % 2 == 0){
    // update client list on client
    socket.join(room);
    clients.push(socket.id);
    console.log("number of users in room "+ room +": "+io.sockets.adapter.rooms[room].length)
    io.to(room).emit('game start', clients);
  }


  // update client list on disconnect
  socket.on('disconnect', function(socket) {
    var i = clients.indexOf(socket.id);
    clients.splice(i, 1);
    console.log(clients.length);
    // update client list on client
    // io.emit('all users', clients);
  });


  // broadcast positions
  socket.on("update",function(data){
    console.log(data);
    console.log(socket.id);
    data["id"] = socket.id
    socket.broadcast.emit('update position', data); 
  })

  // setInterval(function(){
  //   socket.emit('update position', 'Cow goes moo'); 
  // }, 2000);

  // start game if client count is greater than 1
  socket.on("game on", function (data){
    if (io.sockets.adapter.rooms[room].length == 2){
      var paragraph = paragraphs[Math.floor(Math.random()*paragraphs.length)] // change for 3+ players
      io.to(room).emit('show paragraph', paragraph);
      io.to(room).emit('player join', clients);
    }
  })

})
