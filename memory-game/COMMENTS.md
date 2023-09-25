-**Technology stack: ** I am currently learning React, so I thought that it would be a good idea to use React v18 with vite for skeleton creation, and vitest(jest) & testing-library/react for testing. VSCode as IDE. I have used AI to support my development with GitHub Copilot.

- **Component architecture:** I have broken down the game application into smaller, reusable components (e.g. Several dummy/passive components to display information, while the logic is in the `Game` component.)

- **Custom hook:** I created a custom hook called `useTimer` to manage the game timer.

- **Styling:** There is only one index.css styling file. Normally components are encapsulated with its own style, but I built one CSS to simplify the code.

- **Testing:** I've written unit tests as well as some integration tests. I tried to use screen to really validate what the user would see for real when playing the game.

- **Images: ** I know that the challenge asked for something that you are passionated about. However, I have decided to use open source images to not violate any copyright. There are only two images (for the timeout and the victory) that I used as a tribute to "1, 2, 3, Responda otra vez". My favourite TV show when I was a child.


#Build

**To run this game**, please execute: npm install --legacy-peer-deps (testing-library is not compatible with React 18).
**To serve the application** from a local environment: npm run dev.
**To run the test suite**, npm test.