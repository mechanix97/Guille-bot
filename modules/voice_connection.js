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

  	connect(attempt) {  		
  		return new Promise((resolve, reject) => {
			if(attempt == 0){
				reject('MAX ATTEMPTS')
			} else {
				if(attempt === undefined){
					attempt = 25;
				}
				if(this.channel == null){
					reject('No channel');
				} else{
					if(VoiceConnection.connected == true){	 
						setTimeout(() =>{	
								this.connect(attempt - 1)
								.then((ret) => {resolve(ret); })
								.catch((err) => {reject(err);});
							} ,1000);
					} else {
					  this.channel.join().then(conn =>{
							VoiceConnection.connected = true;
							this.connection = conn;
							resolve(); 
						}).catch(e => {
						  console.log(e);
						  reject(e);
					  });
				  }
				}
			}			    		
    	});		
	    
  	}

	disconnect(){
		return new Promise((resolve) => {
			this.connection.disconnect();
			VoiceConnection.connected = false;
			resolve();
		});
	}

	playSound(file) {
		return new Promise((resolve, reject) => {
			const dispatcher = this.connection.play(file);
			dispatcher.on('finish', () => {
				dispatcher.destroy();
				resolve();
			});
			dispatcher.on('error', e =>{
				console.log(e);
				reject(e);
			});
			this.connection.on('disconnect', () =>{
				resolve();
			});
		});	
	}
}
