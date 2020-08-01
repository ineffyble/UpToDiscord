'use strict';

const upClient = require('./up');
const Discord = require('discord.js');

const DISCORD_WEBHOOK_ID = process.env.DISCORD_WEBHOOK_ID;
const DISCORD_WEBHOOK_SECRET = process.env.DISCORD_WEBHOOK_SECRET;

const UP_API_TRANSACTION_DETAILS_PATH = `transactions`
const UP_PING_WEBHOOK_TYPE = 'PING';
const UP_TRANSACTION_CREATED_WEBHOOK_TYPE = 'TRANSACTION_CREATED';

const getTransactionDetails = async (id) => {
  const transactionPath = `${UP_API_TRANSACTION_DETAILS_PATH}/${id}`;
  return upClient(transactionPath);
}

const getTransactionIdFromWebhook = (webhook) => {
  return webhook["data"]["relationships"]["transaction"]["data"]["id"];
}

const createDiscordTransactionEmbed = (transaction) => {
  const embed = new Discord.MessageEmbed()
    .setColor('#ff7a64')
    .setTitle('New transaction');
  const trans = [
      ['Description', transaction["data"]["attributes"]["description"]],
      ['Amount',  '$' + parseInt(transaction["data"]["attributes"]["amount"]["value"])],
  ];
  trans.forEach((t) => embed.addField(t[0], t[1], true));
  return embed;
}

const createDiscordPingEmbed = () => {
  const embed = new Discord.MessageEmbed()
    .setColor('#ff7a64')
    .setTitle('UpToDiscord Webhook test notification')
    .addField('Test', '✅', true);
  return embed;
}

const sendDiscordMessage = async (embed) => {
  const client = new Discord.WebhookClient(DISCORD_WEBHOOK_ID, DISCORD_WEBHOOK_SECRET);
  await client.send({
    username: 'Up Banking',
    avatarURL: 'https://i.imgur.com/LVnxC53.png',
    embeds: [embed]
  });
}

module.exports.receiveWebhook = async event => {
  const webhook = JSON.parse(event.body);
  console.log(webhook["data"]["attributes"]["eventType"]);
  switch (webhook["data"]["attributes"]["eventType"]) {
    case UP_PING_WEBHOOK_TYPE:
      await sendDiscordMessage(createDiscordPingEmbed());
      break;
    case UP_TRANSACTION_CREATED_WEBHOOK_TYPE:
      const transactionId = getTransactionIdFromWebhook(webhook);
      const transactionData = await getTransactionDetails(transactionId);
      const transaction = JSON.parse(transactionData.body);
      if (parseInt(transaction["data"]["attributes"]["amount"]["value"]) !== 0) {
        await sendDiscordMessage(createDiscordTransactionEmbed(transaction));
      }
      break;
    default:
      break;
  }
  return { statusCode: 200 };
};
