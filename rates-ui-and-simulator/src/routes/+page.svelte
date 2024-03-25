<script>
	import Blotter from '$lib/Blotter.svelte';
	import Console from '$lib/Console.svelte';
	import Login from '$lib/Login.svelte';
	import { loggedIn, trader_name } from '$lib/lib';
</script>

<nav class="bg-white border-gray-200 dark:bg-gray-100">
	<div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
		<div class="flex items-center space-x-3 rtl:space-x-reverse">
			<img
				src="https://upload.wikimedia.org/wikipedia/commons/2/20/Bank_of_America_logo.svg"
				class="h-8"
				alt="BofA"
			/>
			<span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-blue"
				>Global Rates Trading Platform</span
			>
			{#if $loggedIn}
				<span class="text-xs text-gray-500 dark:text-gray-400 absolute top-0 right-0 px-5 py-5"
					>Logged in as: {$trader_name}</span
				>
			{/if}
		</div>
	</div>
</nav>

<section class="content">
	{#if $loggedIn}
		<Blotter />
	{:else}
		<Login />
	{/if}
</section>

<Console />

<style>
	.content {
		overflow-y: auto;
		overflow-x: hidden;
		height: 60vh;
	}
</style>
