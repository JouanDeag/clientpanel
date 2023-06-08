<script lang="ts">
	// Imports
	import { Loader2 } from 'lucide-svelte';

	// Props
	export let type: 'button' | 'submit' | 'reset' = 'button';
	export let disabled: boolean = false;
	export let hasLoader: boolean = true;
	export let submitMessage = 'Processing...';
	export let className = '';

	// State
	export let loading = false;
	export let clicked = false;

	// Variance
	export let variant = 'primary' as import('./index').buttonVariants;
	export let size = 'md' as import('./index').buttonSizes;

	// Computed
	$: loading = (loading || clicked) && hasLoader;
	$: ariaDisabled = disabled || loading;
	$: ariaBusy = loading;

	// Computed Classes
	let classes = [`button--${variant}`, className].join(' ');
</script>

<button
	{type}
	disabled={ariaDisabled}
	aria-disabled={ariaDisabled}
	aria-busy={ariaBusy}
	on:click={() => {
		clicked = true;
	}}
	class={classes}
	class:button--small={size === 'sm'}
	class:button--large={size === 'lg'}
>
	{#if loading}
		<svelte:component this={Loader2} class="loading-spinner" />
		{submitMessage}
	{:else}
		<slot />
	{/if}
</button>

<style lang="scss">
	// Variants
	.button--primary {
		--bg-color: 222, 47%, 11%;
	}

	.button--secondary {
		--bg-color: 210, 40%, 96%;
		--text-color: hsl(222, 47%, 20%);
	}

	.button--outline {
		--bg-color: 0;
		--text-color: hsl(222, 47%, 20%);
		border: 1.5px solid #ddd;

		&:hover {
			background-color: hsl(210, 40%, 96%);
		}
	}

	.button--ghost {
		--bg-color: 0;
		--text-color: hsl(222, 47%, 20%);

		&:hover {
			background-color: hsl(210, 40%, 96%);
		}
	}

	.button--danger {
		--bg-color: 0, 92%, 40%;
	}

	.button--success {
		--bg-color: 120, 40%, 30%;

		&:hover {
			background-color: hsl(120, 40%, 40%);
		}
	}

	// Sizes
	.button--small {
		font-size: 0.75rem;
		padding: 0.25rem 0.5rem;
	}

	.button--large {
		font-size: 1.25rem;
		padding: 0.75rem 1.5rem;
	}

	// Base
	button {
		--text-color: hsl(100, 100%, 100%);

		appearance: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		border: none;
		font: inherit;
		background: transparent;
		color: inherit;
		cursor: pointer;

		font-weight: 500;

		padding: 0.5rem 1rem;
		border-radius: $base-border-radius;
		border: 1px solid transparent;

		color: var(--text-color);
		background-color: hsl(var(--bg-color));

		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;

		&:hover {
			background-color: hsl(var(--bg-color), 75%);
		}

		&[aria-disabled='true'] {
			opacity: 0.5;
			pointer-events: auto;
			cursor: not-allowed;
		}

		transition: $base-transition;
	}
</style>
