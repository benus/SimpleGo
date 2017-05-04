var webApp = require("express")();
var http = require("http");
var server = http.Server(webApp);
var io = require("socket.io")(http);
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
	var url = req.url;
	var path = url.substr(url.indexOf("/") + 1,url.length);
	var file = fs.readFileSync(path);
	res.write(file);
	res.end();
});
				
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