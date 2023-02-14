<script lang="ts">
	import type { PageData } from './$types';
	import axios from 'axios';

	export let data: PageData;

	let token: string = '';
	let new_youtube_link: string = data.youtube_link;
	let new_redirect_url: string = data.redirect_url;

	let res = '';
	console.log(data);

	async function updateEdgeConfig() {
		try {
			res = await axios.patch(
				'https://api.vercel.com/v1/edge-config/ecfg_yvjcikw80ytgfpn9zyqw090nmaog/items',
				{
					items: [
						{
							operation: 'update',
							key: 'redirect_url',
							value: new_redirect_url
						},
						{
							operation: 'update',
							key: 'youtube_link',
							value: new_youtube_link
						}
					]
				},
				{
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json'
					}
				}
			);
		} catch (e) {
			res = e;
		}
	}
</script>

<form on:submit={updateEdgeConfig} class="text-white flex flex-col container mx-auto">
	<label for="token">Token</label>
	<input class="text-black" type="text" name="token" bind:value={token} required />
	<label for="redirect">Redirect</label>
	<input class="text-black" type="text" name="redirect" bind:value={new_redirect_url} />
	<label for="youtube">youtube_link</label>
	<input class="text-black" type="text" name="youtube" bind:value={new_youtube_link} required />
	<button type="submit">Submit</button>
	<p>{res}</p>
</form>
