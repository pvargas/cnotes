<script lang="ts">
	import Controls from '$lib/components/Controls.svelte';
	let unprocessedText = "";
  async function getData() {
		const response = await fetch('https://baconipsum.com/api/?type=all-filler&sentences=100&start-with-lorem=1');
		const jsonResponse = await response.json();
    unprocessedText = jsonResponse[0]
    console.log("unprocessedText:", unprocessedText)
	}
</script>

<div id='notes'>
  <Controls getData={getData}/>
  <div class='notes_text'>
   {unprocessedText}
  </div>
  
</div>

<style>

	#notes {
		margin: auto;
		padding: auto;
	}

	.notes_text {
    margin: var(--container-padding);
    padding-top: 1rem;
  }

</style>
