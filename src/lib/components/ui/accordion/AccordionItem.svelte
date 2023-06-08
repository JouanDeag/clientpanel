<script lang="ts">
	// Imports
	import { ChevronDown } from 'lucide-svelte';
	import { slide } from 'svelte/transition';

	import { getAccordionOptions } from './context';

	// Assign a unique identifier for the component
	const componentId = crypto.randomUUID();
	const { collapse, activeComponentId } = getAccordionOptions();

	// Props
	export let title: string;
	export let open = false;
	export let canBeCloses = true;

	// State
	function setActive() {
		// Update the store value in the context
		$activeComponentId = componentId;
	}

	// Simple toggle function
	function toggleOpen() {
		open = !open;
	}

	// Handle the click event (decide which function to call)
	function handleClick() {
		// If `collapse` is passed only one item can be active
		collapse ? setActive() : toggleOpen();

		// If collapse was set, make sure that item can also be closed
		if (collapse && isActive && canBeCloses) {
			$activeComponentId = null;
		}
	}

	// The accordion item to be open by default
	$: open && collapse && setActive();

	// Compare if the active id matches the component id
	$: isActive = $activeComponentId === componentId;

	// If `collapse`, set one item as active, otherwise use `open`
	$: isOpen = collapse ? isActive : open;
</script>

<div class="accordion-item" class:open={isOpen}>
	<button on:click={handleClick} aria-expanded={isOpen} aria-controls="accordion-{componentId}">
		{title}
		<div class="icon">
			<ChevronDown size="16" />
		</div>
	</button>
	{#if isOpen}
		<div
			transition:slide|local
			class="accordion-item__body"
			aria-label="dropdown-content"
			aria-hidden={!isOpen}
			aria-labelledby="accordion-{componentId}"
		>
			<slot />
		</div>
	{/if}
</div>

<style lang="scss">
	.accordion-item {
		width: 100%;
		padding: 0.5rem 1rem;

		border-bottom: 1px solid hsl(210, 10%, 90%);

		> * {
			width: 100%;
		}
	}

	.icon {
		transition: rotate 0.2s ease-in-out;
		transform-origin: center;
		display: inline-flex;
	}

	.open .icon {
		rotate: 180deg;
	}

	button {
		// Reset Button
		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		border: none;
		font: inherit;
		background: transparent;
		color: inherit;
		cursor: pointer;
		text-align: left;

		font-weight: 500;

		// Styling
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
