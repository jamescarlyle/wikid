<script>
	import Editor from "./Editor.svelte";
	// Define standard exports for parameterisation.
	export let ipfsNode;
	export let passphrase;
	export let viewPassphrase;
	let contextName = '';

	async function save(event) {
		// Start by terminating the form submission, which is needed to perform input validation.
		event.preventDefault();
		const contextToSave = {
			Data: contextName,
			Links: []
		};
		// Save the new page.
		const addedContextCID = await ipfsNode.object.put(contextToSave);
		// Reload the page.
		location.hash = 'context/' + addedContextCID;
	}
</script>

<h1>&#x23f5; Getting started</h1>
<h2>What is the Interplanetary Wiki?</h2>
<p>Interplanetary Wiki allows you to create a set of Wiki pages that easily be linked to each other.</p>
<p>
	Interplanetary Wiki pages are stored on <a href="https://ipfs.io">IPFS, the Interplanetary Filesystem</a>. 
	This means that there is no central server, and any of the nodes in the IPFS network could store the pages 
	and be used to retrieve them. The application is built using just IPFS and Javascript - the simplest possible 
	thing that could work.	&quot;Wiki&quot; means &quot;quick&quot; in Hawaiian, and the Wiki goal is that it is 
	quick to edit the web.
</p>
<p>
	Wiki pages are immutable - that means that each time a page is edited, a completely new copy of the page is 
	saved. This is not a problem, since the old versions of the page will be deleted automatically unless they 
	have been 'pinned'. It does mean that an auditable page history can be kept if necessary.
</p>
<h2>Syntax</h2>
<p>
	The Wiki supports a subset of markdown syntax. These are all block-level types and require newline separation between them.
</p>
<pre>
	<code>
Paragraphs (separated by 2 new lines)
New lines (separated by 1 new line)
# Heading 
## Sub-heading 
### Sub-sub-heading etc.
* Unordered lists
1. Ordered lists
	</code>
</pre>
<p>
	These are in-line types.
</p>
<pre>
	<code>
WikiNames (multi-part concatenated words with capitalisation, automatically create links to other Wiki pages)
[markdown links](http://somewhere.else.com)
email@address.com links
	</code>
</pre>
<p>More complete markdown syntax support will be added in future.</p>
<p><b>Practice editing Wiki text using the sandbox:</b></p>
<Editor workflow="practice"/>
<h2>Let's get started</h2>
<p>The first step is to select a name for your Wiki and a passphrase if you wish to protect the page content.</p>
<form on:submit={save}>
	<fieldset>
		<legend>Wiki Name</legend>
		<input type="text" bind:value={contextName} 
		size="60"
		maxlength="40"
		required
		pattern="(?:[A-Z][a-z]+)&lbrace;2,&rbrace;"
		title="A Wiki name is required, 2 or more words joined by capitals, e.g. MyWiki."
		placeholder="The name of your Wiki, 2 or more words joined by capitals, e.g. MyWiki."/>
	</fieldset>
	<fieldset>
		<legend>Passphrase (optional)</legend>
		<input type="password" bind:value={passphrase} name="passphrase"/>
		show <input type="checkbox" bind:checked={viewPassphrase}/>
		<p>If a passphrase is set, all pages' content will be encrypted using the passphrase, <em>and will only be readable if the same passphrase is entered later</em>.</p>
	</fieldset>
	<button type="submit">Start &#x23f5;</button>
</form>