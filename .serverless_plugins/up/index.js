'use strict';
const BPromise = require('bluebird');
const got = require('got');

const getEndpoint = require('./lib/get-endpoint');
const getWebhook = require('./lib/get-webhook');
const registerWebhook = require('./lib/register-webhook');
const pingWebhook = require('./lib/ping-webhook');

class Up {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    this.logger = this.serverless.cli;
    this.provider = this.serverless.getProvider(this.serverless.service.provider.name);
    this.variables = {};
    Object.assign(this, getEndpoint, getWebhook, registerWebhook, pingWebhook);

    this.commands = {
      'up:register': {
        usage: 'Creates a new Up webhook pointing to your AWS API Gateway endpoint',
        lifecycleEvents: ['register']
      },
      'up:ping': {
        usage: 'Pings the Up webhook pointing at your AWS API Gateway endpoint, which should result in a Discord message',
        lifecycleEvents: ['ping']
      }
    };

    this.hooks = {
      'up:register:register': () => BPromise.bind(this)
                                            .then(() => this.logger.log('Registering webhook with Up'))
                                            .then(this.getEndpoint)
                                            .then(this.getWebhook)
                                            .then(this.registerWebhook)
                                            .then(this.pingWebhook),
      'up:ping:ping': () => BPromise.bind(this)
                            .then(() => this.logger.log('Pinging Up webhook'))
                            .then(this.getEndpoint)
                            .then(this.getWebhook)
                            .then(this.pingWebhook),
      'after:deploy:deploy': () => serverless.pluginManager.run(['up:register']),
    };
  }
}

module.exports = Up;