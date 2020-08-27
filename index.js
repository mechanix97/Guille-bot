import { Command } from './modules/commands.js';

import Discord from 'discord.js';

const client = new Discord.Client();
let command = new Command();

client.login('NzEzNTI0NTE5ODMwMDI4MzY4.XshdJg.5t2rry7WeOsgzPYDyX_wLDxxXLE');

client.on('message', msg => {
	command.exec(msg, client);
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
  	command.entranceCheck(oldMember, newMember);
});

