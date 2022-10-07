import { InteractionResponseType, InteractionType } from 'discord-interactions';
import 'dotenv/config';
import express from 'express';
import { hasGuildCommands, PLAY_COMMAND } from './commands.js';
import { PLAY_COMMAND_NAME } from './constants.js';
import { verifyDiscordRequest } from './util.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ verify: verifyDiscordRequest(process.env.PUBLIC_KEY) }));

app.listen(PORT, () => {
  console.log('Bot started and running on port', PORT);

  hasGuildCommands(process.env.APPLICATION_ID, process.env.GUILD_ID, [
    PLAY_COMMAND,
  ]);
});

app.post('/interactions', async (request, response) => {
  const { type, id, data } = request.body;

  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    switch (name) {
      case PLAY_COMMAND_NAME:
        return handlePlayCommand(response);
      default:
        console.log('Unknown command');
        return;
    }
  }
});

const handlePlayCommand = (response) => {
  return response.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: 'Plati roki!',
    },
  });
};
