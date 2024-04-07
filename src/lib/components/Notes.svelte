<script lang="ts">
	import Controls from '$lib/components/Controls.svelte';
  import { Circle2 } from 'svelte-loading-spinners';
	let rawNotes = "";
  let summarizedNotes = "";
  let loading = false;
  let notesAvailable = false;
  let resultType = "";
  function setLoading(val: boolean) {
    loading = val;
  }
  async function getData(startDate: Date, endDate: Date, patientId = null) {
    setLoading(true);
    rawNotes= "";
    summarizedNotes = "";
    notesAvailable = false;
    let result = null;
    
    const response = await fetch(`/api/clinical?startDate=${startDate}&endDate=${endDate}&patientId=${patientId}`);
    if (response) {
      if (response.status === 200) {
        result = await response.json();
        if (result.result === "nothing") {          
          resultType = result.result;   
          console.debug("No results found");
        } else {
          rawNotes = result.result;
          notesAvailable = true;
          resultType = "";
        }
      } else {
        console.debug("Request resulted in an error.");
        resultType = "error";
      }
    }
    setLoading(false);
	}
  async function summarizeData() {	
    console.debug("summarizeData called")
    if (rawNotes) {
      setLoading(true);
      let result = null;
      let response = null;
      response = await fetch("api/summarize", {method: "POST", body: JSON.stringify({input: rawNotes})});
      if (response) {
        result = await response.json();
        summarizedNotes = result.result; 
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
    {:else if !(summarizedNotes || rawNotes) && resultType !== "nothing" && resultType !== "error"}
      <p class='center blue'>Click on the <span> <i> Get Clinical Notes <i/></span> button above to get started.</p>
    {:else}     
      {#if resultType === "nothing" }
      <p class='center blue'>No results found.<span> Use a different date range </span> and try again.</p>
      {/if}     
      {#if resultType === "error" }
      <p class='center blue'>Unable to retrieve clinical data.<span> Please wait a few seconds </span> before trying again.</p>
      {/if}      
      {#if rawNotes && !summarizedNotes}
        <p class='center_v blue'>Below is your clinical data. Click the <span> <i> Summarize <i/></span> button above to get a summary.</p>
      {/if}     
      {#if summarizedNotes }
        <p class='center_v blue'>This is your <span>summarized</span> data.</p>
      {/if}
      <p>{notesAvailable? summarizedNotes || rawNotes : ""}</p>
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
