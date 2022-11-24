<script>
    import { curiefy } from '../utils.js'
    export let text = ""
</script>

{#if text.startsWith('http')}
<a href={text}>{curiefy(text)}</a>
{:else}
{curiefy(text)}
{/if}