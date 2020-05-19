import CloudflareWorkerGlobalScope from 'types-cloudflare-worker';
import { UpRadioApiRouter, IUpRadioApiRequest } from './api';
declare var self: CloudflareWorkerGlobalScope;

const { getAssetFromKV, mapRequestToAsset } = require('@cloudflare/kv-asset-handler')
/**
 * The DEBUG flag will do two things that help during development:
 * 1. we will skip caching on the edge, which makes it easier to
 *    debug.
 * 2. we will return an error message on exception in your Response rather
 *    than the default 404.html page.
 */
const DEBUG = false

export class Worker {
  static handle(event: FetchEvent) {
    const url = new URL(event.request.url);
    console.log(url.pathname);
    if (url.pathname.startsWith('/api')) {
      event.respondWith(UpRadioApiRouter.route(<IUpRadioApiRequest>event.request))
    } else {
      try {
        event.respondWith(handleEvent(event))
      } catch (e) {
        if (DEBUG) {
          return event.respondWith(
            new Response(e.message || e.toString(), {
              status: 500,
            }),
          )
        }
        event.respondWith(new Response('Internal Error', { status: 500 }))
      }
    }
  }
}

self.addEventListener('fetch', Worker.handle);

async function handleEvent(event: FetchEvent) {
  let options: any = {};
  options.mapRequestToAsset = (req: Request) => {
    // First let's apply the default handler, which we imported from
    // '@cloudflare/kv-asset-handler' at the top of the file. We do
    // this because the default handler already has logic to detect
    // paths that should map to HTML files, for which it appends
    // `/index.html` to the path.
    req = mapRequestToAsset(req)

    // Now we can detect if the default handler decided to map to
    // index.html in some specific directory.
    if (req.url.endsWith('/index.html')) {
      // Indeed. Let's change it to instead map to the root `/index.html`.
      // This avoids the need to do a redundant lookup that we know will
      // fail.
      return new Request(`${new URL(req.url).origin}/index.html`, <RequestInit>req)
    } else {
      // The default handler decided this is not an HTML page. It's probably
      // an image, CSS, or JS file. Leave it as-is.
      return req
    }
  }
  /**
   * You can add custom logic to how we fetch your assets
   * by configuring the function `mapRequestToAsset`
   */
  // options.mapRequestToAsset = handlePrefix(/^\/docs/)

  try {
    if (DEBUG) {
      // customize caching
      options.cacheControl = {
        bypassCache: true,
      }
    }
    return await getAssetFromKV(event, options)
  } catch (e) {
    // if an error is thrown try to serve the asset at 404.html
    if (!DEBUG) {
      try {
        let notFoundResponse = await getAssetFromKV(event, {
          mapRequestToAsset: (req: Request) => new Request(`${new URL(req.url).origin}/404.html`, <RequestInit>req),
        })

        return new Response(notFoundResponse.body, { ...notFoundResponse, status: 404 })
      } catch (e) {}
    }

    return new Response(e.message || e.toString(), { status: 500 })
  }
}

/**
 * Here's one example of how to modify a request to
 * remove a specific prefix, in this case `/docs` from
 * the url. This can be useful if you are deploying to a
 * route on a zone, or if you only want your static content
 * to exist at a specific path.
 */
// function handlePrefix(prefix: string) {
//   return (request: Request) => {
//     // compute the default (e.g. / -> index.html)
//     let defaultAssetKey = mapRequestToAsset(request)
//     let url = new URL(defaultAssetKey.url)

//     // strip the prefix from the path for lookup
//     url.pathname = url.pathname.replace(prefix, '/')

//     // inherit all other props from the default request
//     return new Request(url.toString(), defaultAssetKey)
//   }
// }