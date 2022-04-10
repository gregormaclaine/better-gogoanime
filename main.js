const express = require('express')
const app = express();
const { PORT } = require('./config');
const fetch = require('node-fetch');

app.use(require('cors')());

function get_url(page) {
    const GOGOANIME_URL = 'https://www5.gogoanimehub.tv';
    return `${GOGOANIME_URL}/page-recent-release.html?page=${page}&type=1`;
}

app.get('/', (req, res) => {
    res.send('Better GoGoAnime - Server');
})

app.get('/page/:page', async (req, res) => {
    const page = await fetch(get_url(parseInt(req.params.page)));
    const text = await page.text();
    res.send(text);
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
