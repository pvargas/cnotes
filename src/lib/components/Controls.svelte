<script lang="ts">
	import { DateInput } from 'date-picker-svelte'
	let startDate: Date | null = null
	let endDate: Date | null = null
	export let getData: svelte.JSX.MouseEventHandler<HTMLButtonElement> | null = null;
	export let summarizeData: svelte.JSX.MouseEventHandler<HTMLButtonElement> | null = null;		
	export let notesAvailable = false;
	export let loading = false;
	const format = "yyyy-MM-dd"
	function dateToFormattedString(date: Date): string {
		const month = date.getMonth() + 1;
		const formatted =  date.getFullYear() + "-" + month.toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0');
		return formatted;
	}
	function fetchNotes() {
		let startDateString = "";
		let endDateString = "";
		if (!startDate) {
			startDate = new Date();
			startDate.setFullYear(startDate.getFullYear() - 1);
		}
		if (!endDate) {
			endDate = new Date();
		}
		
		startDateString = dateToFormattedString(startDate);
		endDateString = dateToFormattedString(endDate);

		getData(startDateString, endDateString);
	}
	function summarizeNotes() {
		summarizeData();
	}
</script>

<div class="notes_controls">
	<div class='col'>
		<div class='row center_v'>
			<div class='row center_v'>
				<p>From</p>
				<DateInput format={format} placeholder={"one year ago"} bind:value={startDate} />
			</div>
			<div class='row center_v'>
				<p>to</p>
				<DateInput format={format} placeholder="today" bind:value={endDate} />
			</div>
			<button class='summarize_btn' on:click={fetchNotes} disabled={loading}>Get Clinical Notes</button>
			<button class='summarize_btn' on:click={summarizeNotes} disabled={!notesAvailable || loading}>Summarize</button></div>
		</div>
		<div class='row'>
	</div>
</div>

<style>
	:root {
		--date-picker-background: #1b1e27;
		--date-picker-foreground: #f7f7f7;
		--date-input-height: 30rem;
	}
	.center_v {
		margin: auto;
		padding: auto;
	}
	.notes_controls {
		margin: auto;
		padding-bottom: 3rem;
		border-bottom: 1px solid var(--tertiary-color);
	}
	.col {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}
	.row {
		display: flex;
		flex-direction: row;
		gap: 3rem;
		align-items: center;
  	justify-content: center;
	}
	.summarize_btn {
		width: fit-content;
		padding: 0.5rem;
		border-radius: 5px;
		font-size: 1rem;
		border: 1px solid var(--text-secondary-color);
		background-color: var(--header-bg-color);
		color: var(--text-primary-color);
	}
	.summarize_btn:hover {
		background-color: var(--header-bg-color);
		border-color: white;
		color: var(--primary-color);
	}
	.summarize_btn:active {
		background-color: var(--secondary-color);
		color: var(--text-primary-color);
	}
	.summarize_btn:disabled {
		border-color: gray;
		color: gray;
	}
	.summarize_btn:disabled:hover {
		background-color: none;
		border-color: gray;
		color: gray;
	}
	.summarize_btn:focus {
		outline:none;
		border-color: white;
	}
</style>
