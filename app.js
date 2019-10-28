const 
	feathers = require('@feathersjs/feathers'); // FeathersJS
	express = require('@feathersjs/express'); // ExpressJS
	socketio = require('@feathersjs/socketio'); // Socket.IO
	moment = require('moment'); // MomentJS
	app = express(feathers());
	PORT = process.env.PORT || 3030;

// Icecream Service
class IcecreamService {
	constructor() {
		this.icecreams = [];
	}

	async find() {
		return this.icecreams;
	}

	async create(data) {
		const icecream = {
			id: this.icecreams.length,
			flavor: data.flavor,
			contributor: data.contributor
		}

		icecream.time = moment().format('h:mm:ss a');

		this.icecreams.push(icecream);

		return icecream;
	}
}


// Parse JSON
app.use(express.json());
// Config Socket.io realtime APIs
app.configure(socketio());
// Enable REST services
app.configure(express.rest());
// Register services
app.use('/icecreams', new IcecreamService());

// New connections connect to stream channel
app.on('connection', conn => app.channel('stream').join(conn));
//Publish events to stream
app.publish(data => app.channel('stream'));

app
	.listen(PORT)
	.on('listening', () =>
		console.log(`Realtime server running on port ${PORT}!`)
	);



