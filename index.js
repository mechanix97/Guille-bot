const Discord = require('discord.js');
 const client = new Discord.Client();

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

function reproducirSonido(msg,archivo){
	//while(client.voiceConnections.size != 0){	}
	//console.log(client.voice.client);
	//let voiceChannelGet = client.channels.get(notification.voiceChannel);
	//console.log(client.voiceConnections.get(GuildID).channel.id);
	client.voice.connections.map(voiceConnection => console.log(voiceConnection.size));
	const channel = msg.member.voice.channel;
	if (!channel){
		return msg.channel.send("No estas en ningún canal de voz, pavo.");	
	}
	channel.join().then(conn => {
		const dispatcher = conn.play(archivo);
		client.voice.connections.map(voiceConnection => console.log(voiceConnection.size));			
		dispatcher.on('finish', () => {
			conn.disconnect();
		});
		dispatcher.on('error', console.error);
	});
}

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

client.on('message', msg => {
	if (msg.content === 'g!help'){
		msg.reply('Comandos:\n\tg!sonidos para ver lista de sonidos.\n\tg!guillote para ver sorpresa \n\tg!loquendo <texto> para reproducir como loquendo [WIP]')
	} else if (msg.content === 'g!sonidos'){
		var cadena ='Sonidos:';
		for(var key in sonidos){
			cadena = cadena.concat('\n\t',key);
		}
		msg.reply(cadena);
	} else if(msg.content === 'g!guillote'){
		msg.channel.send('frase',{files: ['data/profile.png']});
	} else if(msg.content.startsWith('g!loquendo')){
		msg.reply("Todavia no lo implmente papurri.");
	} else {
		for(var key in sonidos){
			if(msg.content === key){
				reproducirSonido(msg,sonidos[key]);
			}
		}
	}
});

client.login('NzEzNTI0NTE5ODMwMDI4MzY4.XshdJg.5t2rry7WeOsgzPYDyX_wLDxxXLE');