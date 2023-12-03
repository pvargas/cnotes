<script lang="ts">
	import menuIcon from '$lib/icons/bars.svg';
</script>

<div id='header'>
	<h1><span>C</span>Notes</h1>
	<img
			src={menuIcon}
			alt={'menu'}
			class="menu_button"
		/>
</div>

<style>
	#header {
		position: fixed;
		top: 0;
		padding: 0 8%;
		margin: 0;
		width: calc(100vw - 16%);
		min-height: var(--header-height);
		max-height: var(--header-height);
		background-color: var(--header-bg-color);
		display: flex;
		flex-direction: row;
		z-index: 100;
	}
	#header > h1 {
		margin-top: auto;
		margin-bottom: auto;
		font-size: 2rem;
	}
	h1 > span {
		color: var(--primary-color);
	}
	.menu_button {
		margin-left: auto;
		margin-top: auto;
		margin-bottom: auto;
		height: 1.5rem;
		color: var(--primary-color);
	}
</style>
