// Makes one key by hand, for a payment whose email never arrived.
// Run: pnpm --filter @ogpeel/worker make-key <payment id>
import { signKey } from '@ogpeel/license';

const paymentId = process.argv[2];
if (!paymentId) {
  console.error('Usage: pnpm --filter @ogpeel/worker make-key <payment id>');
  process.exit(1);
}
process.loadEnvFile('.dev.vars');
console.log(await signKey(process.env.LICENSE_PRIVATE_KEY, paymentId));
