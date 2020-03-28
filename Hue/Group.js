const genericApi = require("./genericApi");

function action(groupId, params) {
  genericApi.PUT("groups", `/${groupId}/action`, params);
}

function list(params) {
  genericApi.GET("groups", "", params);
}

module.exports = { action, list };
