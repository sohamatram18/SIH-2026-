import mongoose from 'mongoose';
import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true },
  },
});

let memoryServer = null;

export const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mota_scholarships';

  try {
    logger.info(`Attempting connection to MongoDB at: ${primaryUri}`);
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 3000,
    });
    logger.info('Connected to MongoDB database successfully.');
  } catch (err) {
    logger.warn(`Could not connect to external MongoDB: ${err.message}`);
    logger.info('Starting fallback embedded MongoDB Memory Server for zero-config evaluation...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      memoryServer = await MongoMemoryServer.create();
      const memUri = memoryServer.getUri();
      await mongoose.connect(memUri);
      logger.info(`Connected to embedded MongoDB Memory Server successfully at: ${memUri}`);
      
      // Automatically trigger seed for memory server
      const { seedDatabase } = await import('../seed/seedData.js');
      await seedDatabase();
    } catch (memErr) {
      logger.error(`Fatal: Failed to start embedded MongoDB Memory Server: ${memErr.message}`);
      process.exit(1);
    }
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
    logger.info('MongoDB disconnected cleanly.');
  } catch (err) {
    logger.error(`Error during MongoDB disconnection: ${err.message}`);
  }
};
