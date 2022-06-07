# Word Magnets

> A party game where you build sentences out of a random selection of words.

_Word Magnets_ is a party game where players are given a random selection of words each round and have to make sentences from them. Players then vote on their favorite one. At the end of the game, the player with the most total votes wins!

## Installation

1. Clone the repo to your local machine.
2. Run `npm install` in the `word-magnets` folder. This will install the dependencies.
3. Run `npm run build-prod` in the `word-magnets` folder. This will build the Webpack bundle in production mode.
4. Run `npm start` in the `word-magnets` folder. This will start a server on port `3000` and a WebSocket server on port `8080`.
	* To change the server port, edit `src/server/config/serverConfig.ts`.
	* To change the WebSocket port, edit `src/common/config/socketConfig.ts`.
5. Open `localhost:3000` (or whichever port you set it to) and play the game!

## Contributing

I am not taking pull requests at this time.

## Forking

If you want to fork this project to make your own version, make sure to edit `APP_ID` in `src/common/config/appInfo.ts` to a newly-generated UUID.

This is to prevent issues with potential alternate clients (like how Discord has the unauthorized Ripcord client).
