export function generateTransactionId() {
  // Get current timestamp
  const timestamp = new Date().getTime();

  // Generate a random number (you can customize the length as needed)
  const random = Math.floor(Math.random() * 10000);

  // Combine timestamp and random number to create a unique ID
  const transactionId = `#${timestamp}${random}`;

  return transactionId;
}
