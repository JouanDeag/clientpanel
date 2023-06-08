<script lang="ts">
	import { setAccordionOptions } from './context';

	// Props
	export let collapse = false;

	// The context API avoids passing data through components as props
	setAccordionOptions({ collapse });
</script>

<div class="accordion">
	<slot />
</div>
