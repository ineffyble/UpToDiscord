'use strict';
const BPromise = require('bluebird');

const upClient = require('../../../up');
const UP_API_WEBHOOKS_PATH = `webhooks`

const webhookObject = (endpoint) => {
  return {
    data: {
      attributes: {
        url: endpoint,
        description: 'UpToDiscord'
      }
    }
  };
}

module.exports = {
  registerWebhook () {
    const endpoint = this.variables.endpoint;
    const webhook = this.variables.webhook;
    if (webhook) {
      this.logger.log('Up webhook already exists, nothing to do');
      return BPromise.resolve();
    } else {
      this.logger.log('Up webhook does not exist, creating webhook');
      return upClient.post(UP_API_WEBHOOKS_PATH, {
        json: webhookObject(endpoint)
      }).then(( { body: result }) => {
        this.logger.log('Up webhook created');
        let newWebhook = JSON.parse(result);
        this.variables.webhook = newWebhook["data"];
        return BPromise.resolve();
      });
    }
  }
}