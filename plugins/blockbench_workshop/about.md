# Blockbench Workshop

Send the open project to [Blockbench Workshop](https://blockbenchworkshop.com).
Your model opens on the website, where you add details and publish. The plugin
never publishes on its own.

1. Choose **File → Blockbench Workshop → Link account**.
2. Compare the code shown in Blockbench with the browser page, then approve it.
   Closing the link dialog cancels the request.
3. Choose **Send to Blockbench Workshop** to send the current project as a
   `.bbmodel`, including its project textures, to the upload page.

Use **Linked account** to check the account and **Sign out** to remove its token.
The token is kept in namespaced local storage, shared with other Blockbench
plugins. It can only send models and read your public account summary; revoke it
in Workshop settings if needed. No files are sent until you choose Send.

The plugin supports desktop and web Blockbench. Models must fit the website's
upload size limit. For local development, change **Blockbench Workshop server**
in Blockbench's Settings to `http://localhost:3000`. Each server has its own token.

## Build and test

Source is in `src/` of the plugin workspace package. Run `pnpm build` there to
reproduce `plugins/blockbench_workshop/blockbench_workshop.js` using esbuild,
without minification or remote code. No runtime libraries are bundled.

For a manual test, use Blockbench's Plugins dialog → **Load Plugin from File**
and select `blockbench_workshop.js`. In web Blockbench use the file picker; no
filesystem API is required by the plugin. Test link approval/cancellation,
linked-account display, Send, server switching, revoked tokens and Sign out
against a development server implementing the shared protocol.
