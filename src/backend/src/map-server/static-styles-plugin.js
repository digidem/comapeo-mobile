import assert from 'assert'
import path from 'path'
import fs from 'fs/promises'
import createError from '@fastify/error'
import FastifyStatic from '@fastify/static'
import { Type as T } from '@sinclair/typebox'
import asar from '@electron/asar'
import mime from 'mime'

/**
 * @typedef {import('fastify').FastifyInstance} FastifyInstance
 * @typedef {import('fastify').FastifyBaseLogger} FastifyBaseLogger
 * @typedef {import('fastify').RawServerDefault} RawServerDefault
 * @typedef {import('fastify').FastifyInstance<
 *  import('fastify').RawServerDefault,
 *  import('fastify').RawRequestDefaultExpression<import('fastify').RawServerDefault>,
 *  import('fastify').RawReplyDefaultExpression<RawServerDefault>,
 *  import('fastify').FastifyBaseLogger,
 *  import('@fastify/type-provider-typebox').TypeBoxTypeProvider
 * >} FastifyTypebox
 */

const GetStaticStyleTileParamsSchema = T.Object({
  id: T.String(),
  tileId: T.String(),
  z: T.Number(),
  y: T.Number(),
  x: T.Number(),
  ext: T.Optional(T.String()),
})

const ListStaticStylesReplySchema = T.Array(
  T.Object({
    id: T.String(),
    name: T.Union([T.String(), T.Null()]),
    url: T.String(),
  }),
)

const GetStyleJsonParamsSchema = T.Object({
  id: T.String(),
})

const NotFoundError = createError(
  'FST_RESOURCE_NOT_FOUND',
  'Resource `%s` not found',
  404,
)

/**
 * @param {import('fastify').FastifyRequest} request
 * @returns {string}
 */
function getBaseApiUrl(request) {
  const { hostname, protocol } = request
  return `${protocol}://${hostname}`
}

/**
 * @param {string} archive
 * @param {string} filename
 */
function extractAsarFile(archive, filename) {
  try {
    return asar.extractFile(archive, filename)
  } catch (err) {
    return undefined
  }
}

/**
 * @param {string} baseDirectory
 * @param {import('@sinclair/typebox').Static<typeof GetStaticStyleTileParamsSchema>} params
 * @returns {null | { data: Buffer, mimeType: string | null, shouldGzip: boolean}}
 */
function getStyleTileInfo(baseDirectory, params) {
  const { id, tileId, z, x, y } = params
  let { ext } = params

  const fileBasename = path.join(z.toString(), x.toString(), y.toString())
  const asarPath = path.join(baseDirectory, id, 'tiles', tileId + '.asar')

  console.error({
    fileBasename,
    asarPath,
  })

  /** @type {Buffer | undefined} */
  let data

  if (ext) {
    data = extractAsarFile(asarPath, fileBasename + '.' + ext)
  } else {
    // Try common extensions
    const extensions = ['png', 'jpg', 'jpeg']

    for (const e of extensions) {
      data = extractAsarFile(asarPath, fileBasename + '.' + e)

      // Match found, use the corresponding extension moving forward
      if (data) {
        ext = e
        break
      }
    }
  }

  // extension check isn't fully necessary since the buffer will only exist if the extension exists
  // but useful to check for types reasons
  if (!data || !ext) {
    return null
  }

  const mimeType = mime.getType(ext)

  // Set gzip encoding on {mvt,pbf} tiles.
  const shouldGzip = /mvt|pbf$/.test(ext)

  return { data, mimeType, shouldGzip }
}

/**
 * @param {FastifyTypebox} fastify
 * @param {object} opts
 * @param {string} opts.staticStylesDir
 */

/**
 * @type {import('fastify').FastifyPluginAsync<{ staticStylesDir: string }>}
 */
export async function StaticStylesPlugin(f, opts) {
  // https://fastify.dev/docs/latest/Reference/Type-Providers/#scoped-type-provider
  /** @type {FastifyTypebox} */
  const fastify = f.withTypeProvider()

  const { staticStylesDir } = opts

  const normalizedPrefix = fastify.prefix.endsWith('/')
    ? fastify.prefix
    : fastify.prefix + '/'

  /**
   * @param {import('fastify').FastifyRequest<{Params: import('@sinclair/typebox').Static<typeof GetStaticStyleTileParamsSchema>}>} req
   * @param {import('fastify').FastifyReply} res
   */
  async function handleStyleTileGet(req, res) {
    const result = getStyleTileInfo(staticStylesDir, req.params)

    if (!result) {
      const { tileId, z, x, y, ext } = req.params
      throw new NotFoundError(
        `Tileset id = ${tileId}, ext=${ext}, [${z}, ${x}, ${y}]`,
      )
    }

    const { data, mimeType, shouldGzip } = result

    if (mimeType) {
      res.header('Content-Type', mimeType)
    }

    if (shouldGzip) {
      res.header('Content-Encoding', 'gzip')
    }

    res.send(data)
  }

  /// Registered routes

  fastify.get(
    '/',
    { schema: { response: { 200: ListStaticStylesReplySchema } } },
    async (req) => {
      const styleDirFiles = await fs.readdir(staticStylesDir)

      const result = (
        await Promise.all(
          styleDirFiles.map(async (filename) => {
            const stat = await fs.stat(path.join(staticStylesDir, filename))
            if (!stat.isDirectory()) return null

            let styleJson

            try {
              const styleJsonContent = await fs.readFile(
                path.join(staticStylesDir, filename, 'style.json'),
                'utf-8',
              )

              styleJson = JSON.parse(styleJsonContent)
            } catch (err) {
              return null
            }

            return {
              id: filename,
              name: typeof styleJson.name === 'string' ? styleJson.name : null,
              // TODO: What should this URL point to?
              url: new URL(normalizedPrefix + filename, getBaseApiUrl(req))
                .href,
            }
          }),
        )
      ).filter(
        /**
         * @template {import('@sinclair/typebox').Static<typeof ListStaticStylesReplySchema>[number] | null} V
         * @param {V} v
         * @returns {v is NonNullable<V>}
         */
        (v) => v !== null,
      )

      return result
    },
  )

  fastify.get(
    `/:id/style.json`,
    { schema: { params: GetStyleJsonParamsSchema } },
    async (req, res) => {
      const { id } = req.params

      /** @type {import('fs').Stats} */
      let stat

      /** @type {string | Buffer} */
      let data

      try {
        const filePath = path.join(staticStylesDir, id, 'style.json')
        stat = await fs.stat(filePath)
        data = await fs.readFile(filePath, 'utf-8')
      } catch (err) {
        throw new NotFoundError(`id = ${id}, style.json`)
      }

      const address = req.server.server.address()
      assert(address)

      const hostname =
        typeof address === 'string'
          ? address
          : `${address.address}:${address.port}`

      data = Buffer.from(
        data.replace(
          /\{host\}/gm,
          'http://' + hostname + normalizedPrefix + id,
        ),
      )
      res.header('Content-Type', 'application/json; charset=utf-8')
      res.header('Last-Modified', new Date(stat.mtime).toUTCString())
      res.header('Cache-Control', 'max-age=' + 5 * 60) // 5 minutes
      res.header('Content-Length', data.length)
      res.header(
        'Access-Control-Allow-Headers',
        'Authorization, Content-Type, If-Match, If-Modified-Since, If-None-Match, If-Unmodified-Since',
      )
      res.header('Access-Control-Allow-Origin', '*')

      res.send(data)
    },
  )

  fastify.get(
    `/:id/tiles/:tileId/:z/:x/:y.:ext`,
    { schema: { params: GetStaticStyleTileParamsSchema } },
    handleStyleTileGet,
  )

  fastify.get(
    `/:id/tiles/:tileId/:z/:x/:y`,
    { schema: { params: GetStaticStyleTileParamsSchema } },
    handleStyleTileGet,
  )

  fastify.register(FastifyStatic, {
    root: staticStylesDir,
    decorateReply: false,
    setHeaders: (res, path) => {
      if (path.toLowerCase().endsWith('.pbf')) {
        res.setHeader('Content-Type', 'application/x-protobuf')
      }
    },
  })
}
