const express = require('express')
const app = express();
const port = 1000;
const fetch = require('node-fetch');

app.use(require('cors')());

function get_url(page) {
    const GOGOANIME_URL = 'https://www5.gogoanimehub.tv';
    return `${GOGOANIME_URL}/page-recent-release.html?page=${page}&type=1`;
}

app.get('/page/:page', async (req, res) => {
    const page = await fetch(get_url(parseInt(req.params.page)));
    const text = await page.text();
    res.send(text);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
