var config = {};

config.server       = {};
config.database     = {};
//environment variables
config.server.host  = "localhost";
config.server.port          = process.env.port || 8001;
config.database.name        = 'florida',
config.database.user        = 'root';
config.database.password    = 'root';

module.exports = config;
