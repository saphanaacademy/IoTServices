var ws = require('nodejs-websocket');

var host = 'iotmms<userid>trial.hanatrial.ondemand.com';
var device = '<deviceid>';
var oAuthToken = '<oauthtoken>';
var messageType = '<messagetypeid>';

var path = '/com.sap.iotservices.mms/v1/api/ws/data/';

var options = {
	extraHeaders: {
		'Authorization': 'Bearer ' + oAuthToken,
		'Content-Type': 'application/json;charset=utf-8'
	}  
};

var connection = ws.connect('wss://' + host + path + device, options);

connection.on('connect', function() {
	console.log("Connected!");
	var jsonData = {
		"mode": "async",
		"messageType": messageType,
		"messages": [{
			"temperature": 43.21,
			"humidity": 87.65
			}]
	};
	var strData = JSON.stringify(jsonData);
	connection.sendText(strData);
});

connection.on('close', function() {
	console.log("Connection closed.");
});

connection.on('text', function(text) {
	console.log("From MMS:", text);
	connection.close();
});
