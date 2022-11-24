<script>
    import { curiefy } from '../utils.js'

    const imgExtensions = ['JPG', 'JPEG', 'jpg', 'jpeg', 'webp', 'PNG', 'png']

    const isImage = (url) => imgExtensions.some( ext => url.trim().endsWith(ext))

    export let text = ""
</script>

{#if text.startsWith('http')}
    {#if isImage(text)}
    <a href={text}><img alt={"Image for " + curiefy(text)} src={text} style="max-width: 80%"> {curiefy(text)}</a>
    {:else}
    <a href={text}>{curiefy(text)}</a>
    {/if}
{:else}
{curiefy(text)}
{/if}