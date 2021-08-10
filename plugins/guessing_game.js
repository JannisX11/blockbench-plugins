(function() {

var Game;

Plugin.register('guessing_game', {
	title: 'The Guessing Game',
	icon: 'casino',
	author: 'JannisX11',
	description: 'Play the guessing game in Blockbench with your friends',
	version: '1.0.0',
	variant: 'both',
	onload() {

		//Patch
		Chat.processMessage = function(data) {
			if (!EditSession.hosting) {
				EditSession.host.send({
					type: 'chat_input',
					data,
					sender: EditSession.peer.id
				})
				return;
			}
			//Host Only
			Blockbench.dispatchEvent('process_chat_message', data)

			EditSession.sendAll('chat_message', data)
			Chat.addMessage(data)
		}
		Chat.addMessage = function(message) {
			if (!(message instanceof Chat.Message)) {
				message = new Chat.Message(message)
			}
			if (!message.text) return;
			
			Chat.history.push(message)
			Vue.nextTick(() => {
				$('#chat_history').scrollTop(10000)
			})
			if (!document.hasFocus() && !message.self) {
				Blockbench.notification(message.author ? message.author+':' : 'Chat', message.text)
			}
			return message;
		}

		//Setup
		var GameClient = {
			is_creator: false,
		}
		var keywords = [
			'Blockbench', 'Fire', 'Volcano', 'Traveling', 'Batman', 'Gun', 'Folder',
			//Tech
			'Computer', 'Monitor', 'Camera', 'Laptop', 'Tripod', 'Lamp', 'Lever', 'Floppy Disk',  'Playstation', 'Cable', 'Fire Extinguisher', 'Electric Guitar', 'Cinema',
			//Food
			'Cake', 'Apple', 'Plate', 'Fork', 'Knive', 'Cup', 'Pizza', 'Vending Machine', 'Avocado', 'Sausage', 'Cheeseburger', 'Hot Dog', 'Ketchup', 'Pumpkin',
			//Vehicles
			'Car', 'Pickup Truck', 'Forklift', 'Tractor', 'Plane', 'Crane', 'Excavator', 'Bus', 'Wheelchair', 'Bulldozer', 'Golf Cart', 'Bicycle', 'Monster Truck', 'Roller Coaster', 'Helicopter', 'Motorbike', 'Spaceship', 'Train', 'Delivery Truck',
			//Buildings
			'House', 'Castle', 'Eiffel Tower', 'Barn', 'Cabin', 'Bridge', 'Tower Bridge',
			//Pop Culture
			'R2D2', 'Tardis', 'T-Rex', 'Ring', 'Portal Gun', 'Mario', 'DeLorean', 'X Wing',
			//Nature
			'Tree', 'Mountain', 'Snowflake', 'Cactus', 'Bug', 'Cloud', 'Bone',
			//Items
			'Eraser', 'Pen', 'Compass', 'Toilet Paper', 'Phone', 'Gift', 'Ball', 'Ziptie', 'Candle', 'Traffic Cone', 'Key', 'Candy', 'Suitcase', 'Cheese Grater',
			//Tools
			'Bucket', 'Hammer', 'Brush', 'Knive', 'Tape Measure', 'Sickle', 'Scissors', 'Crescent Wrench',
			//Minecraft
			'Creeper', 'Zombie', 'Ghast', 'Beacon', 'Ravager', 'Pickage', 'Sword', 'Battle Axe', 'Axe', 
			//Animals
			'Cow', 'Fox', 'Scarecrow', 'Bird', 'Parrot', 'Bee', 'Bear', 'Cat', 'Human', 'Eagle', 'Hedgehog', 'Snail', 'Giraffe',
			//Body
			'Mustache', 'Head', 'Hand', 'Foot', 'Tooth', 'Mouth', 'Heart',
			//Cloths
			'Pants', 'Jacket', 'Backpack', 'Hat', 'Baseball Cap', 'Sneakers', 'Boots', 'Umbrella', 'Mask', 'Glasses',
		]
		Game = {};
		Game.interface = {
			setup: function() {
				var GI = Game.interface;
				var body = $('#page_wrapper');

				if (GI.isSetup) return;

				body.append(`<style>

					.scoreboard_points {
						display: inline-block;
						margin-left: 8px;
						margin-right: 10px;
					}
					.guessing_game_word {
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
					}

				</style>`)
				//WordDisplay
				GI.word = $(`<div class="guessing_game_word"></div>`)
				body.append(GI.word)
				//Sounds
				GI.bling = document.createElement('AUDIO')
				GI.bling.src = 'https://blockbench.net/api/guessing_game/bling.mp3';
				GI.tada = document.createElement('AUDIO')
				GI.tada.src = 'https://blockbench.net/api/guessing_game/tada.mp3';

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
			updateScoreboard: function(data) {
				Game.interface.scoreboard.empty()
				data.forEach(tag => {
					Game.interface.scoreboard.append(`<li>
						<div class="scoreboard_points">${tag.score}</div>${tag.name}
					</li>`)
				})
			},
			displayWord: function(word) {
				Game.interface.word.text(word)
			},
			progress: function(data) {
				clearInterval(Game.interface.interval)
				if (data.progress !== undefined) {
					Blockbench.setProgress(data.progress)
				}
				if (data.time) {
					var progress = data.progress;
					if (progress === undefined) progress = 1;
					var increment = (progress ? -1 : 1) / (data.time/(100/6))
					Game.interface.interval = setInterval(function() {
						progress += increment;
						if (progress < 0 || progress > 1) {
							progress = Math.clamp(progress, 0, 1);
							clearInterval(Game.interface.interval)
						}
						Blockbench.setProgress(progress)
					}, 100/6)
				}
			}
		}

		Blockbench.on('create_session', (d1) => {

			//Host

			Game.interface.setup()
			var timeout;

			Game.users = {};
			Game.creator = false;
			Game.round = 0;
			Game.rounds = 0;
			Game.rightGuesses = 0;
			
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
					this.client = data.client
					/*
						
					*/
				}
				toString() {
					return this.name;
				}
				startTurn() {
					Game.creator = this;
					Chat.processMessage({text: `${this.name} is now modeling!`, color: 'blue', author: 'GAME'})
					this.sendData('start_turn', {word: Game.word})
					if (!this.hasEverCreated) {
						this.sendChatMessage({text: 'You will get 4 points if your model is guessed', color: 'yellow', author: 'GAME'})
					}
					this.hasEverCreated = true
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
				sendChatMessage(data) {
					this.sendData('chat_message', data)
				}
				guess() {
					if (this.isCreating) {
						this.sendChatMessage({text: 'You cannot guess your own word', author: 'GAME'})
						return false;
					}
					if (this.hasGuessed) {
						this.sendChatMessage({text: 'You have already guessed the word', author: 'GAME'})
						return false;
					}

					Chat.processMessage({text: this.name + ' guessed the word!', color: 'green', author: 'GAME'})
					this.sendChatMessage({text: 'The correct word was: ' + Game.word, author: 'GAME'});
					this.sendData('sound', {sound: 'bling'});

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
				if (Game.round == 1) {
					Chat.processMessage({text: `Be the first player to guess the word and get 11 points! The second and third player get 8 points, everyone else 5.`, color: 'yellow', author: 'GAME'});
				} else {
					Chat.processMessage({text: `Starting round number ${Game.round}!`, color: 'blue', author: 'GAME'});
				}
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
				var user_nr = 1;
				Game.perUser(user => {
					delete user.hasGuessed;
					if (user.hasCreated) {
						user_nr++;
					} else {
						free.push(user);
					}
				})
				if (free.length === 0) return false;
				var next = free.random()

				newProject(Formats.free, true);
				Prop.file_name = Project.name = `The Guessing Game - Round ${Game.round} of ${Game.rounds}, Player ${user_nr} (${next.name})`
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
				Game.allClients('sound', {sound: 'tada'});
				Chat.processMessage({text: `The game ended. The winner is "${winner}" with ${highscore} points. Congratulations!`, color: 'orange', author: 'GAME'})
				setTimeout(function() {

					newProject(Formats.free, true);
					EditSession.initNewModel(true)
					Game.allClients('display_progress', {progress: 0})
					dialog.show()
					Game.perUser(user => {
						user.score = 0;
					})
					Game.updateScoreboard()
					Game.running = false;
				}, 6000)
				Game.allClients('display_progress', {progress: 1, time: 6000})
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
			Blockbench.on('process_chat_message', message => {
				if (!Game.running) return;
				var user = Game.users[message.sender]
				
				if (Game.wordMatches(message.text)) {
					message.text = '';
					Game.users[message.sender].guess()
				}
			})
			Game.displayWord = function(word) {
				Game.allClients('display_word', word)
			}
			Game.updateScoreboard = function() {
				var data = []
				Game.perUser((user) => {
					data.push({name: user.name, score: user.score})
				})
				data.sort((a, b) => b.score - a.score);
				Game.allClients('update_scoreboard', data)
			};

			//Users
			Game.users[EditSession.peer.id] = EditSession.clients[EditSession.peer.id].game_user = new GameUser({
				id: EditSession.peer.id,
				name: EditSession.username,
				isHost: true,
				client: EditSession.clients[EditSession.peer.id]
			})
			Game.updateScoreboard()
			Blockbench.on('user_joins_session', (client) => {
				if (Game.running) {
					client.conn.send({
						type: 'add_chat_message',
						fromHost: true,
						sender: EditSession.peer.id,
						data: {content: 'You cannot join this session', color: 'red'}
					});
				} else {
					Game.users[client.conn.peer] = client.game_user = new GameUser({
						id: client.id,
						name: client.name,
						conn: client.conn,
						client
					})
					Game.updateScoreboard()
				}
			})
			Blockbench.on('user_leaves_session', (d2) => {
				if (Game.users[d2.conn.peer]) {
					Game.users[d2.conn.peer].quit()
					Game.updateScoreboard()
				}
			})

			var dialog = new Dialog({
				id: 'guessing_game',
				title: 'Guessing Game Controls',
				buttons: ['Start Game', 'Cancel'],
				form: {
					token: {label: 'Session Token', value: d1.token, readonly: true},
					guessing_time: {label: 'Guess Time (m)', type: 'number', value: 2, min: 0.4, max: 8, step: 0.1},
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
			$('#blackout').css('z-index', '15');
		})

		Blockbench.on('join_session', () => {
			Game.interface.setup()
		})

		function clientAction(key, data) {
			if (key === 'setup_game') {
				GameClient.isPlaying = true;
				
			} else if (key === 'update_scoreboard') {
				Game.interface.updateScoreboard(data)
				
			} else if (key === 'init_model') {
				setTimeout(() => {
					Prop.file_name = data.name;
				}, 12)
				
			} else if (key === 'display_progress') {
				Game.interface.progress(data)
				
			} else if (key === 'display_word') {
				if (!GameClient.is_creator || !data.includes('_')) {
					Game.interface.displayWord(data)
				}
				
			} else if (key === 'start_turn') {
				GameClient.is_creator = true;
				Game.interface.displayWord(data.word)
				Blockbench.showQuickMessage(`It's your turn! Build "${data.word}"`, 1600)
				
			} else if (key === 'end_turn') {
				GameClient.is_creator = false;
				Blockbench.showQuickMessage(`The round has ended! The word was "${data.word}"`, 1800)
				Game.interface.displayWord('')
				
			} else if (key === 'sound') {
				switch (data.sound) {
					case 'bling': Game.interface.bling.play(); break;
					case 'tada': Game.interface.tada.play(); break;
				}
				
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
			if (tag.fromHost && !EditSession.hosting) {
				clientAction(tag.type, tag.data)
			} else if (!tag.fromHost && EditSession.hosting) {
			}
		})

		Blockbench.on('quit_session', (tag) => {
			Game.interface.updateScoreboard([])
		})


	},
	onunload() {
		if (Game.interface.isSetup) {
			Game.interface.scoreboard.detach();
			Game.interface.word.detach();
		}
	}
});

})()


/*
	Timer schneller ablaufen wenn erraten wurde
	Open window again when clicking edit session
	dima didnt get a word
	show word after round in chat as well

*/