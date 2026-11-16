// Makes the signing pair. The private half goes into .dev.vars (never committed);
// the public half is printed, for LICENSE_PUBLIC_KEY in apps/extension/lib/config.ts.
// Run once: pnpm --filter @ogpeel/worker keygen
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { generateKeys } from '@ogpeel/license';

if (existsSync('.dev.vars') && readFileSync('.dev.vars', 'utf8').includes('LICENSE_PRIVATE_KEY=')) {
  console.error(
    '.dev.vars already has a LICENSE_PRIVATE_KEY. A new pair would stop every key already sold from working.',
  );
  process.exit(1);
}
const { publicKey, privateKey } = await generateKeys();
appendFileSync('.dev.vars', `LICENSE_PRIVATE_KEY=${privateKey}\n`, { mode: 0o600 });
console.log('Private key saved to apps/worker/.dev.vars');
console.log('Public key: ' + publicKey);
