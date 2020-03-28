const genericApi = require("./genericApi");

function list(callback) {
  genericApi.GET("lights", "", callback);
}

module.exports = { list };
