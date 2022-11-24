<script>
  import Logo from './assets/logo.webp'
  import Map from './components/Map.svelte'

  import { tours, selectedTour, tourStepsPromise } from './utils.js'


</script>

  {#if !$tours}
  <div class="loading">
    <span class="loader"></span>
    <p>connecting....</p> 
  </div>

  {:else}
  <aside>
    <div class="toolbar">
      <select bind:value={$selectedTour} >
        <option value="NOTOUR">-- Choose a tour --</option>		
        {#each $tours as tour}
          <option value={tour[0]}>{tour[1]}</option>
        {/each}
      </select>
    </div>
    
    <div class="siteList">
      {#await $tourStepsPromise}
        <p>Loading sites...</p>
      {:then tourSteps} 
        {#each tourSteps as step, idx}
          <p><b>{idx + 1}.</b> {step[1]}</p>
        {/each}
      {/await}
    </div>

  </aside>
  <main>  
    <div class="content">
      {#if $selectedTour === 'NOTOUR'}
      <img class="logo" alt="Padova Grand Tour logo" src={Logo}>
      {:else}
        <p>{$selectedTour}</p>

        <Map></Map>
      {/if}
    </div>
  </main>

  {/if}


<style>



:global(html, body, #app){
  margin:0;
  padding:0;
  font-family: Arial, Helvetica, sans-serif;
  height: 100%;
}

:global(#app){
  display: flex;
  flex-direction: row;
}


aside {
  background-color: #9b0014;
  width: 300px;
  flex: 0 0 auto;
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
}

aside .siteList > p {
  padding: 8px;
  margin: 0;
}
aside .siteList > p:nth-child(even)  {
  background-color: #ddd;
}

main {flex: 1 1 auto;}
main > .content {max-width: 500px; margin: 0 auto; padding: 30px;}

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
