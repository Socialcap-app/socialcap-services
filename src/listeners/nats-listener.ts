import { logger } from '../global.js';
import { connect, JSONCodec, NatsConnection } from 'nats';
import { insertNotification } from '../dbs/notification-helpers.js';

// Create a JSON codec for encoding and decoding messages
const codec = JSONCodec();

async function handleMessage(
  connection: NatsConnection, 
  data: any
) {
  logger.debug(`handleMessage data: `, data);

  // insert the received notification in the DB 
  await insertNotification(data); 

  // now republish message according to scope
  let redirectedSubject = `socialcap:${data.scope}${
    data.scope === 'all' ? '' : '.'+(data.subject || 'none')
  }`;
  
  await connection.publish(
    redirectedSubject, 
    codec.encode(data)
  );
  logger.info(`Redirected message to: ${redirectedSubject}`)
}

function listen(
  connection: NatsConnection, 
  subject: string, 
  handleMessage: (nc: NatsConnection, data: any) => void
) {
  // Subscribe to the subject
  const subscription = connection.subscribe(subject);
  logger.info(`NATS listener subscribed subject: '${subject}'`);

  // Process messages received on the subscribed subject
  (async () => {
    for await (const msg of subscription) {
      try {
        const data = codec.decode(msg.data);
        logger.info(`Received message on subject '${subject}': `
          +`${JSON.stringify(data)}`);

        // Perform processing logic here
        await handleMessage(connection, data);
      }
      catch (err) {
        logger.error('Error processing message: ', err);
      }
    }
  })();
}

async function start() {
  try {
    // connect to the NATS server
    const nc = await connect({
      servers: process.env.NATS_SERVER as string, 
    });
    logger.info(`NATS listener connected: ${process.env.NATS_SERVER}`);

    // listen to subjects
    listen(nc, "socialcap:notifications", handleMessage);
    logger.info(`NATS listener subscribed and listening ...`);
  } catch (error) {
    logger.error('Error connecting to NATS server:', error);
  }
}

// Start the NATSClient
start();