import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
		name: 'holle world, this is a svelte project'
	}
});

export default app;