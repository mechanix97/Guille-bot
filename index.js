const Discord = require('discord.js');
var txtomp3 = require('text-to-mp3');
var fs = require('fs');
const utf8 = require('utf8');
const download = require('image-downloader')
const sharp = require('sharp');


const client = new Discord.Client();

var sonidos = {
  'g!soseluno':'data/soseluno.mp3',
  'g!gracias':'data/gracias.mp3',
  'g!monito':'data/queondamonito.mp3',
  'g!mono':'data/queondamonito.mp3',
  'g!queonda':'data/queondamonito.mp3',
  'g!picanchi':'data/picanchi.mp3',
  'g!verga':'data/verga.mp3',
  'g!team':'data/team.mp3',
  'g!stress':'data/stress.mp3',
  'g!poronga':'data/poronga.mp3',
  'g!vicio':'data/vicio.mp3',
  'g!papo':'data/papo.mp3',
  'g!rapido':'data/rapido.mp3',
  'g!walter':'data/walter.mp3',
  'g!gil':'data/gil.mp3',
  'g!sorete':'data/sorete.mp3',
  'g!enserio':'data/enserio.mp3',
  'g!concha':'data/concha.mp3',
  'g!definicion':'data/Elchabonesladefdepelotudo.mp3',
  'g!boludo':'data/Esboludo.mp3',
  'g!pajero':'data/Esmediopajero.mp3',
  'g!malardo':'data/Malardo.mp3',
  'g!estudiar':'data/Pajaestudiar.mp3',
  'g!palos':'data/Palos.mp3',
  'g!perro':'data/Queondaperro.mp3',
  'g!facil':'data/Refacilhdp.mp3',
  'g!tremenda':'data/Tremendaverga.mp3',
  'g!onfire':'data/Onfire.mp3'
};

var options = {
  tl: 'es'
}

sharp.cache({ files : 0 });

var arrEntrada = [];

client.on('ready', () => {
 	console.log(`Logged in as ${client.user.tag}!`);
 	fs.readFile('bin/entry.json', (err, data) => {
    	if (err) throw err;
    	arrEntrada = JSON.parse(data);
	});	
});

client.login('NzEzNTI0NTE5ODMwMDI4MzY4.XshdJg.5t2rry7WeOsgzPYDyX_wLDxxXLE');

function reproducirSonido(msg,archivo,destruir){
	if(msg == null){
		return;
	}
	if (client.voice.connections.size){
    	setTimeout(reproducirSonido,1000,msg,archivo,destruir);
  	} else {
		const channel = msg.member.voice.channel;
		if (!channel){
			return msg.channel.send('No estas en ningún canal de voz, pavo.');	
		}
		channel.join().then(conn => {
		const dispatcher = conn.play(archivo);
			dispatcher.on('finish', () => {
				conn.disconnect();
				dispatcher.destroy();
			});
			dispatcher.on('error', console.error);
			conn.on('disconnect', () =>{
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
		}).catch(e => {
        	console.log(e);
        });
  	}	
}

function loquendo(msg, attempt){
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
			txtomp3.attributes.tl ="es";
			txtomp3.saveMP3(text, 'temp/temp.mp3').then(function(absoluteFilePath){
				reproducirSonido(msg,absoluteFilePath,true);
			}) 
			.catch(function(err){
				console.log("Error", err);
				if(err instanceof TypeError){
					msg.reply('Mensaje invalido, monito.');
				} else {
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
	var str = msg.content;
	var res = str.split(" ");
	var text = '';
	if(res.length > 1){
		for(var i = 1 ; i<res.length; i++){
			text = text.concat(res[i]);
		}
	}
	if(text.toLowerCase() === 'on'){
		const index = arrEntrada.indexOf([msg.author.id, msg.guild.id]);
		if(index == -1){
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
	var res = str.split(" ");
	if(res.length > 1){
	 	user = client.users.cache.find(u => u.username === res[1]);

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
		    sharp('data/sentaste.png')
		    .composite([{ input: data, top: 42, left: 420  }])
		    .toFile('temp/sentaste.png').then(() =>{
				if(msg.member.voice.channel){
					msg.content = "g!loquendo Noooooooooooo "+ user.username + ", donde te sentaste?";
					loquendo(msg,0);	
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
	} else if(msg.content.toLowerCase() === 'g!guillote'){
		msg.reply('Que onda mono?',{files: ['data/profile.png']});
	} else if(msg.content.toLowerCase().startsWith('g!loquendo')){
		loquendo(msg,0);
	} else if(msg.content.toLowerCase().startsWith('g!entrada')){
		entrada(msg);
	}else {
		for(var key in sonidos){
			if(msg.content.toLowerCase() === key){
				reproducirSonido(msg,sonidos[key],false);
			}
		}
	}
});

client.on('voiceStateUpdate', (oldMember, newMember) => {
  	if(newMember.channelID != null && newMember.channelID != oldMember.channelID && newMember.channel.members.size > 1){
  		for(var i = 0; i<arrEntrada.length; i++){
 			if(arrEntrada[i][0] == newMember.id && arrEntrada[i][1] == newMember.guild.id){
  				setTimeout(() => {
					reproducirSonido(newMember,'data/queondamonito.mp3',false);
				}, 1000);
 			}
  		}
  	}
});

