'use strict';
const BPromise = require('bluebird');

const upClient = require('../../../up');
const UP_API_WEBHOOKS_PATH = `webhooks`

module.exports = {
  getWebhook () {
    const endpoint = this.variables.endpoint;
    return upClient(UP_API_WEBHOOKS_PATH).then(({ body: result }) => {
      const response = JSON.parse(result);
      if (response.links.next !== null) {
        this.logger.log('Unhandled scenario: more than one page of existing webhooks - this may result in expected behaviour');
      }
      const webhook = response["data"].find((hook) => (hook["attributes"]["url"] == endpoint));
      this.variables.webhook = webhook;
      return BPromise.resolve();
    });
  }
}