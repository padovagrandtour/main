<script>
  import Logo from './assets/logo.webp'


  const sparqlPrefixes = `
  PREFIX owl: <http://www.w3.org/2002/07/owl#> 
  PREFIX pgt: <https://padovagrandtour.github.io/entitites#> 
  PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
  PREFIX xml: <http://www.w3.org/XML/1998/namespace> 
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> 
  PREFIX sdo: <https://schema.org/>
  PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 

  `


  /** Utility function to make simpler to query with comunica. */
  const query = (queryStr, labels) => new Promise( (resolve, reject) => {
    const results = []
    new window.Comunica.QueryEngine().queryBindings(sparqlPrefixes + queryStr, {
      sources: [{type:'sparql', value:'http://localhost:7210/repositories/pgt'}],
    }).then(function (bindingsStream) {
      bindingsStream.on('data', function (data) {
        
        results.push( labels.map( label => data.get(label) ? data.get(label).value : null))
      });
      bindingsStream.on('end', function () {
        resolve(results)
      })
      bindingsStream.on('error', (error) => {
          reject(error)
      });
    }).catch( (...e) => reject(...e));
  })

  /* Repeatedly try to query the database until you get the tour list */
  let tours = null
  const refreshTours = async() => {
    try {
      // Query tours
      tours = await query(`
          SELECT * {
            ?tourID a pgt:Tour .
            ?tourID sdo:name ?tourName .
          } LIMIT 1000
        `, ['tourID', 'tourName'])
    }catch(e){
      console.log("Failure connection", e)
      await new Promise(resolve => setTimeout(resolve, 1000))
      refreshTours()
    }
  }

  refreshTours()



  let selectedTour = "NOTOUR"

  let tourStepsPromise = Promise.resolve([])

  $:{

    if(selectedTour !== 'NOTOUR'){
      tourStepsPromise = query(`
        SELECT ?stepIndexNumber ?siteName ?siteLat ?siteLong WHERE {
          ?tour a pgt:Tour.
          ?tour sdo:name "Tour 1".
          ?tour pgt:steps ?stepNode .
          ?stepNode ?stepIndex ?site .

          BIND (STRLEN("http://www.w3.org/1999/02/22-rdf-syntax-ns#_") AS ?prefixLength)
          BIND (xsd:integer(SUBSTR(xsd:string(?stepIndex),?prefixLength + 1)) AS ?stepIndexNumber).

          OPTIONAL{ ?site sdo:name ?siteName. }
          OPTIONAL{ ?site geo:lat  ?siteLat.  }
          OPTIONAL{ ?site geo:long ?siteLong. }


        } ORDER BY ?stepIndexNumber`, ['stepIndexNumber', 'siteName', 'siteLat', 'siteLong'])
        
    }
  }


  let l = ['s', 'p', 'o']
  let r = query(`
      SELECT * {
        ?s ?p ?o
      } LIMIT 100
    `, l)

</script>

  {#if !tours}
  <div class="loading">
    <span class="loader"></span>
    <p>connecting....</p> 
  </div>

  {:else}
  <aside>
    <div class="toolbar">
      <select bind:value={selectedTour} >
        <option value="NOTOUR">-- Choose a tour --</option>		
        {#each tours as tour}
          <option value={tour[0]}>{tour[1]}</option>
        {/each}
      </select>
    </div>
    
    <div>
      {#await tourStepsPromise}
        <p>Loading sites...</p>
      {:then tourSteps} 
        {#each tourSteps as step}
          <p>{step[1]}</p>
        {/each}
      {/await}
    </div>

  </aside>
  <main>  
    <div class="content">
      {#if selectedTour === 'NOTOUR'}
      <img class="logo" alt="Padova Grand Tour logo" src={Logo}>
      {:else}
        <p>{selectedTour}</p>
      {/if}
    </div>
  </main>

  {/if}


<style>



:global(html, body, #app){
  margin:0;
  padding:0;
  font-family: Arial, Helvetica, sans-serif;
}

:global(#app){
  display: flex;
  flex-direction: row;
}


aside {
  background-color: #9b0014;
  width: 300px;
  flex: 0 0 auto;
  height: 100vh;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 20px 2vw;
  box-sizing: border-box;
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
