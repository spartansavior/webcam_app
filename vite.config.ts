import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import Anthropic from '@anthropic-ai/sdk'

const SUPPORTED_MEDIA_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const
type SupportedMediaType = (typeof SUPPORTED_MEDIA_TYPES)[number]

function isSupportedMediaType(value: string): value is SupportedMediaType {
  return (SUPPORTED_MEDIA_TYPES as readonly string[]).includes(value)
}

// Runs only on the dev server (Node), so ANTHROPIC_API_KEY never reaches the browser bundle.
function anthropicApiPlugin(apiKey: string): Plugin {
  return {
    name: 'anthropic-analyze-api',
    configureServer(server) {
      server.middlewares.use('/api/analyze', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method Not Allowed')
          return
        }

        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })

        req.on('end', () => {
          void (async () => {
            try {
              if (!apiKey) {
                throw new Error('ANTHROPIC_API_KEY is missing. Add it to your .env file.')
              }

              const { image } = JSON.parse(body) as { image?: string }
              const match = /^data:(.+);base64,(.*)$/.exec(image ?? '')
              if (!match) throw new Error('Invalid image data')

              const [, mediaType, data] = match
              if (!isSupportedMediaType(mediaType)) {
                throw new Error(`Unsupported image type: ${mediaType}`)
              }

              const client = new Anthropic({ apiKey })
              const response = await client.messages.create({
                model: 'claude-opus-4-7',
                max_tokens: 1024,
                messages: [
                  {
                    role: 'user',
                    content: [
                      { type: 'image', source: { type: 'base64', media_type: mediaType, data } },
                      {
                        type: 'text',
                        text: 'Look at this webcam photo and tell the person what it is. Be brief, warm, and playful.',
                      },
                    ],
                  },
                ],
              })

              const text = response.content.find((block) => block.type === 'text')?.text ?? ''
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ text }))
            } catch (error) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(
                JSON.stringify({
                  error: error instanceof Error ? error.message : 'Unknown error',
                }),
              )
            }
          })()
        })
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), anthropicApiPlugin(env.ANTHROPIC_API_KEY)],
  }
})
