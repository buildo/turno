exports.handleUrlVerification = function(body) {
  return { statusCode: 200, body: body.challenge };
};
