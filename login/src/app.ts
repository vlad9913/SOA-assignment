import amqp from "amqplib";
import bodyParser from "body-parser";
import express from "express";

const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));
const queue = 'login';
const queue2 = 'response';
// Handle login requests
app.post('/login', async (req, res) => {
    // Validate credentials
    const {username, password} = req.body;
    if (username === 'admin' && password === 'password') {
        // Send a message to the queue with the authenticated user's username
        const conn = await amqp.connect('amqp://rabbitmq');
        const ch = await conn.createChannel();
        await ch.assertQueue(queue);

        ch.sendToQueue(queue, Buffer.from(username));
        console.log(`Sent message to queue ${queue}: ${username}`);
        let queueResponse;

        await ch.consume(queue2, (msg) => {
            queueResponse = msg
        })

        await ch.close();
        await conn.close();

        // Send a response indicating success
        res.status(200).json({message: 'Login successful, message recieved: ' + queueResponse.content.toString()});
    } else {
        // Send a response indicating failure
        res.status(401).json({message: 'Invalid username or password'});
    }
});

const port = 3000;

app.listen(port, () => {
    console.log(`Login service listening on port ${port}`);
});
