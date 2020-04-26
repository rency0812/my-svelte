<script>
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';

	const [send, receive] = crossfade({
		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	let todos = JSON.parse(localStorage.getItem('chaceTodo')) || [
		{ id: 1, del: false, done: false, description: 'write some docs' },
		{ id: 2, del: false, done: false, description: 'start writing JSConf talk' },
		{ id: 3, del: false, done: true, description: 'buy some milk' },
		{ id: 4, del: false, done: false, description: 'mow the lawn' },
		{ id: 5, del: false, done: false, description: 'feed the turtle' },
		{ id: 6, del: false, done: false, description: 'fix some bugs' }
	];

	let removes = JSON.parse(localStorage.getItem('chaceRe')) || [];
	let uid = todos.length + 1;

	function add(input) {
		const todo = {
			id: uid++,
			done: false,
			description: input.value,
			del: false
		};

		todos = [todo, ...todos];
		localStorage.setItem('chaceTodo', JSON.stringify(todos));
		input.value = '';
	}

	function remove(todo, type) {
		let index = 0;
		if (type) {
			todo.del = false;
		}
		todo.del = true;
		todos = todos.filter(t => t !== todo);
		removes.push(todo);
		removes = removes.filter(t => t.del);
		localStorage.setItem('chaceTodo', JSON.stringify(todos));
		localStorage.setItem('chaceRe', JSON.stringify(removes));
	}
</script>

<style>
	.new-todo {
		font-size: 1.4em;
		width: 100%;
		margin: 2em 0 1em 0;
	}

	.board {
		max-width: 48em;
		margin: 0 auto;
	}

	.left, .right {
		float: left;
		width: 33.33%;
		padding: 0 1em 0 0;
		box-sizing: border-box;
	}

	h2 {
		font-size: 2em;
		font-weight: 200;
		user-select: none;
	}

	label {
		top: 0;
		left: 0;
		display: block;
		font-size: 1em;
		line-height: 1.15;
		padding: 0.5em;
		margin: 0 auto 0.5em auto;
		border-radius: 2px;
		background-color: #eee;
		user-select: none;
	}

	input { margin: 0 }

	.right label {
		background-color: rgb(180,240,100);
	}

	button {
		float: right;
		height: 1em;
		box-sizing: border-box;
		padding: 0 0.5em;
		line-height: 1;
		background-color: transparent;
		border: none;
		color: rgb(170,30,30);
		opacity: 0;
		transition: opacity 0.2s;
	}

	label:hover button {
		opacity: 1;
	}
	.t-css{
		text-decoration: line-through;
		background-color: #ccc !important;
		color: #666;
	}
</style>

<div class='board'>
	<input
		class="new-todo"
		placeholder="记录你需要做的?"
		on:keydown="{event => event.which === 13 && add(event.target)}"
		autofocus
	>

	<div class='left'>
		<h2>待办</h2>
		{#each todos.filter(t => !t.done) as todo (todo.id)}
			<label
				in:receive="{{key: todo.id}}"
				out:send="{{key: todo.id}}"
				animate:flip
			>
				<input type=checkbox bind:checked={todo.done}>
				{todo.description}
				<button on:click="{() => remove(todo)}">x</button>
			</label>
		{/each}
	</div>

	<div class='right'>
		<h2>完成</h2>
		{#each todos.filter(t => t.done) as todo (todo.id)}
			<label
				in:receive="{{key: todo.id}}"
				out:send="{{key: todo.id}}"
				animate:flip
			>
				<input type=checkbox bind:checked={todo.done}>
				{todo.description}
				<button on:click="{() => remove(todo)}">x</button>
			</label>
		{/each}
	</div>

	<div class='right'>
		<h2>已删除事项</h2>
		{#each removes.filter(t => t.del) as todo (todo.id)}
			<label
				class="t-css"
				in:receive="{{key: todo.id}}"
				out:send="{{key: todo.id}}"
				animate:flip
			>
				<input disabled type=checkbox bind:checked={todo.done}>
				{todo.description}
			</label>
		{/each}
	</div>
</div>
