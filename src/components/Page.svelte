<script>
	import Editor from './Editor.svelte';
	// Define standard exports for parameterisation.
	export let ipfsNode;
    export let contextCID;
    export let pageName;
	let contextObj;
	let pageLink;
	let pageObj;
	let markdownContent = '';
	let workflow = 'display';

    const retrievePage = async () => {
		// First get the context to fetch a DAGNode.
		contextObj = await ipfsNode.object.get(contextCID);
		// Then look up the page CID from the page name.
		pageLink = await contextObj.Links.find(link => link.Name == pageName);
		// Then fetch the page as a DAGNode.
		if (pageLink) {
			// Fetch the page.
			pageObj = await ipfsNode.object.get(pageLink.Hash);
			// Pull out the markdown content.
			markdownContent = await pageObj.Data;
		} else {
			// Create a new page.
			pageObj = { Data: '', Links: []};
			markdownContent = '';
			workflow = 'edit';
		}
	}

	const savePage = async () => {
		// Only add a previous version if the page already existed.
		if (pageLink) {
			pageObj.Links.push({
				Name: new Date().toUTCString(),
				Hash: contextCID
			})
		}

		// const pageToSave = {
		// 	Data: markdownContent,
		// 	Links: pageObj.Links.concat([{
		// 		Name: new Date().toUTCString(),
		// 		Hash: contextCID
		// 	}])
		// };
		// Save the new page.
		const addedPageCID = await ipfsNode.object.put({Data: markdownContent, Links: pageObj.Links});
		// Now update context with added version.
		// Look up the original position of the page in the context
		const linkPosition = contextObj.Links.findIndex(link => link.Name == pageName);
		// Replace or add the link.
		if (linkPosition > -1) {
			contextObj.Links[linkPosition] = {"Hash": addedPageCID, "Name": pageName};
		} else {
			contextObj.Links.push({"Hash": addedPageCID, "Name": pageName});
		}
		// Replace the context.
		const addedContextCID = await ipfsNode.object.put(contextObj);
		workflow = 'display';
		// Reload the page.
		location.hash = 'page/' + addedContextCID + '/' + pageName;
	}

	// We need to signal to Svelte that the page should be retrieved whenever the contextCID or pageName changes.
	$: {retrievePage(contextCID, pageName)};
</script>

<!-- Single page. -->
<h1>&#x1F5CF; Page: {pageName}</h1>
{#if contextObj}
	<p>Wiki: <a href="#context/{contextCID}"><b>{contextObj.Data}</b></a></p>
{/if}		
{#if pageLink}
	<p><small>Page IPFS ID: <b>{[...pageLink.Hash.toString()].map((d, i)=>(i)%4==0?' '+d:d).join('')}</b></small></p>
{/if}
{#if contextObj}
	<Editor bind:markdownContent={markdownContent} contextCID={contextCID} contextObj={contextObj} pageName={pageName} workflow={workflow}/>
	{#if workflow == 'preview'}
		<button on:click="{savePage}">Save &#x1F5AB;</button>
		<button on:click="{() => {workflow = 'edit'}}">Edit &#x1F589;</button>
	{:else if workflow == 'edit'}
		<button on:click="{() => {workflow = 'preview'}}">Preview &#x1F5DF;</button>
		<button on:click="{() => {workflow = 'display'}}">Cancel &#x1F5D8;</button>
	{:else}
		<button on:click="{() => {workflow = 'edit'}}">Edit &#x1F589;</button>
	{/if}
{/if}
<hr/>
<h3>Page history</h3>
<p>
	{#if pageObj}
		{#if pageObj.Links.length}
		<ol>
			{#each pageObj.Links as link}
			<li class="item" ><a href="#page/{link.Hash}/{pageName}">{link.Name}</a></li>
			{/each}
		</ol>
		{:else}
		<p>This page has no prior versions.</p>
		{/if}
	{/if}		
</p>