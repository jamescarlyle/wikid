# WIKID
A Svelte-based IPFS-stored personal Wiki system.

This is a minimum viable web application to explore the read/write web on [IPFS](https://ipfs.io). There are many directions to take this but please fork or raise an issue if you'd like to see a particular change.

The product is a Wiki that has no central server. All of the Wiki content is held on IPFS itself, and the Wiki html + Javascript files can also be held and served from IPFS via an IPFS gateway, or served to the browser from a local filesystem or local webserver.

This version of the application runs an IPFS node in the browser itself - the [previous version](https://github.com/jamescarlyle/ipfs-wiki) additionally required access to an IPFS daemon, either locally or remotely. Pages can be symmetrically-encrypted using AES if saved with a passphrase, which **must be reentered later** in order to be able to read the page. In other words, if the passphrase is lost, the pages saved with it will be unreadable. This implementation is likely to be secure but is very basic.

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
```bash
$ git clone https://github.com/jamescarlyle/wikid.git
```

Then (ensuring that NPM is installed!) run the following command:
```bash
cd wikid
npm install
npm run build
```

This will generate a Svelte-compiled Javascript application.

Then load the public/index.html page. Note that the application starts an IPFS node in the browser (where the status is shown in the page footer), which uses local browser storage, so first-party cookies should be enabled. At this stage, it should be possible to create a new Wiki and add pages. If not, please raise an issue.
```
http://localhost/index.html or file:///path/to/public/index.html
```

## Technical Details

The page can also be loaded via IPFS itself (note that the hash will change), using a gateway such as:
```
https://ipfs.io/ipfs/Qmcj6x5wvGd6uCEF9GA2C5PwcviS5NayrH31b8UaTwZFGj/index.html
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
