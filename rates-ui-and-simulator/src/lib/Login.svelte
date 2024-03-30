<script lang="ts">
	import solaceClient from './SolaceClient';
	import { ConsoleLogger, loggedIn, trader_name } from './lib';

	let solace_host = 'ws://52.91.198.51:8008',
		solace_vpn = 'GlobalRatesVPN',
		solace_username = 'BillTrader',
		solace_password = 'admin';

	const login = () => {
		solaceClient
			.connect(solace_host, solace_vpn, solace_username, solace_password)
			.then((info) => {
				ConsoleLogger.log(info.toString());
				trader_name.set(solace_username);
				loggedIn.set(true);
			})
			.catch((error) => {
				ConsoleLogger.error('Failed to connect to Solace: ' + error.toString());
			});
	};
</script>

<section>
	<div class="flex flex-col items-center justify-center mx-auto mt-10 lg:py-0">
		<div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
			<div class="p-6 space-y-4 md:space-y-6 sm:p-8">
					<div>
						<label for="username" class="block mb-2 text-sm font-medium text-gray-900"
							>username</label
						>
						<input
							type="text"
							name="username"
							id="username"
							class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
							placeholder="admin"
							bind:value={solace_username}
						/>
					</div>
					<div>
						<label for="password" class="block mb-2 text-sm font-medium text-gray-900"
							>password</label
						>
						<input
							type="password"
							name="password"
							id="password"
							placeholder="••••••••"
							bind:value={solace_password}
							class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
						/>
					</div>
					<div>
						<label for="vpn" class="block mb-2 text-sm font-medium text-gray-900">vpn</label>
						<input
							type="vpn"
							name="vpn"
							id="vpn"
							placeholder="••••••••"
							bind:value={solace_vpn}
							class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
						/>
					</div>
					<div>
						<label for="host" class="block mb-2 text-sm font-medium text-gray-900">host</label>
						<input
							type="text"
							name="host"
							id="host"
							placeholder="ws://localhost:8080"
							bind:value={solace_host}
							class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
						/>
					</div>
					<button
						class="w-full text-black bg-red-100 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
						on:click={login}>Sign in</button
					>
			</div>
		</div>
	</div>
</section>
