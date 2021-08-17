import express from 'express';
import path from 'path';

const server = express();

server.use(
	express.static(path.resolve(__dirname,'./'))
);
server.get('/', async (req, res) => {
	res.sendFile(path.resolve(__dirname,'../index.html'));
});
server.listen(3000, () => {
	console.log(`server is up on ${3000} port`);
});