# Obsidian Code Block Search Plugin

This sample plugin demonstrates some of the basic functionality the plugin API can do.
- Adds a new search function returning only results that appear inside of code blocks.
- Searches across all notes in your vault.
- Generates a temporary tab containing all results.
- Can highlight part of the text and copy it, or click the copy button to copy the entirety of the code.

## Support Me

If this plugin has helped you, please consider donating to any of the following:
- BTC: bc1q3eyafkueyts7tj9u34x3p04t0dhpc5rhna0ruv
- XMR: 42rVZefpocH3Bn3FE3cEFRiDhHtSEAVTUGYJyd3W6FL3JHoachPcu2pWJjS3braJLkAQgWqHHcmDdY3yWC7ZVsZ7JuuRzuo

## How to use

- Clone this repo.
- Make sure your NodeJS is at least v16 (`node --version`).
- `npm i` or `yarn` to install dependencies.
- `npm run dev` to start compilation in watch mode.

## Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.
