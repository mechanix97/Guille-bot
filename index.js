import { Command } from './modules/commands.js';

import Discord from 'discord.js';
import CryptoJS from 'crypto-js';
import readline from 'readline';

const client = new Discord.Client();
let command = new Command();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.stdoutMuted = true;

var encrypted = 'U2FsdGVkX19x/uMboX8ADZQLoRSP1dvKIY36FlGruFPP0ixaEVT3HUtMHBxPd2B69cIorl/bD4EKb9D4MZZ101g/O17Tj3aYHlQIVmiblC0=';

rl.question('Enter Key\n', (key) => {
   	rl.stdoutMuted = false;
   	console.log("");
   	var decrypted = CryptoJS.AES.decrypt(encrypted, key);
   	client.login(decrypted.toString(CryptoJS.enc.Utf8));
  	rl.close();
});

rl._writeToOutput = function _writeToOutput(stringToWrite) {
  if (rl.stdoutMuted)
    rl.output.write("*");
  else
    rl.output.write(stringToWrite);
};

client.on('message', msg => {
	command.exec(msg, client);
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
  	command.entranceCheck(oldMember, newMember);
});

