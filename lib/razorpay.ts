import Razorpay from 'razorpay';

/**
 * Server-only Razorpay client. Reads keys from the environment so secrets
 * never reach the browser. Throws a clear error if called without config.
 */
export function getRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret) {
    throw new Error(
      'Razorpay is not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local'
    );
  }

  return new Razorpay({ key_id, key_secret });
}
