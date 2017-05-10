var webApp = require("express")();
var http = require("http");
var server = http.Server(webApp);
var io = require("socket.io")(http);
var crypto = require("crypto");
io.listen(server);
var fs = require("fs");

server.listen(9000,function() {
	console.log("listening to port 9000");
});

					
webApp.get('/',function(req,res) {console.log("get request: " + req.url);
	var homePage = fs.readFileSync("index.html");
	res.write(homePage);
	res.end();
});

webApp.get('/*',function(req,res) {console.log("get path request: " + req.url);
	/*
	var url = req.url;
	var path = url.substr(url.indexOf("/") + 1,url.length);
	var file = fs.readFileSync(path);
	res.writeHead(200, {
        //'Access-Control-Allow-Origin': '*',
        'ETag': "666666",
        'Cache-Control': 'max-age=31536000, public'
      });
	res.write(file);
	res.end();
	*/
	handleFile(req,res);
});

var getHash = function (str) {
    var shasum = crypto.createHash('sha1');
    return shasum.update(str).digest('base64');
};

var handleFile = function (req, res) {
	var fileName = req.url.substr(req.url.indexOf("/") + 1,req.url.length);
	fs.stat(fileName,function(err,stat){
		var lastModified = stat.mtime.toUTCString();
		var modifiedSince = req.headers['If-Modified-Since'];
		if(modifiedSince && lastModified == modifiedSince) {
			res.writeHead(304, "Not Modified");
            res.end();
		}
		else {
			fs.readFile(fileName, function(err, file) {
				var hash = getHash(file);
				var noneMatch = req.headers['if-none-match'];
				if (noneMatch && hash === noneMatch) {
					res.writeHead(304, "Not Modified");
					res.end();
				} else {
				    //the ETag and Last-Modified are not working on Chrome for xhr type
					res.setHeader("ETag", hash);
					res.setHeader("Last-Modified",lastModified);//this header can not update the time in 'If-Modified-Since' of next request,why???
					//res.setHeader("Cache-Control", "max-age=86400, public"); //this only works on firefox
					//var expires = new Date();
                    //expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000); //expires in one day
                    //res.setHeader("Expires", expires.toUTCString());
					res.writeHead(200, "Ok");
					res.end(file);
				}
			});
		}
	});
    
};
				
var userProfiles = {};

io.on("connection",function(socket) {
	console.log("Get a connection request");
	socket.on("online",function(info) {
		console.log("User(" + info.peerId + ") is online,others=" + Object.keys(userProfiles));
		socket.name = info.peerId;
		io.emit("online",{peerId:info.peerId});
		var loginedUserNameList = {};
		for(var peerId in userProfiles) {
			if(userProfiles[peerId].userName) {
				loginedUserNameList[peerId] = {userName:userProfiles[peerId].userName,homeIndex:userProfiles[peerId].homeIndex};
			}
			for(var name in userProfiles[peerId]) {
				if(name.substring(0,5) == 'Robot') {
					loginedUserNameList[peerId][name] = {homeIndex:userProfiles[peerId][name].homeIndex};
				}
			}
		}
		socket.emit("env",{peerIdList:Object.keys(userProfiles),loginedUserNameList:loginedUserNameList});
		userProfiles[info.peerId] = {socket:socket};
	});
	
	socket.on("offer",function(info) {
		console.log("Got a offer from " + socket.name + ", and will send to " + Object.keys(info));
		for(var peerId in info) {
			userProfiles[peerId].socket.emit("offer",{peerId:socket.name,offer:info[peerId]});
			console.log("Sent offer to " + peerId);
		}
	});
	
	socket.on("answer",function(info) {
		console.log("Got a answer from " + socket.name + ", and will send to " + Object.keys(info));
		for(var peerId in info) {
			userProfiles[peerId].socket.emit("answer",{peerId:socket.name,answer:info[peerId]});
			console.log("Sent answer to " + peerId);
		}
	});
	
	socket.on("login",function(info) {
		if(info.userName.substring(0,5) == 'Robot') {
			userProfiles[info.peerId][info.userName.substring(0,info.userName.indexOf('_'))] = {homeIndex:info.homeIndex};
			console.log("Robot " + info.userName + " login");
		}
		else {
			userProfiles[info.peerId].userName = info.userName;
			userProfiles[info.peerId].homeIndex = info.homeIndex;
			console.log("User " + info.userName + " login");
		}
		io.emit('login',{peerId:info.peerId,userName:info.userName,homeIndex:info.homeIndex});
	});
	
	socket.on("logout",function(info) {
		if(userProfiles[info.peerId]) {
			if(info.userName.substring(0,5) == 'Robot') {
				console.log("Robot " + info.userName + " logout");
				delete userProfiles[info.peerId][info.userName.substring(0,info.userName.indexOf('_'))]
			}
			else {
				console.log("User " + info.userName + " logout");
				delete userProfiles[info.peerId];
			}
			io.emit("logout",{peerId:info.peerId,userName:info.userName});
			
		}
	});
	
	socket.on("ice",function(info) {
		console.log("User " + socket.name + " sent ice to "+ info.peerId);
		userProfiles[info.peerId].socket.emit("ice",{peerId:socket.name,candidate:info.candidate});
	});
	
	socket.on("message",function(msg) {
		io.emit("message",msg);
		console.log("User " + userProfiles[socket.name].userName + " broadcast a msg: " + msg);
	});

});