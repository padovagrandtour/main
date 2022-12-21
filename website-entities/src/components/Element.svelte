<script>
    import { curiefy } from '../utils.js'

    const imgExtensions = ['JPG', 'JPEG', 'jpg', 'jpeg', 'webp', 'PNG', 'png']

    const isImage = (url) => imgExtensions.some( ext => 
        url.trim().endsWith(ext) || url.trim().endsWith(ext + '"^^<sdo:URL>'))

    export let text = ""

    $: refinedText = text.startsWith('"')
        ? text.includes('"^^')
            ? text.substring(1, text.lastIndexOf('"^^'))
            : text.substring(1, text.lastIndexOf('"'))
        : text

</script>

{#if refinedText.startsWith('http')}
    {#if isImage(refinedText)}
    <a href={refinedText}><img alt={"Image for " + curiefy(refinedText)} src={refinedText} style="max-width: 80%"> {curiefy(refinedText)}</a>
    {:else}
    <a href={refinedText}>{curiefy(refinedText)}</a>
    {/if}
{:else if text.includes('"^^<http://www.w3.org/1999/02/22-rdf-syntax-ns#HTML>')}
{@html refinedText}
{:else}
{curiefy(refinedText)}
{/if}