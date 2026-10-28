import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

/**
 * In production Vercel serves `api/*.js`. In `npm run dev` this plugin routes
 * `/api/<name>` to the same file, so the demo works locally with a
 * `.env.local` that holds GEMINI_API_KEY (or ANTHROPIC_API_KEY).
 */
function localApi() {
  return {
    name: 'apropia-local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const match = req.url?.match(/^\/api\/([\w-]+)/)
        if (!match) return next()

        try {
          const module = await server.ssrLoadModule(`/api/${match[1]}.js`)
          const handler = module[req.method]
          if (!handler) {
            res.statusCode = 405
            return res.end()
          }

          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const request = new Request(`http://localhost${req.url}`, {
            method: req.method,
            headers: req.headers,
            body: chunks.length > 0 ? Buffer.concat(chunks) : undefined,
          })

          const response = await handler(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Server-only variables (no VITE_ prefix): never bundled into the client.
  Object.assign(process.env, loadEnv(mode, process.cwd(), ''))

  return {
    plugins: [react(), localApi()],
  }
})
