<script>
  import Logo from './assets/logo.webp'
  import Map from './components/Map.svelte'
	import { fade } from 'svelte/transition'
  import { tours, selectedTour, tourStepsPromise, tourArtworksPromise, tourMetricsPromise } from './utils.js'

  $: {
    console.log($tourMetricsPromise)
  }
</script>

<a href="https://github.com/padovagrandtour/padovagrandtour" target="_blank" rel="noreferrer" class="github-corner" aria-label="PadovaGrandTour github repository"><svg width="60" height="60" viewBox="0 0 250 250" style="fill:var(--color); color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a>
<svelte:head>
  <style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>
</svelte:head>



  {#if !$tours}
  <div class="loadingContainer">
    <div class="loading">
      <span class="loader"></span>
      <p>Connecting....</p> 
      <p>To start, run <span class="code">docker compose up --force-recreate</span></p>
    </div>
  </div>  

  {:else}
  <nav>
    <img src="/icon.png" alt="Padova Grand Tour icon" style="height: 30px; position: relative; top: -2px;"> <h1>Padova Grand Tour</h1>
    <div class="toolbar">
      <select bind:value={$selectedTour} >
        <option value="NOTOUR">-- Choose a tour --</option>		
        {#each $tours as tour}
          <option value={tour[0]}>{tour[1]}</option>
        {/each}
      </select>
    </div>
  </nav>
  <aside>

    {#if $selectedTour != 'NOTOUR'}
      {#await $tourStepsPromise}
        <p style="color: #fff"></p>
      {:then tourSteps} 
      <div class="siteList" in:fade>
        {#each tourSteps as step, idx}
          <p on:click={ () => window.open(step[4], '_blank').focus()}><b>{idx + 1}.</b> {step[1]}</p>
        {/each}
      </div>
      {/await}
    {/if}

  </aside>
  <main transition:fade>  
    <div class="content" transition:fade>
      {#if $selectedTour === 'NOTOUR'}
      <img class="logo" alt="Padova Grand Tour logo" src={Logo}>
      <p style="text-align:center; color: #666; font-size:1.5rem;">Click "Choose a tour" to start!</p>
      {:else}
        <h1>Tour overview</h1>
        <p><b>URL:</b> <a href={$selectedTour} target="_blank" rel="noreferrer">{$selectedTour}</a></p>
        {#await $tourMetricsPromise}
          <p>Loading metrics...</p>
        {:then tourMetrics} 
        <p><b>Total travelled distance:</b> {tourMetrics[0][0]}m</p>
        <p><b>Average year of artworks:</b> {tourMetrics[1][1]} years</p>
        {/await}
        <Map></Map>
        {#await $tourArtworksPromise}
          <p>Loading artworks...</p>
        {:then tourArtworks} 
          <p style="margin-top: 70px; font-weight: bold;">Some artworks you are going to see:</p> 
          <div class="artworksGrid">
            {#each tourArtworks as artwork}
              <div class="artworkItem">
                <img alt={"Image for artwork " + artwork[1]} src={artwork[3]}>
                <p><a href={artwork[4]} target="_blank" rel="noreferrer">{artwork[1]}</a></p>
              </div>
            {/each}
          </div>           
        {/await}

      {/if}
    </div>
  </main>

  {/if}


<style>


.artworksGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;

}

.artworkItem img {
  max-width: 100%;
  padding: 1rem 1rem 0 1rem;
  box-sizing: border-box;
}



:global(html, body, #app){
  margin:0;
  padding:0;
  font-family: Arial, Helvetica, sans-serif;
  height: 100%;
}

:global(#app){
  display: grid;
  grid-template: 
      "nav   nav" auto
      "aside main" 1fr / 300px 1fr;
}

nav {
  grid-area: nav;
  color: #fff;
  background-color: #000;
  display: flex;
  padding: 1rem;
  align-items: center;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  user-select: none;

}

nav h1 {
  margin: 0;
}

nav select {
  height: 30px;
  margin-left: 40px;
  color-scheme: dark;
  padding-left: 10px;
  padding-right: 10px;
  background-color: #000;
  font-size: large;
}


aside {
  grid-area: aside;
  background-color: #9b0014;
  height: 100%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 20px 2vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
}


aside .siteList {
  background-color: #fff;
  overflow-y: auto;
  margin: 20px 0;
  box-sizing: border-box;
  box-shadow: inset rgba(0, 0, 0, 0.24) 0px 3px 8px;

}

aside .siteList > p {
  cursor: pointer;
  padding: 8px;
  margin: 0;
}
aside .siteList > p:nth-child(even)  {
  background-color: #ddd;
}

aside .siteList > p:hover {
  background-color: #aaa;

}

main {
  grid-area: main;
  box-sizing: border-box;
  display: flex;
  height: 100%;
  overflow-y: auto;
}
main > .content {max-width: 500px; margin: 0 auto; padding: 30px; height: 100%;}

.logo {
  width: 60%;
  margin: 30px auto;
  display: block;
}

.loadingContainer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}


.loading {
  text-align: center;
  margin: 30vh auto;
}

span.code {
  display: inline-block;
  background-color: #ddd;
  border: solid 0.2px #ccc;
  font-family: monospace;
  padding: 2px;
  border-radius: 2px;
}

/* https://cssloaders.github.io/  */
.loader {
  width: 48px;
  height: 48px;
  display: block;
  margin:15px auto;
  position: relative;
  color: #9b0014;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
}
.loader::after,
.loader::before {
  content: '';  
  box-sizing: border-box;
  position: absolute;
  width: 24px;
  height: 24px;
  top: 50%;
  left: 50%;
  transform: scale(0.5) translate(0, 0);
  background-color: #9b0014;
  border-radius: 50%;
  animation: animloader 1s infinite ease-in-out;
}
.loader::before {
  background-color: #000;
  transform: scale(0.5) translate(-48px, -48px);
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
} 
@keyframes animloader {
    50% {
      transform: scale(1) translate(-50%, -50%);
}
}


</style>
