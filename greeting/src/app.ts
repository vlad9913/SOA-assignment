import amqp from "amqplib";
import * as http from "http";
import axios from "axios";


const queue = 'login';
const queue2 = 'response';
const weatherApiKey = "5be86c7d0211431a9f9155826232102";

// Connect to RabbitMQ and consume messages from the login queue
async function weather(): Promise<string> {
    const response = await axios.get('http://api.weatherapi.com/v1/current.json?key=5be86c7d0211431a9f9155826232102&q=London&aqi=no');
    // End the request
    console.log(response.data);

    return response.data.current.temp_c;
}


async function startConsumer() {
    const conn = await amqp.connect('amqp://rabbitmq');
    const ch = await conn.createChannel();

    // await ch.purgeQueue(queue);
    // await ch.purgeQueue(queue2);

    await ch.assertQueue(queue);
    await ch.assertQueue(queue2);
    const weatherData = await weather();

    await ch.consume(queue, (msg) => {
        const username = msg.content.toString();
        console.log(`Hello, ${username}!`);
        console.log(`Received message from queue ${queue}: ${username}`);
        ch.sendToQueue(queue2, Buffer.from(`Hello, ${username}! Weather API response for London temperature: ${weatherData}`));
    });
}

startConsumer();
