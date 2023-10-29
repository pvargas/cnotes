<script lang="ts">

	function summarizeNotes() {
		console.log('Summarize button clicked...');
	}

	let fromDateValue = 'From...'
	let toDateValue = 'To...'
</script>

<div class="notes_controls">
	<div class='col'>
		<div class='row'>
			<p>Summarize clinical notes</p>
			<input class='input_area' bind:value={fromDateValue} />
			<input class='input_area' bind:value={toDateValue} />
		</div>
		<button class='summarize_btn' on:click={summarizeNotes}>Summarize</button>
	</div>
</div>

<style>
	.notes_controls {
		margin: auto;
		padding-bottom: 3rem;
		border-bottom: 1px solid var(--text-secondary-color);
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
	}
	.summarize_btn {
		width: fit-content;
		padding: 0.75rem;
		border-radius: 10px;
		font-weight: bold;
		border: 1px solid var(--text-secondary-color);
		background-color: var(--header-bg-color);
		color: var(--text-primary-color);
	}
	.summarize_btn:hover {
		background-color: #2a2a2c;
		border-color: white;
		color: white;
	}
	.summarize_btn:focus {
		outline:none;
		border-color: white;
	}
	.input_area {
		border-radius: 10px;
		padding-left: 1rem;
		background-color: var(--content-bg-color);
		color: var(--text-secondary-color);
		border-color: var(--text-secondary-color);
	}
	.input_area:focus {
		outline:none;
		border-color: var(--text-primary-color);
	}
</style>
