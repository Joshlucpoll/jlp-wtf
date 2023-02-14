import { get } from '@vercel/edge-config';
import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
	const redirect_url = await get('redirect');
	if (redirect_url != null) {
		throw redirect(307, redirect_url);
	}

	const youtube_link = await get('youtube_link');
	console.log(youtube_link);
	return {
		youtube_link
	};
}
