const app = require('./app');
const env = require('./config/env');
const initializeDatabase = require('./database/initializeDatabase');
const rabbitMqConsumer = require('./messaging/rabbitmq.consumer');

initializeDatabase()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`SVC-INV listening on port ${env.port}`);
    });

    rabbitMqConsumer.start().catch((error) => {
      console.error('SVC-INV RabbitMQ consumer failed to start:', error.message);
    });
  })
  .catch((error) => {
    console.error('SVC-INV database initialization failed:', error);
    process.exit(1);
  });
