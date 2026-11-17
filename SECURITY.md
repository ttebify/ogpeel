# Security

Report security problems privately, not in a public issue:

- On GitHub: Security → Report a vulnerability
- By email: hello@ogpeel.com

Say what you found, how to reproduce it and what it affects.

## What counts

- The extension sends data anywhere, runs before its icon is clicked, or uses a permission beyond `activeTab`, `scripting`, `downloads`, `storage` and `clipboardWrite`.
- Someone can make a key the extension accepts without the private signing key, or the test key works in a store build.
- Someone can get a key emailed without paying (`apps/worker/`).
- A problem on ogpeel.com.

Building the extension from source without the paid part is not a security problem. The MIT licence allows it.
