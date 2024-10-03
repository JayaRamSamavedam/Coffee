import Queue from 'bull';
import { sendMail } from '../utils/mail.js'; // Import the sendMail utility
import { deleteCache } from '../utils/redis.js'; // Import cache utilities

// Create a Bull queue for email jobs using Redis URL
const emailQueue = new Queue('emailQueue', {
  redis: {
    url: process.env.REDIS_URL // Use the Redis URL directly from environment variables
  }
});

// Process jobs in the email queue
emailQueue.process(async (job) => {
  try {
    const { to, subject, text, html, cacheKey } = job.data;

    // Send the email using the sendMail utility
    await sendMail(to, subject, text, html);

    // Invalidate cache if necessary
    if (cacheKey) {
      await deleteCache(cacheKey);
      console.log(`Cache invalidated for key: ${cacheKey}`);
    }

    console.log(`Email sent to: ${to}`);
  } catch (error) {
    console.error('Error processing email job:', error);
    throw error; // Rethrow the error to enable retries
  }
});

// Retry failed jobs and log the error
emailQueue.on('failed', (job, err) => {
  console.log(`Job ${job.id} failed with error: ${err.message}`);
});

export { emailQueue };
