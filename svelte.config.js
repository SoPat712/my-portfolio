import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: true, // Generates .gz and .br files for even faster serving
			strict: true
		}),
		prerender: {
			handleHttpError: 'warn'
		},
		// Inline the stylesheet so the boot screen paints without waiting for a second request.
		inlineStyleThreshold: 64 * 1024
	}
};

export default config;
