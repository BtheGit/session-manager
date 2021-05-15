# Installation

## Browser

You can add InsticatorSession as a tag from unpkg.

`<script src="unpkg.com/insticator-session"></script>`

InsticatorSession will be exposed on the global scope as `InsticatorSession`.

## Node

Install using either Node

`npm install insticator-session`

or Yarn

`yarn add insticator-session`

Note: As InsticatorSession is still in alpha and breaking changes may occur, we recommend specifying an exact version. For example:

`npm install insticator-session@0.1.0`

Import explicit methods:

`import { getSession } from 'insticator-session';`

# Usage

## Methods

### getSession()

InsticatorSession provides a single method that acts both to create and update user sessions. Call, `getSession` before broadcasting any events for tracking purposes to ensure session's are accurately updated

# Development

In order to contribute to `insticator-session`, ensure you have the project set up correctly.

```
$ git clone git://github.com/bthegit/insticator-session.git
$ cd insticator-session
$ npm ci
```

or

```
$ yarn
```

To build, use

```
$ npm run build
```

or

```
$ yarn build
```

To run tests, use

```
$ npm run test
```

or

```
$ yarn test
```

In addition, a sandbox page is available to be served locally for in browser testing of the core library. Run the `demo` npm script and open the devtools to begin observing the behavior of the library.

```
npm run demo
```

or

```
yarn demo
```

# FAQ

## Why is there no referrer value in the session data?

There are two main types of reasons why the `document.referrer` value may be missing.

The first is when a user arrives on the site via a mechanism that does not involve clicking a click on an external domain. Such as arriving via browser bookmark, typing a URL directly into the browser address bar, using browser navigation controls, etc.

The second is when a user does arrive via a link click (or javascript controlled redirection) but it's still missing. In most cases this is because the referring website intentionally stripped the referrer value. However, if you are attempting to use InsticatorSession on an HTTP site, you shoud be aware that referrer is always stripped by the browser when navigating from a secure HTTPS site to an insecure HTTP one. We recommend setting up TLS certs for your site to mitigate this issue.

## Why is the campaign value in the session data empty?

InsticatorSession tracks campaign types using the industry standard 'utm_campaign' parameter in the querystring. If this parameter is not in the url, InsticatorSession is unable to determine the campaign type. Future versions may support custom campaign keys. Until then, we suggest using 'utm_campaign' whenever you are trying to create new campaign links for distribution.

Not using 'utm_campaign' may cause inaccurate session tracking as InsticatorSession will be unable to correctly create new sessions for each campaign type.

## Why does a session not persist when a user closes and re-opens the browser within the 30 minute session limit?

InsticatorSession uses client-managed session cookies for tracking an active session. Session cookies are specifically cookies where the `expires` header is unspecified (see [Set-Cookie Attributes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#Attributes)).

Be aware that a session may not in fact end when a user closes their browser as many modern browsers have a resume feature that restores browser storage state as well. However, InsticatorSession will still ensure that even if a user's browser persists the session cookies longer than the 30 minute session duration, the session will be expired and a new one started prior to any new events being recorded.
