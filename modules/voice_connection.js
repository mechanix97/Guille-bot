export { VoiceConnection };

class VoiceConnection {
	static connected = false;
	connection = null;
	channel = null;

  	constructor(msg) {
  		this.channel = msg.member.voice.channel;
  	}

  	isConnected() {
  		return VoiceConnection.connected;
  	}

  	connect() {  		
  		return new Promise((resolve, reject) => {
			if(this.channel == null){
				reject();
			} else{
				if(VoiceConnection.connected == true){	 
					setTimeout(() =>{	
							this.connect()
							.then(() => {resolve(); })
							.catch(() => {reject();});
						} ,1000);
				} else {
				  this.channel.join().then(conn =>{
						VoiceConnection.connected = true;
						this.connection = conn;
						resolve(); 
					}).catch(e => {
					  console.log(e);
					  reject();
				  });
			  }
			}    		
    	});		
	    
  	}

	disconnect(){
		return new Promise((resolve, reject) => {
			this.connection.disconnect();
			VoiceConnection.connected = false;
			resolve();
		});
	}

	playSound(archivo) {
		return new Promise((resolve, reject) => {
			const dispatcher = this.connection.play(archivo);
			dispatcher.on('finish', () => {
				dispatcher.destroy();
				resolve();
			});
			dispatcher.on('error', e =>{
				console.log(e);
				reject();
			});
			this.connection.on('disconnect', () =>{
				resolve();
			});
		});	
	}
}
