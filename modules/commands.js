export { Command };

import { VoiceConnection } from './voice_connection.js';

import Discord from 'discord.js';
import txtomp3 from 'text-to-mp3';
import fs from 'fs';
import utf8 from 'utf8';
import download from 'image-downloader';
import sharp from 'sharp';

import https from 'https';

const optionsDolar = {
  hostname: 'api-dolar-argentina.herokuapp.com',
  port: 443,
  path: '/api/dolarblue',
  method: 'GET'
}

const optionsBTC = {
	hostname: 'blockchain.info',
	port: 443,
	path: '/ticker',
	method: 'GET'
}
  


sharp.cache({ files : 0 });

var arrEntrada = [];

const soundPath = 'data/sounds/';
const imagePath = 'data/images/';


var playlists = [
	'https://open.spotify.com/playlist/37i9dQZEVXbMMy2roB9myp',
	'https://open.spotify.com/playlist/37i9dQZEVXbMDoHDwVN2tF',
	'https://open.spotify.com/playlist/37i9dQZEVXbLRQDuF5jeBp',
	'https://open.spotify.com/playlist/4rsgFY9d5d47PmG1kvpV8h?si=3zg-TRqyT06azGtWfIZcKw',
	'https://open.spotify.com/playlist/1Ux2mz0NmWjsejNozSbwb2?si=Pcq7kCmaT26fzoLUprPW5w',
	'https://open.spotify.com/playlist/0XstUwsW0Le0oHUGpuvN4J?si=fnZ9iuNXSG-NqAQefeYAeQ'
]

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

const champions = JSON.parse(fs.readFileSync('./bin/champions.json','utf-8')).champions;

function getChampionsByPosition(pos) {
  return champions.filter(
    function(champions) {
      return champions.position == pos
    }
  );
}

class Command {
  	constructor() {
  	}

	randomChamp(msg){
		msg.reply("Que linea queres jugar, rey? [top, jg, mid, adc, supp, rand]")	
        const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 10000 });
        collector.once('collect', message => {
			var selectedChamp
            if(message.content.toLowerCase() == 'top'){
				var champs = getChampionsByPosition('Top');
				const n = Math.floor(Math.random() * champs.length);
				selectedChamp = champs[n].name
			} else if(message.content.toLowerCase() == 'jg'){
				var champs = getChampionsByPosition('Jungler');
				const n = Math.floor(Math.random() * champs.length);
				selectedChamp = champs[n].name
			} else if (message.content.toLowerCase() == 'mid'){
				var champs = getChampionsByPosition('Mid');
				const n = Math.floor(Math.random() * champs.length);
				selectedChamp = champs[n].name
			} else if(message.content.toLowerCase() == 'adc'){
				var champs = getChampionsByPosition('AD Carry');
				const n = Math.floor(Math.random() * champs.length);
				selectedChamp = champs[n].name
			} else if (message.content.toLowerCase() == 'supp'){
				var champs = getChampionsByPosition('Support');
				const n = Math.floor(Math.random() * champs.length);
				selectedChamp = champs[n].name
			} else if (message.content.toLowerCase() == 'rand'){
				const n = Math.floor(Math.random() * champions.length);
				selectedChamp = champions[n].name
			} else {
				message.channel.send("Te equivocaste de linea crack")
				return;
			}

			var champName = selectedChamp.split(' ')[0];
			champName = champName.replace('\'','')
			var champImageURL = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+ champName+ "_0.jpg"
			message.channel.send("Juga " + selectedChamp ,{files: [champImageURL]})
			if(msg.member.voice.channel){
    			msg.content = "g!loquendo Jugate una partidita con " + champName + ", Rey";
				this.loquendo(msg, "es");
			}
        })
	}
	  
	randomusic(msg){
		const n = Math.round(Math.random() * playlists.length)-1;
		msg.channel.send("!p "+playlists[n])
	}

	playSound(msg, archivo, destruir){
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
		}).catch(() =>{
			msg.reply("Metete en un canal papá frita.")
		});
	}

	displaySounds(msg) {
		var cadena ='Sonidos:';
		for(var key in sonidos){
			cadena = cadena.concat('\n\t',key);
		}
		msg.reply(cadena);
	}

	dato(msg){
		const n = Math.round(Math.random() * 8)-1;
		this.playSound(msg,soundPath+"dato/"+n+".mp3",false);
	}

	sentaste(msg, client){
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
					msg.channel.send("Noooooooooooo "+ user.username + ", donde te sentastes?",{files: ['temp/sentaste.png']})
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
		.catch((err) => console.error(err));
		if(msg.member.voice.channel){
			msg.content = "g!loquendo Noooooooooooo "+ user.username + ", donde te sentastes?";
			this.loquendo(msg, "es");	
		}
	}

	entrada(msg){
		msg.member.presence.activities.forEach(console.log);
		msg.reply("Sorry bro, esta en mantenimiento");
		return;
		/*var str = msg.content;
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
		}); */
	}

	loquendo(msg, lenguage){
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
			txtomp3.saveMP3(text, 'temp/temp.mp3').then(() => {
				this.playSound(msg,'temp/temp.mp3', true);
			})
			.catch(function(err){		
				if(err instanceof TypeError){
					msg.reply('Mensaje invalido, monito.');
				} else if(err.code === 'ENOENT'){
					this.loquendo(msg, lenguage);
				}else {
					console.log("Error", err);
					msg.reply('Error desconocido, avisale al Mechanix más cercano.');
				}
			});
		} else {
			msg.reply('Pone un mensaje, bola.');
		}
	}

	dolar(msg){
		httpRequest(optionsDolar).then(cotizacion => {
			if(msg.member.voice.channel){
    			msg.content = "g!loquendo La cotizacion del dolar es de "+ cotizacion.compra + " pesos para la compra y"+ cotizacion.venta +" pesos para la venta.";
				this.loquendo(msg, "es");
			}
			msg.reply("Dolar:\n\tCompra: $"+ cotizacion.compra +"\n\tVenta: $"+ cotizacion.venta);
			
		});		
	}

	
	btc(msg){
		httpRequest(optionsBTC).then(cotizacion => {			
			if(msg.member.voice.channel){
    			msg.content = "g!loquendo La cotizacion del Bitcoin es de "+ Math.floor(cotizacion.USD.last/1000) +"mil"+ Math.floor(cotizacion.USD.last%1000) + " dolares";
				this.loquendo(msg, "es");
			}
			msg.reply("Bitcoin: u$d " +  Math.floor(cotizacion.USD.last));
			
		})
	}

	exec(msg, client){
		if (msg.content.toLowerCase() === 'g!help'){
			msg.reply('Comandos:\n\tg!sonidos para ver lista de sonidos.\n\tg!guillote para ver sorpresa \n\tg!loquendo <texto> para reproducir como loquendo\n\tg!entrada <ON/OFF> activar entrada epica.\n\tg!sentaste <USUARIO> para sentar a alguien.\n\tg!dolar para saber la cotización del dolar.')
		} else if (msg.content.toLowerCase() === 'g!sonidos'){
			this.displaySounds(msg);
		} else if(msg.content.toLowerCase().startsWith('g!sentaste')){
			this.sentaste(msg, client);
		} else if(msg.content.toLowerCase() === 'g!dato'){
			this.dato(msg);
		}
		else if(msg.content.toLowerCase() === 'g!guillote'){
			msg.reply('Que onda mono?',{files: [imagePath+'profile.png']});
		} else if(msg.content.toLowerCase().startsWith('g!loquendo ')){
			this.loquendo(msg,"es");
		} else if(msg.content.toLowerCase().startsWith('g!loquendobr ')){
			this.loquendo(msg,"pt");		
		} else if(msg.content.toLowerCase().startsWith('g!entrada ')){
			this.entrada(msg);
		}else if(msg.content.toLowerCase() === 'g!dolar'){
			this.dolar(msg);
		}else if(msg.content.toLowerCase() === 'g!btc'){
			this.btc(msg);
		}
		else if(msg.content.toLowerCase() === 'g!randomusic'){
			this.randomusic(msg);
		} else if(msg.content.toLowerCase() === 'g!randomchamp'){
			this.randomChamp(msg);
		}
		else {
			for(var key in sonidos){
				if(msg.content.toLowerCase() === key){
					this.playSound(msg,soundPath+sonidos[key],false);
				}
			}
		}
	}	
	
	entranceCheck(oldMember, newMember){
		if(newMember.channelID != null && newMember.channelID != oldMember.channelID && newMember.channel.members.size > 1){
  			for(var i = 0; i<arrEntrada.length; i++){
 				if(arrEntrada[i][0] == newMember.id && arrEntrada[i][1] == newMember.guild.id){
					this.PlaySound(newMember,soundPath+'queondamonito.mp3',false);
 				}
  			}
  		}
  	}
}


function httpRequest(params, postData) {
    return new Promise(function(resolve, reject) {
        var req = https.request(params, function(res) {
            // reject on bad status
            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }
            // cumulate data
            var body = [];
            res.on('data', function(chunk) {
                body.push(chunk);
            });
            // resolve on end
            res.on('end', function() {
                try {
                    body = JSON.parse(Buffer.concat(body).toString());
                } catch(e) {
                    reject(e);
                }
                resolve(body);
            });
        });
        // reject on request error
        req.on('error', function(err) {
            // This is not a "Second reject", just a different sort of failure
            reject(err);
        });
        if (postData) {
            req.write(postData);
        }
        // IMPORTANT
        req.end();
    });
}