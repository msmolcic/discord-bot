import { PLAY_COMMAND_NAME } from './constants.js';
import { discordRequest } from './util.js';

export const hasGuildCommands = async (applicationId, guildId, commands) => {
  if (!guildId || !applicationId) return;

  commands.forEach((command) =>
    hasGuildCommand(applicationId, guildId, command)
  );
};

const hasGuildCommand = async (applicationId, guildId, command) => {
  const endpoint = `applications/${applicationId}/guilds/${guildId}/commands`;

  try {
    const response = await discordRequest(endpoint, { method: 'GET' });
    const data = await response.json();

    if (!data) return;

    console.log('Mapping command names...');
    const installedNames = data.map((cmd) => cmd.name);

    console.log('Verifying existing commands...');
    if (installedNames.includes(command.name)) {
      console.log(`'${command.name}' command is already installed...`);
      return;
    }

    installGuildCommand(applicationId, guildId, command);
  } catch (error) {
    console.error(error);
  }
};

export const installGuildCommand = async (applicationId, guildId, command) => {
  const endpoint = `applications/${applicationId}/guilds/${guildId}/commands`;

  try {
    console.log(`Installing '${command.name}' command...`);
    await discordRequest(endpoint, { method: 'POST', body: command });
    console.log(`'${command.name}' command successfully installed...`);
  } catch (error) {
    console.log(`Failed to install '${command.name}' command...`);
    console.error(error);
  }
};

export const PLAY_COMMAND = {
  name: PLAY_COMMAND_NAME,
  description: 'Plays a song request.',
  type: 1,
};
