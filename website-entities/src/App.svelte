<script>
  import Logo from './assets/logo.webp'
  import OntologyVisual from './assets/ontologyVisual.webp'
  import Element from './components/Element.svelte'

  import { entity, properties, curiefy } from './utils.js'

  const baseURL = 'https://padovagrandtour.github.io/entities#'
  $:{
    console.log($properties)
  }

</script>

  <a href="https://github.com/padovagrandtour/padovagrandtour" target="_blank" rel="noreferrer" class="github-corner" aria-label="PadovaGrandTour github repository"><svg width="80" height="80" viewBox="0 0 250 250" style="fill:var(--color); color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a>
  <svelte:head>
    <style>.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}</style>
  </svelte:head>

  {#if !$properties && entity}
  <div class="loading">
    <span class="loader"></span>
    <p>Connecting....</p> 
    <p>To start, run <span class="code">docker compose up --force-recreate</span></p>
  </div>

  {:else}
  <main>  
    <div class="content">
      <a href={baseURL}>
        <img class="logo" alt="Padova Grand Tour logo" src={Logo}>      
      </a>
      {#if entity}
      <h1><a href={baseURL + entity}>pgt:{entity}</a></h1>
      <p><a href={baseURL + entity}>{baseURL + entity}</a></p>

        {#if $properties.length == 0}
        <p>No triples found for this entity :(</p>
        <p>Did you spell it right?</p>
        {:else}
          <table>
            <tr>
              <th class="tsmall">s</th>
              <th class="tsmall">p</th>
              <th>o</th>
            </tr>
            {#each $properties as [p, o]}
              <tr>
                <td class="tsmall"><Element text={baseURL + entity}/></td>
                <td class="tsmall"><Element text={p}/></td>
                <td><Element text={o}/></td>
              </tr>
            {/each}
          </table>


        {/if}
      {:else}
        <h1>Padova Grand Tour Ontology</h1>
        <p>A collection of artworks, tours and cultural sites regarding the italian city of Padova.</p>

        <p><b>Sparql endpoint:</b><a href="http://localhost:7210/sparql">http://localhost:7210/sparql</a></p> 

        <p><b>Tour website:</b> <a href="https://padovagrandtour.github.io">https://padovagrandtour.github.io</a></p> 

        <p><b>Some entities:</b> <a href="https://padovagrandtour.github.io/entities#SITE0">Cappella degli Scrovegni</a>,
          <a href="https://padovagrandtour.github.io/entities#CSCategoryMuseum">Museum category</a>,
          <a href="https://padovagrandtour.github.io/entities#ARTWORKsq991">Old plate</a>
        </p>



        <img class="visual" alt="Padova Grand Tour Visual Ontology Schema" src={OntologyVisual}>
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



main {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
}
main > .content {max-width: 700px; margin: 0 auto; padding: 30px; }

.logo {
  width: 40%;
  margin: 30px auto;
  display: block;
}

.visual {
  width: 100%;
  margin: 30px auto;
  display: block;
}


.loading {
  text-align: center;
  margin: 30vh auto 0 auto;
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


table {
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
}

table td {
  vertical-align: top;
  padding-top: 10px;
}


table td {
  border-bottom: 1px solid #ddd;
  padding: 8px;

}

table tr:nth-child(odd){background-color: #f2f2f2;}


table th {
  padding: 12px 8px;

  text-align: left;
  background-color: #9b0014;
  color: white;
}

.tsmall {
  width: 140px;
}

</style>
