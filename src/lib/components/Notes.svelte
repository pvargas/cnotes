<script lang="ts">
	import Controls from '$lib/components/Controls.svelte';
  import { Circle2 } from 'svelte-loading-spinners';
	let rawNotes = "";
  let summarizedNotes = "";
  let loading = false;
  let notesAvailable = false;
  function setLoading(val: boolean) {
    loading = val;
  }
  async function getData(startDate: Date, endDate: Date, patientId = null) {
    console.log("get data called")
    console.log("startDate", startDate)
    console.log("endDate", endDate)
    setLoading(true);
    notesAvailable = false;
    let result = null;
    
    const response = await fetch(`/api/clinical?startDate=${startDate}&startDate=${startDate}&patientId=${patientId}`);
    if (response) {
      result = await response.json();
      rawNotes = result.result;
      console.log(rawNotes);
      notesAvailable = true;
    }
    setLoading(false);
	}
  async function summarizeData() {	
    console.log("summarizeData called")
    if (rawNotes) {
      setLoading(true);
      let result = null;
      let response = null;
      response = await fetch("api/summarize", {method: "POST", body: JSON.stringify({input: rawNotes})});
      if (response) {
        result = await response.json();
        summarizedNotes = result.result; 
        console.log(result);
      }
    } else {
      console.error("No notes to summarize.")
    }
    setLoading(false);
	}
</script>

<div id='notes'>
  <div class='col'>
    <h3 class='center_v'>Summarize Clinical Notes</h3>
  </div>
  <Controls getData={getData} summarizeData={summarizeData} notesAvailable={notesAvailable} loading={loading}/>
  <div class='notes_text'>
    {#if loading}
    <div  class='center'>
      <Circle2 size="100" />
    </div>
    {:else if !(summarizedNotes || rawNotes)}
      <p class='center blue'>Click on the <span> <i> Get Clinical Notes <i/></span> button above to get started.</p>
    {:else}       
      {#if rawNotes && !summarizedNotes}
        <p class='center_v blue'>Below is your clinical data. Click on the <span> <i> Summarize <i/></span> button above to get a summary.</p>
      {/if}     
      {#if summarizedNotes }
        <p class='center_v blue'>This is your summarized data.</p>
      {/if}
      <p>{notesAvailable? summarizedNotes || rawNotes : null}</p>
    {/if}
  </div>
  
</div>

<style>
	.col {
		display: flex;
		flex-direction: column;
		padding-bottom: 2rem;
	}

	#notes {
		margin: auto;
		padding: auto;
	}

	.center_v {
		display: flex;  
    justify-content: center; 
    align-items: center;
	}
  .center {
		display: flex;  
    justify-content: center; 
    align-items: center;
		margin-top: 15vh;
  }

	.notes_text {
    margin: var(--container-padding);
    /* padding-top: 1rem; */
  }

  .blue {
		color: var(--secondary-color);
  }

	p > span {
		color: var(--primary-color);
    margin: 0 0.5rem;
	}
  p {white-space: pre-line}
</style>
