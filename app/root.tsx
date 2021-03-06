import type { MetaFunction } from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from '@remix-run/react'

import __dev_styles__ from '../styles/development.css'

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'meeting app',
  viewport: 'width=device-width,initial-scale=1'
})

export function links () {
  return [
    { rel: 'stylesheet', href: __dev_styles__ }, /* todo: rm on prod */
    { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/daisyui@2.14.3/dist/full.css' }
  ]
}

export default function App () {
  return (
    <html lang='en'>
      <head>
        <Meta />
        <Links />
        <script src='https://cdn.tailwindcss.com' />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
