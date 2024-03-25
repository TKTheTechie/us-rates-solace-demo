<script lang="ts">
	import solace from 'solclientjs';
	import { ConsoleLogger, trader_name, type SecurityInfo } from './lib';
	import solaceClient from './SolaceClient';

	enum BLOTTERS {
		none = 'none',
		bill = 'bill',
		note = 'note',
		bond = 'bond',
		all = 'all'
	}

	let selectedBlotter: BLOTTERS = BLOTTERS.none;

	interface BlotterEntry {
		securityInfo: SecurityInfo;
		oldPrice: number;
		oldYield: number;
	}

	interface SubManRequest {
		username: string;
		clientName: string;
	}

	let blotterEntries: { [cusip: string]: BlotterEntry } = {};
	let rerender = false;

	const blotterUpdate = (message: solace.Message) => {
		const binaryAttachment = message?.getBinaryAttachment();
		const blob = new Blob([binaryAttachment ? binaryAttachment : ''], {
			type: 'text/plain; charset=utf-8'
		});
		blob.text().then((text) => {
			let securityInfo: SecurityInfo = JSON.parse(text);
			let currentEntry = blotterEntries[securityInfo.cusip];
			if (currentEntry) {
				currentEntry.oldPrice = currentEntry.securityInfo.price;
				currentEntry.oldYield = currentEntry.securityInfo.yield;
				currentEntry.securityInfo.price = securityInfo.price;
				currentEntry.securityInfo.yield = securityInfo.yield;
				rerender = !rerender;
			} else {
				blotterEntries = {
					...blotterEntries,
					[securityInfo.cusip]: {
						securityInfo: securityInfo,
						oldPrice: 0.0,
						oldYield: 0.0
					}
				};
			}
		});
	};

	const changeBlotter = (blotter: BLOTTERS) => {
		if (selectedBlotter != blotter) {
			blotterEntries = {};
			rerender = !rerender;
			if (selectedBlotter != BLOTTERS.none && selectedBlotter != BLOTTERS.all)
				solaceClient.unsubscribe(`bofa/rates/v1/${selectedBlotter.toString()}/>`);
			ConsoleLogger.log(`Selected blotter: ${blotter}`);
			if (blotter != BLOTTERS.all)
				solaceClient.subscribe(`bofa/rates/v1/${blotter.toString()}/>`, blotterUpdate);
			else{
				ConsoleLogger.log(`Sending request to subman on bofa/rates/v1/subman/request/${$trader_name}`);
				solaceClient.sendSubscriptionRequest('bofa/rates/v1/subman/request/'+$trader_name,
				 JSON.stringify({
						username: $trader_name,
						clientName: solaceClient.getClientName()}), blotterUpdate ).then((response: string) => {
						ConsoleLogger.log('Subscribed to the following topics: ' + response);
					}).then(() => {
						ConsoleLogger.log(`Subscribed to all blotter updates`);
					})
			}
			selectedBlotter = blotter;
		}
	};
</script>

<nav class="bg-gray-50 dark:bg-gray-700">
	<div class="max-w-screen-xl px-4 py-3 mx-auto">
		<div class="flex items-center">
			<ul class="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
				{#each Object.values(BLOTTERS) as blotter}
					{#if blotter != BLOTTERS.none}
						<li>
							<button
								class="{selectedBlotter == blotter
									? 'text-blue-500'
									: 'text-white'} hover:text-blue-500 cursor-pointer"
								on:click={() => changeBlotter(blotter)}
							>
								{blotter.charAt(0).toUpperCase() + blotter.slice(1)}
							</button>
						</li>
					{/if}
				{/each}
			</ul>
		</div>
	</div>
</nav>
{#if selectedBlotter == BLOTTERS.none}
	<div class="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
		<div>
			<div class="text-xl font-medium text-black">
				Welcome to the Global Rates Trading Platform!
			</div>
			<p class="text-gray-500 text-center">Select an instrument type to start trading</p>
		</div>
	</div>
{:else}
	<div class="flex flex-col">
		<div class="overflow-x-auto">
			<div
				class="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow"
			>
				<table class="min-w-full">
					<thead>
						<tr>
							<th
								class="px-3 py-1 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 border-b border-gray-200 bg-gray-50"
							>
								cusip
							</th>
							<th
								class="px-3 py-1 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 border-b border-gray-200 bg-gray-50"
							>
								type
							</th>
							<th
								class="px-3 py-1 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 border-b border-gray-200 bg-gray-50"
							>
								term
							</th>

							<th
								class="px-3 py-1 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 border-b border-gray-200 bg-gray-50"
							>
								price
							</th>
							<th
								class="px-3 py-1 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 border-b border-gray-200 bg-gray-50"
							>
								yield
							</th>
						</tr>
					</thead>

					<tbody class="bg-white">
						{#key rerender}
							{#each Object.values(blotterEntries) as entry}
								<tr>
									<td class="px-3 py-1 whitespace-no-wrap border-b border-gray-200 text-xs">
										{entry.securityInfo.cusip}
									</td>
									<td class="px-3 py-1 whitespace-no-wrap border-b border-gray-200 text-xs">
										{entry.securityInfo.securityType}
									</td>
									<td class="px-3 py-1 whitespace-no-wrap border-b border-gray-200 text-xs">
										{entry.securityInfo.securityTerm}
									</td>
									<td
										class="px-3 py-1 whitespace-no-wrap border-b border-gray-200 text-xs {entry
											.securityInfo.price > entry.oldPrice
											? 'bg-green-200'
											: 'bg-red-200'}"
									>
										{entry.securityInfo.price.toFixed(2)}
									</td>
									<td
										class="px-3 py-1 whitespace-no-wrap border-b border-gray-200 text-xs {entry
											.securityInfo.price > entry.oldPrice
											? 'bg-red-200'
											: 'bg-green-200'}"
									>
										{entry.securityInfo.yield.toFixed(2)}
									</td>
								</tr>
							{/each}
						{/key}
					</tbody>
				</table>
			</div>
		</div>
	</div>
{/if}
