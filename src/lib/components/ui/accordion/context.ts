import { writable } from 'svelte/store';
import { setContext, getContext } from 'svelte';
import type { AccordionOptions, ActiveId, ActiveIdContext, CollapseContext } from './types';

export function setAccordionOptions({ collapse }: AccordionOptions) {
	// Create a store for the collapse context (if the accordion can only have one active component)
	const activeComponentId = writable<ActiveId>(null);

	// Set the collapse context (if the accordion can only have one active component)
	setContext<CollapseContext>('collapse', collapse);

	// Set the active component id
	setContext<ActiveIdContext>('active', activeComponentId);
}

export function getAccordionOptions() {
	// Get the collapse context (if the accordion can only have one active component)
	const collapse = getContext<CollapseContext>('collapse');

	// Get the active component id
	const activeComponentId = getContext<ActiveIdContext>('active');

	// Return the collapse context and the active component id
	return { collapse, activeComponentId };
}
