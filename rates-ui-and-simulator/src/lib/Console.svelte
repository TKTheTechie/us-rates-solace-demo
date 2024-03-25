<script lang="ts">
	import { type LOG_ENTRY, LOG_TYPE, log } from './lib';

	let logStatements: string[] = [];

	log.subscribe((logEntry: LOG_ENTRY) => {
		if (logEntry) {
			let color = 'black';
			switch (logEntry.type) {
				case LOG_TYPE.INFO:
					break;
				case LOG_TYPE.ERROR:
					color = 'red';
					break;
				case LOG_TYPE.WARN:
					color = 'orange';
					break;
			}
			let now = new Date();
			let logLine = `[${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]  <span style="color:${color}">${logEntry.message}</span> <br />`;
			logStatements.unshift(logLine);
			const existingLogs: string[] = logStatements;
			logStatements = [...existingLogs];
		}
	});
</script>

<footer class="absolute bottom-0 left-0 border-y w-full">
	<section>
		<fieldset class="console">
			<legend class="text-xs">console</legend>
			<div spellcheck="false" class="consoleDisplay text-xs" contenteditable="true">
				{#each logStatements as statement}
					{@html statement}
				{/each}
			</div>
		</fieldset>
	</section>
</footer>

<style>
	.console {
		height: 25vh;
		width: 100%;
		overflow-y: auto;
	}

	.consoleDisplay {
		white-space: pre-wrap;
		border: none;
		font-family: Monospace;
		font-size: xx-small;

		outline: none;
		-moz-outline-style: none;
		overflow-wrap: anywhere;
	}
</style>
