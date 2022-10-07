import 'dotenv/config';
import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';

export const verifyDiscordRequest = (clientKey) => {
  return (request, response, buffer, encoding) => {
    const signature = request.get('X-Signature-Ed25519');
    const timestamp = request.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buffer, signature, timestamp, clientKey);

    if (!isValidRequest) {
      response.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
};

export const discordRequest = async (endpoint, options) => {
  const url = `https://discord.com/api/v10/${endpoint}`;

  if (options.body) options.body = JSON.stringify(options.body);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    ...options,
  });

  if (!response.ok) {
    const data = await response.json();
    console.log(response.status);
    throw new Error(JSON.stringify(data));
  }

  return response;
};
