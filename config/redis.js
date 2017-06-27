var redis = require('redis'),
 logger = require('mm-node-logger')(module),
 config = require('./config');

var redisClient = redis.createClient(config.redis.port, config.redis.host);

redisClient.on('connect', function () {
  logger.info('Reddis connected to ' + config.redis.host + ':' + config.redis.port);
});

redisClient.on('error', function (err) {
  logger.error('Redis error: ' + err);
});

if (config.redis.options.password != '') {
  redisClient.auth(config.redis.options.password);
}
module.exports = redisClient;
