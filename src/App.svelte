<script>
	import Start from './components/Start.svelte';
	import Context from './components/Context.svelte';
	import Page from './components/Page.svelte';

	let component;
	let ipfsNode;
	let context;
	let page;
	let passphrase;
	let viewPassphrase;

	const intialiseNode = async () => {
		ipfsNode = await Ipfs.create();
		hashChange();
	}

	const hashParser = /^#(context|page)(?:\/(.+?)(?:\/(.+?))?)$/;

	const hashMap = {
		context: Context,
		page: Page
	};

	const hashChange = () => {
		let parts = hashParser.exec(location.hash);
		if (parts) {
			component = hashMap[parts[1]];
			context = parts[2],
			page = parts[3]
		} else {
			component = Start;
		}
	};

	$: document.getElementsByName('passphrase').forEach(element => (viewPassphrase? element.type = 'text': element.type = 'password'));
</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/ipfs/dist/index.min.js" on:load={intialiseNode}></script>
</svelte:head>

<svelte:window on:hashchange={hashChange}/>

<header>
	<h1>WIKID</h1>
	<nav>
		The distributed, interplanetary Wiki.
		<a href="#">Start &#x23f5;</a>
		{#if (context)}
			| <a href="#context/{context}">Pages &#x1f5d0;</a>
		{/if}
		| <input type="password" bind:value={passphrase} name="passphrase" placeholder="Passphrase (optional)"/> 
		show <input type="checkbox" bind:checked={viewPassphrase}/>
	</nav>
</header>

<main>
	<svelte:component this={component} ipfsNode={ipfsNode} contextCID={context} pageName={page} bind:passphrase={passphrase} bind:viewPassphrase={viewPassphrase}/>
</main>

<footer>
	<hr/>
	IPFS node is {ipfsNode && ipfsNode.isOnline() ? 'online' : 'offline'} |
	<a href="https://github.com/jamescarlyle/ipfs-wiki">fork &amp; report issues</a> |
	Licensed under GPL |
	<a href="http://james.carlyle.space">James Carlyle</a>
</footer>
