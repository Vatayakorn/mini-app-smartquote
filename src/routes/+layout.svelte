<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { initTelegramApp } from '$lib/telegram';

	onMount(() => {
		initTelegramApp();
	});
</script>

<slot />
