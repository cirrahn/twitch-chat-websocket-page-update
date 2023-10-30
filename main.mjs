import {Worker} from 'worker_threads';

const workerOpts = {type: "module"};

const workerTwitch = new Worker("./twitch.mjs", workerOpts);
const workerServer = new Worker("./server.mjs", workerOpts);

workerTwitch.on("message", serialized => {
	workerServer.postMessage(serialized);
});
