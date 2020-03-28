const genericApi = require("./genericApi");

function list(callback) {
  genericApi.GET("scenes", "", callback);
}

module.exports = { list };
