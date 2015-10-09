var http = require('https');

var host = 'iotmms<userid>trial.hanatrial.ondemand.com';
var device = '<deviceid>';
var oAuthToken = '<oauthtoken>';
var messageType = '<messagetypeid>';

var path = '/com.sap.iotservices.mms/v1/api/http/data/';

var options = {
	host: host,
	port: 443,
	path: path + device,
	agent: false,
	headers: {
		'Authorization': 'Bearer ' + oAuthToken,
		'Content-Type': 'application/json;charset=utf-8'
	},
	method: 'POST'     
};
options.agent = new http.Agent(options);
callback = function(response) {
	var body = '';
	response.on('data', function (data) {
		body += data;
		console.log(body);
	});
	response.on('end', function () {
		console.log("From MMS:", response.statusCode, body);
	});
	response.on('error', function(e) {
		console.error(e);
	});
}

var req = http.request(options, callback);

req.on('error', function(e) {
	console.error(e);
});

req.shouldKeepAlive = true;

var jsonData = {
	"mode": "async",
	"messageType": messageType,
	"messages": [{
		"temperature": 12.34,
		"humidity": 56.78
		}]
}
var strData = JSON.stringify(jsonData);

req.write(strData);
req.end();
