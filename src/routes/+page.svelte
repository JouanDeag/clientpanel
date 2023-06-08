<script lang="ts">
	import { Button } from '$components/ui/button';
	import { Accordion, AccordionItem } from '$components/ui/accordion';
	import { Mail } from 'lucide-svelte';
</script>

<main>
	<Button variant="secondary">
		<Mail size="18" />
		Login with Email
	</Button>
	<Accordion collapse>
		<AccordionItem title="Drawer 1">lol</AccordionItem>
		<AccordionItem title="Drawer 2">kek</AccordionItem>
		<AccordionItem title="Drawer 3">xd</AccordionItem>
	</Accordion>
</main>

<style lang="scss">
	main {
		margin: 2rem;
	}
</style>
