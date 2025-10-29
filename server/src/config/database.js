import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/expense_tracker';

let hasConnectedOnce = false;

async function connectWithRetry(retry = 0) {
  const maxDelayMs = 30_000;
  const delayMs = Math.min(1000 * Math.pow(2, retry), maxDelayMs);

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10_000,
      heartbeatFrequencyMS: 10_000,
      maxPoolSize: 10,
    });
    hasConnectedOnce = true;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error(`❌ MongoDB connection error (attempt ${retry + 1}):`, error?.message || error);
    // Schedule a retry instead of exiting; avoids server going offline for transient outages
    setTimeout(() => connectWithRetry(retry + 1).catch(() => {}), delayMs);
  }
}

export default async function connectDatabase() {
  // Attach listeners once
  if (mongoose.connection.listenerCount('disconnected') === 0) {
    mongoose.connection.on('connected', () => {
      console.log('🟢 MongoDB connected');
    });
    mongoose.connection.on('disconnected', () => {
      console.warn('🟠 MongoDB disconnected. Retrying in background...');
      // If we ever lose the connection after first connect, retry in background
      connectWithRetry().catch(() => {});
    });
    mongoose.connection.on('error', (err) => {
      console.error('🔴 MongoDB error:', err?.message || err);
    });
  }

  await connectWithRetry();
  // Do not throw; initial call kicks off connection/retries. The server can still start and serve health checks.
}

