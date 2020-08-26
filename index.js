import { VoiceConnection } from './modules/voice_connection.js';

import Discord from 'discord.js';
import txtomp3 from 'text-to-mp3';
import fs from 'fs';
import utf8 from 'utf8';
import download from 'image-downloader';
import sharp from 'sharp';

const soundPath = 'data/sounds/';
const imagePath = 'data/images/';

const client = new Discord.Client();

var sonidos = {
  'g!soseluno':'soseluno.mp3',
  'g!gracias':'gracias.mp3',
  'g!monito':'queondamonito.mp3',
  'g!mono':'queondamonito.mp3',
  'g!queonda':'queondamonito.mp3',
  'g!picanchi':'picanchi.mp3',
  'g!verga':'verga.mp3',
  'g!team':'team.mp3',
  'g!stress':'stress.mp3',
  'g!poronga':'poronga.mp3',
  'g!vicio':'vicio.mp3',
  'g!papo':'papo.mp3',
  'g!rapido':'rapido.mp3',
  'g!walter':'walter.mp3',
  'g!gil':'gil.mp3',
  'g!sorete':'sorete.mp3',
  'g!enserio':'enserio.mp3',
  'g!concha':'concha.mp3',
  'g!definicion':'Elchabonesladefdepelotudo.mp3',
  'g!boludo':'Esboludo.mp3',
  'g!pajero':'Esmediopajero.mp3',
  'g!malardo':'Malardo.mp3',
  'g!estudiar':'Pajaestudiar.mp3',
  'g!palos':'Palos.mp3',
  'g!perro':'Queondaperro.mp3',
  'g!facil':'Refacilhdp.mp3',
  'g!tremenda':'Tremendaverga.mp3',
  'g!onfire':'Onfire.mp3'
};

sharp.cache({ files : 0 });

var arrEntrada = [];

client.on('ready', () => {
 	console.log(`Logged in as ${client.user.tag}!`);
 	if (fs.existsSync('bin/entry.json')){
 		fs.readFile('bin/entry.json', (err, data) => {
 			if(err) throw err;
 			arrEntrada = JSON.parse(data);
		});	
 	} else {
 		fs.openSync('bin/entry.json', 'w');
		fs.writeFile('bin/entry.json', JSON.stringify([]),function(err) {
			if(err) throw err;
		});
		arrEntrada = [];
 	}
});

client.login('NzEzNTI0NTE5ODMwMDI4MzY4.XshdJg.5t2rry7WeOsgzPYDyX_wLDxxXLE');

function reproducirSonido(msg,archivo,destruir){
	if(msg == null){
		return;
	}
	var voiceConnection = new VoiceConnection(msg);
	voiceConnection.connect().then(() => {
		voiceConnection.playSound(archivo, destruir).then(() => {
			voiceConnection.disconnect().then(() => {
				setTimeout(() => {  
					if(destruir){
						try{	
					   		fs.unlinkSync(archivo);	
					   	} catch(err){
					   		console.log(err);
					   	}
					} 
				}, 100);
			});
		}); 
	});
}

function loquendo(msg, attempt,lenguage){
	if(fs.existsSync('temp/temp.mp3')){
		if(attempt > 15){
		   	try{
		   		fs.unlinkSync('temp/temp.mp3');	
		   	} catch(err){
		   		console.log(err);
		   	} 
		}
		attempt=attempt+1;
		setTimeout(loquendo,500,msg,attempt);		
	} else {
		var str = msg.content;
		var res = str.split(" ");
		var text = '';
		if(res.length > 1){
			for(var i = 1 ; i<res.length; i++){
				text = text.concat(res[i],' ');
			}
			text = utf8.encode(text);
			if(text.length >= 200){
				msg.reply('Te exediste de caracteres, papu.');
				return;
			}
			txtomp3.attributes.tl = lenguage;
			txtomp3.saveMP3(text, 'temp/temp.mp3').then(function(absoluteFilePath){
				reproducirSonido(msg,absoluteFilePath,true);
			}) 
			.catch(function(err){		
				if(err instanceof TypeError){
					msg.reply('Mensaje invalido, monito.');
				} else if(err.code === 'ENOENT'){
					loquendo(msg, attempt, lenguage);
				}else {
					console.log("Error", err);
					msg.reply('Error desconocido, avisale al Mechanix más cercano.');
			   		try{
			   			fs.unlinkSync('temp/temp.mp3');	
			   		} catch(err){
				   		console.log(err);
				   	}				   		    	
				}
			});
		} else {
			msg.reply('Pone un mensaje, bola.');
		}
	}
}

function entrada(msg){
	msg.member.presence.activities.forEach(console.log);
	msg.reply("Sorry bro, esta en mantenimiento");
	return;
	var str = msg.content;
	var res = str.split(" ");
	var text = '';
	if(res.length > 1){
		for(var i = 1 ; i<res.length; i++){
			text = text.concat(res[i]);
		}
	}
	if(text.toLowerCase() === 'on'){
		var esta = false;
		for(var i = 0; i < arrEntrada.length; i++){
			if(arrEntrada[i][0] === msg.author.id && arrEntrada[i][1] === msg.guild.id){
				esta = true;
			} 
		}
		if(esta == true){
			msg.reply("Ya lo tenes prendido, pavo");	
		} else {
			arrEntrada.push([msg.author.id, msg.guild.id]);
		}
	} else if(text.toLowerCase() === 'off'){
		const index = arrEntrada.indexOf([msg.author.id, msg.guild.id]);
		if (index > -1) {
		  arrEntrada.splice(index, 1);
		}
	} else if(text.toLowerCase() === 'reset'){
		arrEntrada = [];
	} else if(text.toLowerCase() === 'status'){
		console.log("g!entrara",arrEntrada);
	}
	 else {
		msg.reply("El comando se usa:\n\tg!entrada <ON/OFF>");
		return;
	}	
 	const jsonContent = JSON.stringify(arrEntrada);
	fs.writeFile("bin/entry.json", jsonContent, 'utf8', function (err) {
	    if (err) {
	        console.log(err);
	    }
	}); 
}

function sentaste(msg){
	let url;
	let user = msg.author;	
	var str = msg.content;
	var text = '';
	var res = str.split(" ");
	if(res.length > 1){
		for(var i = 1 ; i<res.length; i++){
			text = text.concat(res[i]);
			if(i != res.length-1){
				text = text.concat(" ");
			}
		}
	 	user = client.users.cache.find(u => u.username === text);

		if(user){
			url = user.displayAvatarURL();
		} else {
			user = msg.author;
			url = msg.author.displayAvatarURL();
		}
	} else {
		user = msg.author;
		url = msg.author.displayAvatarURL();
	}


	const options = {
  		url: url,
  		dest: 'temp/profile.webp'        
	}
 
	download.image(options)
  	.then(({ filename }) => {
    	const image = sharp('temp/profile.webp');
		image
		.metadata()
		.then(function(metadata) {
			return image
			.resize(75,75,4)
			.webp()
			.toBuffer();
		}).then(function(data) {
		    sharp(imagePath+'sentaste.png')
		    .composite([{ input: data, top: 42, left: 420  }])
		    .toFile('temp/sentaste.png').then(() =>{
				if(msg.member.voice.channel){
					msg.content = "g!loquendo Noooooooooooo "+ user.username + ", donde te sentaste?";
					loquendo(msg,0,"es");	
				}				
				msg.channel.send("Noooooooooooo "+ user.username + ", donde te sentaste?",{files: ['temp/sentaste.png']})
				.then(() =>{
					try{
			   			fs.unlinkSync('temp/sentaste.png');	
			   		} catch(err){
			   			console.log(err);
			   		}
			   		try{
			   			fs.unlinkSync('temp/profile.webp');	
			   		} catch(err){
			   			console.log(err);
			   		}	
				});
			});
		});
		
	})
	.catch((err) => console.error(err))	
}

function dato(msg){
	const n = Math.round(Math.random() * 8)-1;
	reproducirSonido(msg,soundPath+"dato/"+n+".mp3",false);
}



client.on('message', msg => {
	if (msg.content.toLowerCase() === 'g!help'){
		msg.reply('Comandos:\n\tg!sonidos para ver lista de sonidos.\n\tg!guillote para ver sorpresa \n\tg!loquendo <texto> para reproducir como loquendo\n\tg!entrada <ON/OFF> activar entrada epica.\n\tg!sentaste <USUARIO> para sentar a alguien.')
	} else if (msg.content.toLowerCase() === 'g!sonidos'){
		var cadena ='Sonidos:';
		for(var key in sonidos){
			cadena = cadena.concat('\n\t',key);
		}
		msg.reply(cadena);
	} else if(msg.content.toLowerCase().startsWith('g!sentaste')){
		sentaste(msg);
	} else if(msg.content.toLowerCase() === 'g!dato'){
		dato(msg);
	}
	else if(msg.content.toLowerCase() === 'g!guillote'){
		msg.reply('Que onda mono?',{files: [imagePath+'profile.png']});
	} else if(msg.content.toLowerCase().startsWith('g!loquendo ')){
		loquendo(msg,0,"es");
	} else if(msg.content.toLowerCase().startsWith('g!loquendobr ')){
		loquendo(msg,0,"pt");		
	} else if(msg.content.toLowerCase().startsWith('g!entrada ')){
		entrada(msg);
	}else {
		for(var key in sonidos){
			if(msg.content.toLowerCase() === key){
				reproducirSonido(msg,soundPath+sonidos[key],false);
			}
		}
	}
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
  	if(newMember.channelID != null && newMember.channelID != oldMember.channelID && newMember.channel.members.size > 1){
  		for(var i = 0; i<arrEntrada.length; i++){
 			if(arrEntrada[i][0] == newMember.id && arrEntrada[i][1] == newMember.guild.id){
  				setTimeout(() => {
					reproducirSonido(newMember,soundPath+'queondamonito.mp3',false);
				}, 1000);
 			}
  		}
  	}
});

