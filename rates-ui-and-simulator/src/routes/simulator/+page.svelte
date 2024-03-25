<script lang="ts">
	import Console from '$lib/Console.svelte';
	import { loggedIn, trader_name, type SecurityInfo, ConsoleLogger } from '$lib/lib';
	import Login from '$lib/Login.svelte';
	import Simulator from '$lib/Simulator.svelte';
</script>

<nav class="bg-white border-gray-200 dark:bg-gray-100">
	<div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
		<a href="https://flowbite.com/" class="flex items-center space-x-3 rtl:space-x-reverse">
			<img
				src="https://upload.wikimedia.org/wikipedia/commons/2/20/Bank_of_America_logo.svg"
				class="h-8"
				alt="BofA"
			/>
			<span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-blue"
				>Rates MarketData Simulator</span
			>
		</a>
		<button
			data-collapse-toggle="navbar-default"
			type="button"
			class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
			aria-controls="navbar-default"
			aria-expanded="false"
		>
			<svg
				class="w-5 h-5"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 17 14"
			>
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M1 1h15M1 7h15M1 13h15"
				/>
			</svg>
		</button>
	</div>
</nav>
<section class="content">
	{#if $loggedIn}
		<Simulator />
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
