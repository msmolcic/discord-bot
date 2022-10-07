import 'dotenv/config';
import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';

export const verifyDiscordRequest = (clientKey) => {
  return (req, res, buf, encoding) => {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);

    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
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
