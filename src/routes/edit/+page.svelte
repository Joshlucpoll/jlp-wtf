<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let token: string = '';
	let new_youtube_link: string = data.youtube_link;
	let new_redirect_url: string = data.redirect_url;

	let res = '';

	function youtube_parser(url: string) {
		var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
		var match = url.match(regExp);
		return match && match[7].length == 11 ? match[7] : false;
	}

	async function updateEdgeConfig() {
		const edge_config_id = 'ecfg_yvjcikw80ytgfpn9zyqw090nmaog';
		const url_endpoint = `https://api.vercel.com/v1/edge-config/${edge_config_id}/items`;

		const headers = {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		};

		const data = {
			items: [
				{
					operation: 'update',
					key: 'redirect',
					value:
						new_redirect_url == ''
							? null
							: new_redirect_url.match(`^(http|https):\/\/`)
							? new_redirect_url
							: `https://${new_redirect_url}`
				},
				{
					operation: 'update',
					key: 'youtube_link',
					value: `https://www.youtube.com/embed/${youtube_parser(new_youtube_link)}`
				}
			]
		};

		try {
			const updateEdgeConfig = await fetch(url_endpoint, {
				method: 'PATCH',
				headers,
				body: JSON.stringify(data)
			});
			const result = await updateEdgeConfig.json();
			res = JSON.stringify(result);
		} catch (error) {
			res = JSON.stringify(error);
		}
	}
</script>

<form
	on:submit|preventDefault={updateEdgeConfig}
	class="text-white flex flex-col container mx-auto max-w-3xl mt-8 p-4"
>
	<label class="font-bold text-4xl mb-2 mt-8" for="token">Token</label>
	<input
		class="text-black rounded-md p-2"
		type="password"
		name="token"
		bind:value={token}
		required
	/>
	<label class="font-bold text-4xl mb-2 mt-8" for="redirect">Redirect</label>
	<input
		class="text-black rounded-md p-2"
		type="text"
		name="redirect"
		bind:value={new_redirect_url}
	/>
	<div class="flex flex-row flex-wrap mt-4 gap-2">
		{#each data.previous_redirect as redirect}
			<button
				type="button"
				class="p-2 bg-emerald-400 text-black rounded-md"
				on:click={() => (new_redirect_url = redirect.url)}>{redirect.title}</button
			>
		{/each}
	</div>
	<label class="font-bold text-4xl mb-2 mt-8" for="youtube">Youtube Link</label>
	<input
		class="text-black rounded-md p-2"
		type="text"
		name="youtube"
		bind:value={new_youtube_link}
		required
	/>
	<button
		class="max-w-fit p-3 px-8 bg-green-800 mt-12 text-center font-bold rounded-md"
		type="submit">Submit</button
	>
	{#if res}
		<pre class="bg-[#1f2937] rounded-md p-8 mt-24">
			<p class="font-sans font-bold text-4xl mb-4 -mt-6">Result</p>
			<code>{res}</code>
		</pre>
	{/if}
</form>

<a href="/" class="fixed bottom-0 right-0 m-4 py-2 px-8 bg-black text-white font-bold rounded-md"
	>Back</a
>
