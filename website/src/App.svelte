<script>
  import Logo from './assets/logo.webp'
  import Map from './components/Map.svelte'

  import { tours, selectedTour, tourStepsPromise, tourArtworksPromise } from './utils.js'

  $: {
    console.log($tourArtworksPromise)
  }
</script>

  {#if !$tours}
  <div class="loading">
    <span class="loader"></span>
    <p>connecting....</p> 
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
    <div class="siteList">
      {#await $tourStepsPromise}
        <p>Loading sites...</p>
      {:then tourSteps} 
        {#each tourSteps as step, idx}
          <p on:click={ () => window.open(step[4], '_blank').focus()}><b>{idx + 1}.</b> {step[1]}</p>
        {/each}
      {/await}
    </div>
    {/if}

  </aside>
  <main>  
    <div class="content">
      {#if $selectedTour === 'NOTOUR'}
      <img class="logo" alt="Padova Grand Tour logo" src={Logo}>
      <p style="text-align:center; color: #666; font-size:1.5rem;">Click "Choose a tour" to start!</p>
      {:else}
        <h1>Tour overview</h1>
        <p><b>URL:</b> <a href={$selectedTour} target="_blank" rel="noreferrer">{$selectedTour}</a></p>

        <Map></Map>
        {#await $tourArtworksPromise}
          <p>Loading artworks...</p>
        {:then tourArtworks} 
          <p style="margin-top: 70px; font-weight: bold;">Some artworks you are going to see:</p> 
          <div class="artworksGrid">
            {#each tourArtworks as artwork}
              <div class="artworkItem">
                <img alt={"Image for artwork " + artwork[1]} src={artwork[3]}>
                <p>{artwork[1]}</p>
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


.loading {
  text-align: center;
  margin: 30vh auto;
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
