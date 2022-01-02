const fs = require('fs')
const path = require('path')
const express = require('express')
const morgan = require('morgan')
const server = express()
// static file
server.use(express.static('dist/client'))
// logger
server.use(morgan('tiny'))
const { createBundleRenderer } = require('vue-server-renderer')
const serverBundle = require('./dist/server/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/client/vue-ssr-client-manifest.json')

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false, // https://ssr.vuejs.org/api/#runinnewcontext
  template: fs.readFileSync(
    path.join(__dirname, 'public/index.template.html'),
    'utf-8',
  ),
  clientManifest,
})

server.get('*', (req, res) => {
  const context = {
    title: 'Server Side Rendering',
    url: req.url,
    metas: ``,
  }

  // No need to pass an app here because it is auto-created by
  // executing the bundle. Now our server is decoupled from our Vue app!
  renderer.renderToString(context, (err, html) => {
    if (err) {
      if (err.code === 404) {
        res.status(404).end('Page not found')
      } else {
        res.status(500).end('Internal Server Error')
      }
      console.error(err)
    } else {
      res.end(html)
    }
  })
})

server.listen(process.env.PORT, () => {
  console.log(`Server listen on port: ${process.env.PORT}`)
})
