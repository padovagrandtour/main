import { writable, get } from "svelte/store";


/**
 * QUERY ENGINE
 * 
 */


const sparqlPrefixes = `
PREFIX owl: <http://www.w3.org/2002/07/owl#> 
PREFIX pgt: <https://padovagrandtour.github.io/entities#> 
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




/**
 * APP STORE
 * 
 */



  /* Repeatedly try to query the database until you get the tour list */
  export const tours = writable(null)
  const refreshTours = async() => {
    try {
      // Query tours
      tours.set(await query(`
          SELECT * {
            ?tourID a pgt:Tour .
            ?tourID sdo:name ?tourName .
          } ORDER BY ?tourName LIMIT 1000
        `, ['tourID', 'tourName']))
    }catch(e){
      console.log("Failure connection", e)
      await new Promise(resolve => setTimeout(resolve, 1000))
      refreshTours()
    }
  }

  refreshTours()



  export const selectedTour = writable("NOTOUR")

  export const tourStepsPromise = writable(Promise.resolve([]))
  export const tourArtworksPromise = writable(Promise.resolve([]))

  selectedTour.subscribe($selectedTour => {
    if($selectedTour !== 'NOTOUR'){
      tourStepsPromise.set(query(`
        SELECT DISTINCT ?stepIndexNumber ?siteName ?siteLat ?siteLong ?site WHERE {
          <${$selectedTour}> pgt:steps ?stepNode .
          ?stepNode ?stepIndex ?site .

          FILTER (strstarts(str(?stepIndex), 'http://www.w3.org/1999/02/22-rdf-syntax-ns#_'))

          BIND (STRLEN("http://www.w3.org/1999/02/22-rdf-syntax-ns#_") AS ?prefixLength)
          BIND (xsd:integer(SUBSTR(xsd:string(?stepIndex),?prefixLength + 1)) AS ?stepIndexNumber).

          OPTIONAL{ ?site sdo:name ?siteName. }
          OPTIONAL{ ?site geo:lat  ?siteLat.  }
          OPTIONAL{ ?site geo:long ?siteLong. }


        } ORDER BY ?stepIndexNumber`, ['stepIndexNumber', 'siteName', 'siteLat', 'siteLong', 'site']))


        tourArtworksPromise.set(query(`
        SELECT ?siteName ?artworkName ?artworkDescription ?artworkImage ?artworkURL WHERE { 
          <${$selectedTour}> pgt:steps ?stepNode .                 
          ?stepNode ?stepIndex ?site . 
          FILTER (strstarts(str(?stepIndex), 'http://www.w3.org/1999/02/22-rdf-syntax-ns#_')) 
       
       
          ?site sdo:name ?siteName . 
       
          ?artwork pgt:hasSite ?site; 
                   sdo:image ?artworkImage; 
                   sdo:name ?artworkName; 
                   sdo:url ?artworkURL; 
                   sdo:description ?artworkDescription. 
       
      } ORDER BY RAND() LIMIT 10 
        `,["siteName", "artworkName", "artworkDescription", "artworkImage", "artworkURL"]))
      }

  })
