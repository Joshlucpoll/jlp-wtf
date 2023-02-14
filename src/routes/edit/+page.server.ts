import { get } from '@vercel/edge-config';

export async function load({ params }) {
	const redirect_url = await get('redirect');
	const youtube_link = await get('youtube_link');

	return {
		youtube_link,
		redirect_url
	};
}
