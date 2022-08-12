# Better GoGoAnime

This is a chrome extension that aims to improve your experience using the anime streaming website [GoGoAnime](https://gogoanimeapp.com/).

It activates when you go to the main website page and replaces the *Airing Anime* block with a custom component.

![Screenshot of Augmented Page](docs/screenshot-1.png)

## Installation

Anyone can use this extension as the client is hosted online and uses local storage to record user preferences. Therefore only the extension needs to be installed. To do so, follow these steps:

1. Download the source code as a `.zip` from the most recent version
2. Extract it somewhere
3. Go to your chrome extension settings and turn on **Developer mode**
4. Click the **Load unpacked** button and select the `extension/` folder in the source code
5. Now the extension should work when going onto [GoGoAnime](https://gogoanimeapp.com/)

## Architecture

The structure of the application is made up by two parts:

The **Client** is a react app that is hosted on a netlify server. It models the *Airing Anime* section of GoGoAnime by showing a grid layout of the most recently added episodes of shows. It accesses the data and links by calling the GoGoAnime api and then rebuilds the interface with additional features.

The **Extension** is the chrome extension that once downloaded, activates when going to the site and then deletes the section and creates an *iframe* that is linked to the client. It also modifies other areas of the page such as placing buttons, which can communicate with the page in the iframe through [iframe messaging](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).
