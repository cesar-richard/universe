const bridgeIp = "192.168.1.44";
const username = "5y0aIt50T7P01K5LOWQ7uchE8srtK2ZUV7q2QwPG";
var unirest = require("unirest");

function GET(type, endpoint, params = {}) {
  call("GET", type, endpoint, params);
}

function PUT(type, endpoint, params = {}) {
  call("PUT", type, endpoint, params);
}

function call(method, type, endpoint, params) {
  const apicall = unirest(
    method,
    `http://${bridgeIp}/api/${username}/${type}${endpoint}`
  ).headers({
    "Content-Type": "application/json"
  });
  if (params.body) {
    apicall.send(JSON.stringify(params.body));
  }
  apicall.end(res => {
    if (res.error) throw new Error(res.error);
    if (params.callback) {
      params.callback(res);
    }
  });
}

module.exports = { GET, PUT };
