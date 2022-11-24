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
        <p>Ontology visual schema:</p> 
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
