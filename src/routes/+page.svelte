<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Notes from '$lib/components/Notes.svelte';
	import Footer from '$lib/components/Footer.svelte';

</script>

<main id='main'>
  <Header/>
  <div id='content'>
    <Notes/>
  </div>
  <Footer/>
</main>

<style>
  :global(html) {
    --text-primary-color: #E6EdF3;
    --text-secondary-color: #7D8590;
		--content-bg-color: #11151a;
    --header-bg-color: #161B22;
    --container-padding: 3rem;
    --header-height: 3.5rem;
    --footer-height: 4rem;
    --primary-color: #FF3E00;
    --secondary-color: #40B3FF;
    --tertiary-color: #676778;
  }
	:global(body) {
		background-color: var(--content-bg-color);
    color: var(--text-primary-color);
		height: 100vh;
		width: 100vw;
		padding: 0;
		margin: 0;
		font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode',
			Geneva, Verdana, sans-serif;
	}
	#main {
		margin: 0;
    padding: 0;
    height: 100%;
    max-height: 100vh;
	}
	#content {
    margin: calc(var(--header-height) + var(--container-padding)) auto auto auto;
    padding-bottom: calc(var(--footer-height) + var(--container-padding) + 3rem);
    width: 80%;
    overflow: scroll;
	}
</style>