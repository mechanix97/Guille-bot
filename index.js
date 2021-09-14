import { Command } from './modules/commands.js';

import Discord from 'discord.js';
import fs from 'fs';

const client = new Discord.Client();
let command = new Command();

fs.readFile('./bin/config.json','utf-8',(err,jsonString)=>{
    const config = JSON.parse(jsonString);
    client.login(config.token);
});

client.on('message', msg => {
	command.exec(msg, client);
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
  	//command.entranceCheck(oldMember, newMember);
});

