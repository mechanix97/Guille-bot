const Discord = require('discord.js');
 const client = new Discord.Client();

client.on('ready', () => {
 console.log(`Logged in as ${client.user.tag}!`);
 });

function reproducirSonido(msg,archivo){
	const channel = msg.member.voice.channel;
	channel.join().then(conn => {
		const dispatcher = conn.play(archivo);
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
  'g!enserio':'data/enserio.mp3'
};

client.on('message', msg => {
	if (msg.content === 'g!help'){
		var cadena ='Comandos:';
		for(var key in sonidos){
			cadena = cadena.concat('\n\t',key);
		}
		msg.reply(cadena);
	} else {
		for(var key in sonidos){
			if(msg.content === key){
				reproducirSonido(msg,sonidos[key]);
			}
		}
	}
});

client.login('NzEzNTI0NTE5ODMwMDI4MzY4.XshdJg.5t2rry7WeOsgzPYDyX_wLDxxXLE');