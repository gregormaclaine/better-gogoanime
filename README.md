# Better GoGoAnime

This is a chrome extension that aims to improve your experience using the anime streaming website [GoGoAnime](https://gogoanimeapp.com/).

It activates when you go to the main website page and replaces the *Airing Anime* block with a custom component.

![Screenshot of Augmented Page](docs/screenshot-1.png)

## Architecture

The structure of the application is made up by two parts:

The **Client** is a react app that is hosted on a netlify server. It models the *Airing Anime* section of GoGoAnime by showing a grid layout of the most recently added episodes of shows. It accesses the data and links by calling the GoGoAnime api and then rebuilds the interface with additional features.

The **Extension** is the chrome extension that once downloaded, activates when going to the site and then deletes the section and creates an *iframe* that is linked to the client. It also modifies other areas of the page such as placing buttons, which can communicate with the page in the iframe through [iframe messaging](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).
