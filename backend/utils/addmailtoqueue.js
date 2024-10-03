import { emailQueue } from '../Queues/queue.js'; // Import email queue utility

// Function to add an email job to the queue
export const addEmailToQueue = async (to, subject, text, html, cacheKey = null) => {
  try {
    // Add the email sending task to the queue with an optional cache key for invalidation
    await emailQueue.add({
      to,
      subject,
      text,
      html,
      cacheKey // Pass cache key if you need to invalidate it after the email is sent
    });
    console.log('Email job added to queue');
  } catch (error) {
    console.error('Error adding email job to queue:', error);
  }
};
