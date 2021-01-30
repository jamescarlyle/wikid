<script>
	// Define standard exports for parameterisation.
	export let ipfsNode;
    export let contextCID;
	export let pageName;
	let contextObj;

	const retrieveContext = async () =>  contextObj = await ipfsNode.object.get(contextCID);
	const newPage = (event) => {
		// Start by terminating the form submission, which is needed to perform input validation.
		event.preventDefault();
		// Nothing else to do but load the context page and form.
		location.hash = 'page/' + contextCID + '/' + pageName;
	}

	// We need to signal to Svelte that the component's contextObj should be updated whenever the contextCID changes.
	$: { retrieveContext(contextCID); };
</script>

<!-- list of pages in context -->
{#if contextObj}
	<h1>&#x1f5d0; Wiki: {contextObj.Data}</h1>
{/if}
<p><small>Wiki IPFS ID: <b>{[...contextCID].map((d, i)=>(i)%4==0?' '+d:d).join('')}</b></small></p>
<h2>Pages:</h2>
{#if contextObj}
	{#if contextObj.Links.length}
		<ol>
			{#each contextObj.Links as link}
				<li><a href="#page/{contextCID}/{link.Name}">{link.Name}</a></li>
			{/each}
		</ol>
	{:else}
		<p>There are no pages in this Wiki.</p>
	{/if}
{/if}
<hr/>
<p>Create a new page:</p>
<form on:submit={newPage}>
	<input type="text" size="40" bind:value={pageName} required 
	placeholder="The name of the page, 2 or more words joined by capitals, WikiName style, e.g. ToDoList" 
	pattern="(?:[A-Z][a-z]+)&lbrace;2,&rbrace;"
	title="Page name should be 2 or more words joined by capitals, WikiName style."/>
	<button type="submit">CREATE &#x1F589;</button>
</form>