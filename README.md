# WIKID
A Svelte-based IPFS-stored personal Wiki system.

This is a minimum viable web application to explore the read/write web on [IPFS](https://ipfs.io). There are many directions to take this but please fork or raise an issue if you'd like to see a particular change.

The product is a Wiki that has no central server. All of the Wiki content is held on IPFS itself, and the Wiki html + Javascript files can also be held and served from IPFS via an IPFS gateway, or served to the browser from a local filesystem or local webserver.

The Wiki supports a subset of markdown syntax: specifically the following

```
# Heading 1-6
* Unordered lists
1. Ordered lists
WikiNames (automatically create links to other Wiki pages)
[markdown links](http://somewhere.else.com)
Paragraphs (separated by 2 new lines)
New lines (separated by 1 new line)
```
More complete markdown syntax support will be added in future.

## Getting started

In order to build the Wiki single page application, simply download all the files in this repository using the following command
```
$ git clone https://github.com/jamescarlyle/wikid.git
```

Then (ensuring that NPM is installed!) run the following command:
```
cd wikid
npm run build
```

This will generate a Svelte-compiled Javascript application.

Then load the public/index.html page. At this stage, it should be possible to create a new Wiki and add pages. If not, please raise an issue.
```
http://localhost/index.html
```

## Technical Details

The page can also be loaded via IPFS itself (note that the hash will change):
```
https://ipfs.io/ipfs/QmYUxBeZfL1BQc8zdqudfAEt61ntouccNKmaNhz95Drfw7/#!/home#start
```

The Wiki works by managing a "context" or "umbrella" for all the Wiki pages that link directly to each other. Behind the scenes, this is an IPFS Object with an array of Links mapping WikiNames to hashes.  The Wiki pages themselves are IPFS Objects with Data but no Links.

Technically speaking, when rendering a page, the context is loaded first, so that the hash of the page can be looked up, and then requested. When saving a page, the page is saved first,
its hash obtained, then the parent context is updated with the new hash for the page. Then the context hash itself will change, so the URL path of the browser changes to reflect the new context.

A Wiki (page collection or context) is an Object in IPFS terms:
```
For a context, the Object stores the following
{
  "Data": ...name of context,
  "Links": [
    {"Name": ...page name, "Hash": ...hash of page}
  ]
}
```
For an individual page, the Object stores the following
```
{
  "Data": ...content of page in markdown,
  "Links": [
    {"Name": ...datestamp of previous version, "Hash": ...hash of previous context}
  ]
}
```



## Get started

Install the dependencies...

```bash
cd wikid
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

If you're using [Visual Studio Code](https://code.visualstudio.com/) we recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).


## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for *any* path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```

## Using TypeScript

This template comes with a script to set up a TypeScript development environment, you can run it immediately after cloning the template with:

```bash
node scripts/setupTypeScript.js
```

Or remove the script via:

```bash
rm scripts/setupTypeScript.js
```

## Deploying to the web

### With [Vercel](https://vercel.com)

Install `vercel` if you haven't already:

```bash
npm install -g vercel
```

Then, from within your project folder:

```bash
cd public
vercel deploy --name my-project
```

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public my-project.surge.sh
```
