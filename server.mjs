import {Server} from "socket.io";
import express from 'express';
import {createServer} from 'node:http';
import {parentPort} from 'worker_threads';
import {fileURLToPath} from 'url';
import * as path from "path";

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const app = express();
const server = createServer(app);
const io = new Server(server);

const router = express.Router();
router.use(express.static(path.join(__dirname, "public")));
app.use("/", router);

io.on("connection", (socket) => {
	console.log(`Socket connected ${socket.id}`);
});

server.listen(3000, () => {
	console.log(`Starting server at http://localhost:3000`);

	parentPort.on("message", serialized => {
		const packet = JSON.parse(serialized);
		io.emit(packet.type, packet.payload);
	});
});
