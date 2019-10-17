<script>
	export let name;
	let src = 'http://pic39.nipic.com/20140307/13928177_195158772185_2.jpg';
	let str = `this is a <b>svelte</b> project`;
	function getName () {
		alert(name)
	}
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<h1>Hello {name}!</h1>
<img on:click="{getName}" {src} alt="{name}" />
<div>{@html str}</div>
