var plugin_data = {
	id: 'guessing_game',
	title: 'The Guessing Game',
	icon: 'casino',
	author: 'JannisX11',
	description: 'Play the guessing game in Blockbench with your friends',
	version: '1.0.0',
	variant: 'both'
};

var sendGameChat;

(function() {


	var GameClient = {
		is_host: false,
		is_creator: false,
		chat_history: [],
	}
	var keywords = []
		//Misc
		keywords = keywords.concat(['Blockbench', 'Fire', 'Volcano', 'Traveling', 'Science', 'Batman', 'Gun',])
		//Text
		keywords = keywords.concat(['Computer', 'Monitor', 'Camera', 'Laptop', 'Tripod', 'Lamp', 'Lever', 'Floppy Disk',  'Playstation', 'Console', 'Cable', 'Fire Extinguisher', 'Electric Guitar',])
		//Food
		keywords = keywords.concat(['Cake', 'Apple', 'Plate', 'Fork', 'Knive', 'Cup', 'Pizza', 'Vending Machine', 'Avocado', 'Sausage', 'Cheeseburger', 'Hot Dog', 'Ketchup', '',])
		//Vehicles
		keywords = keywords.concat(['Car', 'Pickup Truck', 'Forklift', 'Tractor', 'Plane', 'Crane', 'Excavator', 'Bus', 'Wheelchair', 'Bulldozer', 'Golf Cart', 'Bicycle', 'Monster Truck', 'Roller Coaster', 'Helicopter', 'Motorbike', 'Spaceship', 'Train', 'Delivery Truck',])
		//Buildings
		keywords = keywords.concat(['House', 'Castle', 'Eiffel Tower', 'Barn', 'Cabin', 'Bridge', 'Tower Bridge',])
		//Pop Culture
		keywords = keywords.concat(['R2D2', 'Tardis', 'T-Rex', 'Ring', 'Portal Gun', 'Mario', 'DeLorean', 'X Wing', ])
		//Nature
		keywords = keywords.concat(['Tree', 'Mountain', 'Snowflake', 'Cactus', 'Bug', 'Cloud',])
		//Items
		keywords = keywords.concat(['Eraser', 'Pen', 'Compass', 'Toilet Paper', 'Phone', 'Gift', 'Ball', 'Ziptie', 'Candle', 'Traffic Cone', 'Key', 'Candy', 'Suitcase', 'Cheese Grater',])
		//Tools
		keywords = keywords.concat(['Bucket', 'Hammer', 'Brush', 'Knive', 'Tape Measure', 'Sickle', 'Scissors', 'Crescent Wrench',])
		//Minecraft
		keywords = keywords.concat(['Creeper', 'Zombie', 'Ghast', 'Beacon',])
		//Animals
		keywords = keywords.concat(['Cow', 'Fox', 'Scarecrow', 'Bird', 'Parrot', 'Bee', 'Bear', 'Cat', 'Human', 'Eagle', 'Hedgehog', 'Snail',])
		//Cloths
		keywords = keywords.concat(['Pants', 'Jacket', 'Backpack', 'Hat', 'Baseball Cap', 'Sneakers', 'Boots', 'Umbrella', 'Glasses',])
	var Game;
	var GameInterface = {
		chat_history: true,
		setup: function() {
			var GI = GameInterface;
			var body = $(document.body)

			if (GI.isSetup) return;

			body.append(`<style>

				#game_chat_history {
					background: var(--color-bright_ui);
					color: var(--color-text_acc);
					max-height: 320px;
    				overflow-y: scroll;
    				padding: 5px;
				}
				#game_chat_history b {
					font-weight: bold;
					padding: 5px;
				}
				#game_chat_bar {
					background-color: var(--color-selected);
					height: 32px;
				}
				#game_chat_input {
					padding: 5px;
					width: 264px;
					margin-left: 2px;
				}
				#game_chat_bar > i {
					margin: 5px;
				}
				#game_chat_bar > i:hover {
					color: var(--color-light);
				}
				.scoreboard_points {
					display: inline-block;
					margin-left: 8px;
					margin-right: 10px;
				}

			</style>`)
			//WordDisplay
			GI.word = $(`<div style="
				position: absolute;
				pointer-events: none;
				height: 40px;
				width: 100%;
				margin-top: 30px;
				color: var(--color-text);
				opacity: 0.75;
				font-family: monospace;
				font-size: 28pt;
				letter-spacing: 2px;
				z-index: 16;
				text-align: center;
			"></div>`)
			body.append(GI.word)
			//Chat
			GI.chat = $(`<div id="game_chat" style="
				position: absolute;
				width: 300px;
				bottom: 0;
				right: 12px;
				box-shadow: 0 0 2px black;
				z-index: 16;
			">
				<ul id="game_chat_history"></ul>
				<div id="game_chat_bar">
					<input type="text" id="game_chat_input" class="dark_bordered f_left">
					<i class="material-icons" onclick="sendGameChat()">send</i>
				</div>
			</div>`)
			body.append(GI.chat)
			GI.chat_box = GI.chat.find('#game_chat_input')
			GI.chat.find('input').on('keypress', (e) => {
				if (e.which === 13) {
					sendGameChat()
				} else if (e.which === 38) {
					var hist = hist
					if (hist.length) {
						GameInterface.chat_box.val( hist[hist.length] )
					}
				}
			})
			//Scoreboard
			GI.scoreboard = $(`<ul style="
				position: absolute;
				pointer-events: none;
				width: 120px;
				bottom: 26px;
				color: var(--color-text);
				opacity: 0.75;
				z-index: 16;
			">
				<li></li>
			</ul>`)
			$('#status_bar').append(GI.scoreboard)
			GI.isSetup = true;
		},
		appendChatMessage(author, text, color) {
			var msg = $('<li></li>')
			if (author) {
				msg.append(`<b>${author}:&nbsp;</b>`)
			}
			msg.append(`<span style="color: ${color};">${text}</span>`)
			GameInterface.chat.find('#game_chat_history').append(msg).scrollTop(10000)
		},
		toggleChat: function() {
			GameInterface.chat_history = !GameInterface.chat_history
			GameInterface.chat.find('#game_chat_history')[GameInterface.chat_history ? 'show' : 'hide'](200)
		},
		updateScoreboard: function(data) {
			GameInterface.scoreboard.empty()
			data.forEach(tag => {
				GameInterface.scoreboard.append(`<li>
					<div class="scoreboard_points">${tag.score}</div>${tag.name}
				</li>`)
			})
		},
		displayWord: function(word) {
			GameInterface.word.text(word)
		},
		progress: function(data) {
			clearInterval(GameInterface.interval)
			if (data.progress !== undefined) {
				Blockbench.setProgress(data.progress)
			}
			if (data.time) {
				var progress = data.progress;
				if (progress === undefined) progress = 1;
				var increment = (progress ? -1 : 1) / (data.time/(100/6))
				GameInterface.interval = setInterval(function() {
					progress += increment;
					if (progress < 0 || progress > 1) {
						progress = Math.clamp(progress, 0, 1);
						clearInterval(GameInterface.interval)
					}
					Blockbench.setProgress(progress)
				}, 100/6)
			}
		}
	}
	sendGameChat = function() {
		var text = GameInterface.chat_box.val()
		GameClient.chat_history.push(text)
		GameInterface.chat_box.val('')
		if (text) {
			var data = {sender: EditSession.peer.id, content: text}
			if (GameClient.is_host) {
				Game.processChatMessage(data)
			} else {
				EditSession.host.send({type: 'chat_message', data: data, hostOnly: true})
			}
		}
	}
	//window.GameClient = GameClient;
	//window.GameInterface = GameInterface;

	Blockbench.on('create_session', (d1) => {

		GameInterface.setup()
		GameClient.is_host = true
		var timeout;
		Game = {
			users: {},
			creator: false,
			round: 0,
			rounds: 0,
			rightGuesses: 0,
		}
		var GameTiming = {}
		var completed_characters = 0;
		var completed_word;
		var complete_interval;
		//window.Game = Game;

		//User
		class GameUser {
			constructor(data) {
				this.id = data.id;
				this.score = 0;
				this.isCreating = false;
				this.isHost = !!data.isHost;
				this.conn = data.conn;
				this.name = data.name;
				/*
					
				*/
			}
			toString() {
				return this.name;
			}
			startTurn() {
				console.log(this.name+' is now modeling')
				Game.creator = this;
				Game.allClients('add_chat_message', {content: `${this.name} is now modeling!`, color: 'blue'})
				this.sendData('start_turn', {word: Game.word})
				this.isCreating = true
				this.hasCreated = true
				return this;
			}
			sendData(key, data) {
				//Host to User
				if (this.isHost) {
					clientAction(key, data)
				} else {
					this.conn.send({
						type: key,
						fromHost: EditSession.hosting,
						hostOnly: true,
						sender: EditSession.peer.id,
						data: data
					});
				}
			}
			guess() {
				if (this.isCreating) {
					this.sendData('add_chat_message', {content: 'You cannot guess your own word'})
					return false;
				}
				if (this.hasGuessed) {
					this.sendData('add_chat_message', {content: 'You have already guessed the word'})
					return false;
				}

				Game.allClients('add_chat_message', {content: this.name + ' guessed the word!', color: 'green'})
				this.sendData('add_chat_message', {content: 'The correct word was: ' + Game.word})

				this.hasGuessed = true;
				Game.rightGuesses++;

				if (Game.rightGuesses === 1) {
					this.score += 11;
					Game.creator.score += 4;
				} else if (Game.rightGuesses <= 3) {
					this.score += 8;
				} else {
					this.score += 5;
				}
				Game.updateScoreboard()

				var user_left;
				Game.perUser(user => {
					if (!user.hasGuessed && !user.isCreating) {
						user_left = user;
					}
				})
				if (!user_left) {
					stopCreation()
				}
				return true;
			}
			quit() {
				delete Game.users[this.id];
			}
		}

		//Rounds
		function startGame(formData) {
			Game.guessing_time = formData.guessing_time*60
			Game.rounds = formData.rounds
			Game.running = true;
			Game.round = 0;
			Game.allClients('setup_game', {})
			startRound()
		}
		function startRound() {
			Game.round++;
			console.log('starting round '+Game.round)
			Game.perUser(user => {
				delete user.hasCreated;
			})
			startCreation()
		}

		function startCreation() {
			//Reset
			Game.rightGuesses = 0;
			//Randomize
			var free = [];
			Game.perUser(user => {
				delete user.hasGuessed;
				if (!user.hasCreated) free.push(user);
			})
			if (free.length === 0) return false;
			var next = free.random()

			newProject(false, true)
			EditSession.initNewModel(true)

			var word = keywords.random()
			Game.word = word
			completed_word = word.replace(/[A-Za-z0-9]/g, '_')
			completed_characters = 0;
			Game.allClients('display_word', completed_word)
			next.startTurn(word)

			Game.allClients('display_progress', {progress: 1, time: Game.guessing_time*1000})

			var interval_time = (Game.guessing_time*2) / word.length
			GameTiming.completing = setInterval(completeWord, interval_time*1000)
			GameTiming.timeout = setTimeout(stopCreation, Game.guessing_time*1000)
			return true;
		}
		function completeWord() {
			completed_characters++;
			var index = Math.floor(Math.random()*Game.word.length);
			completed_word = completed_word.substr(0, index) + Game.word[index] + completed_word.substr(index+1)
			Game.allClients('display_word', completed_word)
		}
		function stopCreation() {
			clearTimeout(GameTiming.timeout)
			clearInterval(GameTiming.completing)
			Game.allClients('display_progress', {progress: 0})

			Game.allClients('end_turn', {word: Game.word})
			delete Game.word;
			Game.creator.isCreating = false;
			delete Game.creator;

			setTimeout(function() {
				if (!startCreation()) {
					if (Game.round < Game.rounds) {
						startRound()
					} else {
						endGame()
					}
				}
			}, 5000)
			Game.allClients('display_progress', {progress: 0, time: 5000})

		}
		function endGame() {
			cl('Game has ended')
			var highscore = 0;
			var winner;
			Game.perUser(user => {
				if (user.score >= highscore) {
					highscore = user.score;
					winner = user;
				}
				delete user.hasGuessed;
				delete user.hasCreated;
				delete user.isCreating;
			})
			Game.allClients('add_chat_message', {content: `The game ended. The winner is "${winner}" with ${highscore} points. Congratulations!`, color: 'orange'})
			setTimeout(function() {

				newProject(false, true)
				EditSession.initNewModel(true)
				Game.allClients('display_progress', {progress: 0})
				dialog.show()
				Game.perUser(user => {
					user.score = 0;
				})
				Game.running = false;
			}, 8000)
			Game.allClients('display_progress', {progress: 1, time: 8000})
		}


		//Dist
		Game.perUser = function(cb) {
			var i = 0;
			for (var id in Game.users) {
				var user = Game.users[id]
				cb(user, i)
				i++;
			}
		}
		Game.allClients = function(key, data) {
			EditSession.sendAll(key, data)
			clientAction(key, data)
		}
		Game.wordMatches = function(word) {
			if (!Game.word || typeof word !== 'string') return;

			word = word.trim().toLowerCase().replace(/[-_]{1}/g, ' ')
			return word && Game.word.toLowerCase() === word
		}
		Game.processChatMessage = function(message) {
			var user = Game.users[message.sender]
			if (Game.wordMatches(message.content)) {
				Game.users[message.sender].guess()
			} else {
				Game.allClients('add_chat_message', {author: user.name, content: message.content})
			}
		}
		Game.displayWord = function(word) {
			Game.allClients('display_word', word)
		}
		Game.updateScoreboard = function() {
			var data = []
			Game.perUser((user) => {
				data.push({name: user.name, score: user.score})
			})
			Game.allClients('update_scoreboard', data)
		};

		//Users
		Game.users[EditSession.peer.id] = new GameUser({
			id: EditSession.peer.id,
			name: EditSession.username,
			isHost: true
		})
		Game.updateScoreboard()
		Blockbench.on('user_joins_session', (d2) => {
			if (Game.running) {
				d2.conn.send({
					type: 'add_chat_message',
					fromHost: true,
					sender: EditSession.peer.id,
					data: {content: 'You cannot join this session', color: 'red'}
				});
			} else {
				Game.users[d2.conn.peer] = new GameUser({
					id: d2.conn.peer,
					name: d2.conn.metadata && d2.conn.metadata.username,
					conn: d2.conn
				})
				Game.updateScoreboard()
			}
		})
		Blockbench.on('user_leaves_session', (d2) => {
			Game.users[d2.conn.peer].quit()
			Game.updateScoreboard()
		})

		var dialog = new Dialog({
			id: 'guessing_game',
			title: 'Guessing Game Controls',
			buttons: ['Start Game', 'Cancel'],
			form: {
				token: {label: 'Session Token', value: d1.token, readonly: true},
				guessing_time: {label: 'Guess Time (m)', type: 'number', value: 2, min: 0.4, max: 8, step: 0.25},
				rounds: {label: 'Rounds', type: 'number', value: 3, min: 1, max: 12},
			},
		    onConfirm: function(formData) {
		    	startGame(formData)
		        this.hide()
		    },
		    onCancel: function() {
		        EditSession.quit()
		        this.hide()
		    }
		}).show()
	})

	Blockbench.on('join_session', () => {
		GameInterface.setup()
	})

	function clientAction(key, data) {
		if (key === 'setup_game') {
			GameClient.isPlaying = true;
			
		} else if (key === 'add_chat_message') {
			GameInterface.appendChatMessage(data.author, data.content, data.color)
			
		} else if (key === 'update_scoreboard') {
			GameInterface.updateScoreboard(data)
			
		} else if (key === 'display_progress') {
			GameInterface.progress(data)
			
		} else if (key === 'display_word') {
			if (!GameClient.is_creator || !data.includes('_')) {
				GameInterface.displayWord(data)
			}
			
		} else if (key === 'start_turn') {
			GameClient.is_creator = true;
			GameInterface.displayWord(data.word)
			Blockbench.showQuickMessage(`It's your turn! Build "${data.word}"`, 1600)
			
		} else if (key === 'end_turn') {
			GameClient.is_creator = false;
			Blockbench.showQuickMessage(`The round has ended! The word was "${data.word}"`, 1800)
			GameInterface.displayWord('')
			
		}
	}

	Blockbench.on('send_session_data', (tag) => {
		if (GameClient.isPlaying && ['edit', 'undo', 'redo'].includes(tag.type)) {
			if (!GameClient.is_creator) {
				tag.type = 'intervened';
			}

		}
	})

	Blockbench.on('finished_edit', tag => {
		if (!tag.remote && GameClient.isPlaying && !GameClient.is_creator) {
			var entry = Undo.history[Undo.history.length-1]
			Undo.loadSave(entry.before, entry.post)
			Blockbench.showQuickMessage(`It's not your turn!`, 1200)
		}
	})

	Blockbench.on('receive_session_data', (tag) => {
		cl('Received: ', tag)
		if (tag.fromHost && !GameClient.is_host) {
			clientAction(tag.type, tag.data)
		} else if (!tag.fromHost && GameClient.is_host) {
			if (tag.type === 'chat_message') {
				Game.processChatMessage(tag.data)
			}
		}
	})

})()

onUninstall = function() {
}

/*
	third user name doesn't appear in scoreboard
*/