<script lang="ts">
	import { ConsoleLogger, type SecurityInfo } from '$lib/lib';
	import { onMount, onDestroy } from 'svelte';
	import solaceClient from './SolaceClient';

	let configDisabled = false;

	class SimulatorConfig {
		constructor(securityType: string, publishInterval: number, enabled: boolean) {
			this.securityType = securityType;
			this.publishInterval = publishInterval;
			this.enabled = enabled;
		}
		securityType: string;
		publishInterval: number;
		enabled: boolean;
	}

	const billSimulatorConfig = new SimulatorConfig('Bills', 5, true);
	const noteSimulatorConfig = new SimulatorConfig('Notes', 10, true);
	const bondSimulatorConfig = new SimulatorConfig('Bonds', 120, true);

	const billInstruments: SecurityInfo[] = [];
	const noteInstruments: SecurityInfo[] = [];
	const bondInstruments: SecurityInfo[] = [];

	let billInterval: number, noteInterval: number, bondInterval: number;

	const updateInstruments = (type: string, instruments: SecurityInfo[]) => {
		ConsoleLogger.log(`Simulating ${instruments.length} ${type} instruments...`);
		instruments.forEach((instrument: SecurityInfo) => {
			const oldPrice = instrument.price;
			const newPrice = Math.random() * (101 - 99) + 99;
			instrument.price = newPrice;

			if (newPrice > oldPrice) {
				instrument.yield = instrument.yield - (Math.random() * (0.5 - 0.1) + 0.1);
			} else if (newPrice < oldPrice) {
				instrument.yield = instrument.yield + (Math.random() * (0.5 - 0.1) + 0.1);
			}

			solaceClient.publishDirectMessage(
				`bofa/rates/v1/${type.toLowerCase()}/${instrument.cusip}`,
				JSON.stringify(instrument)
			);
		});
	};

	const populateSecurityInfoForSimulator = (jsonArray: SecurityInfo[]) => {
		jsonArray.forEach((item) => {
			const { cusip, securityType, securityTerm } = item;
			const price = Math.random() * (101 - 99) + 99;
			const yld = Math.random() * (5 - 3) + 3;
			switch (securityType) {
				case 'Bill':
					billInstruments.push({ cusip, securityType, securityTerm, price, yield: yld });
					break;
				case 'Note':
					noteInstruments.push({ cusip, securityType, securityTerm, price, yield: yld });
					break;
				case 'Bond':
					bondInstruments.push({ cusip, securityType, securityTerm, price, yield: yld });
					break;
			}
		});
	};

	const getUniqueSecurityTypes = (jsonArray: SecurityInfo[]): string[] => {
		const securityTypesSet = new Set<string>();
		jsonArray.forEach((item) => {
			securityTypesSet.add(item.securityType);
		});
		return Array.from(securityTypesSet);
	};

	const startSimulator = () => {
		configDisabled = true;
		billInterval = setInterval(
			() => updateInstruments('bill', billInstruments),
			billSimulatorConfig.publishInterval * 1000
		);
		noteInterval = setInterval(
			() => updateInstruments('note', noteInstruments),
			noteSimulatorConfig.publishInterval * 1000
		);
		bondInterval = setInterval(
			() => updateInstruments('bond', bondInstruments),
			bondSimulatorConfig.publishInterval * 1000
		);
	};

	onMount(async () => {
		const response = await fetch('treasury.json');
		const json = await response.json();
		populateSecurityInfoForSimulator(json);
	});

	const stopSimulator = () => {
		clearInterval(billInterval);
		clearInterval(noteInterval);
		clearInterval(bondInterval);
		configDisabled = false;
	};

	onDestroy(() => {
		startSimulator();
	});
</script>

<section>
	<div class="p-4 bg-gray-100 rounded-lg">
		<p class="text-lg font-bold text-grey-300">
			Publish Topic: bofa/rates/v1/&lcub;instrumentType&rcub;/&lcub;cusip&rcub;
		</p>
	</div>
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
								security type
							</th>
							<th
								class="px-3 py-1 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 border-b border-gray-200 bg-gray-50"
							>
								publish interval
							</th>
							<th
								class="px-3 py-1 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 border-b border-gray-200 bg-gray-50"
							>
								enabled
							</th>
						</tr>
					</thead>
					<tbody class="bg-white">
						<tr>
							<td class="px-3 py-1 whitespace-no-wrap border-b border-gray-200 text-xs"> Bills </td>
							<td class="px-3 py-1 whitespace-no-wrap border-b border-gray-200 text-xs">
								<input
									type="text"
									disabled={configDisabled}
									bind:value={billSimulatorConfig.publishInterval}
									class="block w-8 p-1 text-gray-900 border border-gray-300 rounded-sm bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
								/>
							</td>
							<td class="px-3 py-1 whitespace-no-wrap border-b border-gray-200 text-xs">
								<input
									disabled={configDisabled}
									type="checkbox"
									bind:checked={billSimulatorConfig.enabled}
								/>
							</td>
						</tr>
						<tr>
							<td class="px-3 py-1 whitespace-no-wrap border-b border-gray-200 text-xs"> Notes </td>
							<td class="px-3 py-1 whitespace-no-wrap border-b border-gray-200 text-xs">
								<input
									type="text"
									disabled={configDisabled}
									bind:value={noteSimulatorConfig.publishInterval}
									class="block w-8 p-1 text-gray-900 border border-gray-300 rounded-sm bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
								/>
							</td>
							<td class="px-3 py-1 whitespace-no-wrap border-b border-gray-200 text-xs">
								<input
									disabled={configDisabled}
									type="checkbox"
									bind:checked={noteSimulatorConfig.enabled}
								/>
							</td>
						</tr>
						<tr>
							<td class="px-3 py-1 whitespace-no-wrap border-b border-gray-200 text-xs"> Bonds </td>
							<td class="px-3 py-1 whitespace-no-wrap border-b border-gray-200 text-xs">
								<input
									type="text"
									disabled={configDisabled}
									bind:value={bondSimulatorConfig.publishInterval}
									class="block w-8 p-1 text-gray-900 border border-gray-300 rounded-sm bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-500 dark:focus:border-blue-500"
								/>
							</td>
							<td class="px-3 py-1 whitespace-no-wrap border-b border-gray-200 text-xs">
								<input
									disabled={configDisabled}
									type="checkbox"
									bind:checked={bondSimulatorConfig.enabled}
								/>
							</td>
						</tr>
					</tbody>
				</table>
				<div class="flex justify-center mt-4">
					<button
						disabled={configDisabled}
						class="w-1/2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-l focus:outline-none focus:ring-2 focus:ring-green-500"
						on:click={startSimulator}
					>
						START
					</button>
					<button
						disabled={!configDisabled}
						class="w-1/2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-r focus:outline-none focus:ring-2 focus:ring-red-500"
						on:click={stopSimulator}
					>
						STOP
					</button>
				</div>
			</div>
		</div>
	</div>
</section>
