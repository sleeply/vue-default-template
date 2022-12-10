const serialize = require('serialize-javascript');
const path = require('path');
const express = require('express');
const fs = require('fs');
const { renderToString } = require('@vue/server-renderer');
const manifest = require('./dist/server/ssr-manifest.json');
const LRU = require('lru-cache');
const microCache = new LRU({
  max: 1000,
  maxAge: 1000 // Important: entries expires after 1 second.
})

global.fetch = require("node-fetch");
// Create the express app.
const server = express();

// we do not know the name of app.js as when its built it has a hash name
// the manifest file contains the mapping of "app.js" to the hash file which was created
// therefore get the value from the manifest file thats located in the "dist" directory
// and use it to get the Vue App
const appPath = path.join(__dirname, './dist', 'server', manifest['app.js']);
const createApp = require(appPath).default;

const clientDistPath = './dist/client';
server.use('/robots.txt', express.static(path.join(__dirname, clientDistPath, 'robots.txt')));
server.use('/opensearch.xml', express.static(path.join(__dirname, clientDistPath, 'opensearch.xml')));
server.use('/img', express.static(path.join(__dirname, clientDistPath, 'img')));
server.use('/js', express.static(path.join(__dirname, clientDistPath, 'js')));
server.use('/css', express.static(path.join(__dirname, clientDistPath, 'css')));
server.use('/favicon.ico', express.static(path.join(__dirname, clientDistPath, 'favicon.ico')));

// define document instance
let doc = ""
fs.readFile(path.join(__dirname, clientDistPath, 'index.html'), async (err, html) => {
  if (err) {
    throw err;
  }
  doc = html.toString()
})

// handle all routes in our application
server.get('*', async (req, res) => {
  const hit = microCache.get(req.url)
  if (hit) {
    return res.end(hit)
  }

  let { app, store } = await createApp(req.url);
  // let { app, store, router } = await createApp(req.url);

  const renderState = `
    <script>
      window.INITIAL_DATA = ${serialize(store.state)}
    </script>`;

  let appContent = await renderToString(app);

  // set generated content and store initial state
  let html = doc.replace('<div id="app"></div>', `${renderState}<div id="app">${appContent}</div>`);

  res.setHeader('Content-Type', 'text/html');

  // console.log(process.memoryUsage().heapUsed / 1000000)
  microCache.set(req.url, html)
  return res.end(html);
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`You can navigate to http://localhost:${port}`);
});
