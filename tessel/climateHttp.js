var tessel = require('tessel');
var climatelib = require('climate-si7020');
var climate = climatelib.use(tessel.port['A']);

var host = 'iotmms<userid>trial.hanatrial.ondemand.com';
var device = '<deviceid>';
var oAuthToken = '<oauthtoken>';
var messageType = '<messagetypeid>';

var path = '/com.sap.iotservices.mms/v1/api/http/data/';

function climateHttpSend(temp, humid) {
    var http = require('https');
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
			"temperature": temp,
			"humidity": humid
			}]
	}
	var strData = JSON.stringify(jsonData);
	req.write(strData);
	req.end();
};

climate.on('ready', function () {
  console.log('Connected to si7020');
  // Loop forever
  setImmediate(function loop () {
    climate.readTemperature('f', function (err, temp) {
      climate.readHumidity(function (err, humid) {
		climateHttpSend(temp, humid); 
		//console.log('Temperature:', temp.toFixed(4) + 'F', 'Humidity:', humid.toFixed(4) + '%RH');
        setTimeout(loop, 1000);
      });
    });
  });
});

climate.on('error', function(err) {
  console.log('error connecting module', err);
});
