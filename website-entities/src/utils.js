import { writable, get } from "svelte/store";


/**
 * QUERY ENGINE
 * 
 */


export const sparqlPrefixes = `
PREFIX owl: <http://www.w3.org/2002/07/owl#> 
PREFIX pgt: <https://padovagrandtour.github.io/entities#> 
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> 
PREFIX xml: <http://www.w3.org/XML/1998/namespace> 
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> 
PREFIX sdo: <https://schema.org/>
PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> 

`

export const extractedPrefixes = {}

sparqlPrefixes.split('\n')
  .filter( line => line.includes('PREFIX'))
  .map( line => line.replace('PREFIX', '').trim())
  .forEach( line => {
    const [pKey, ...pValue] = line.split(':')
    extractedPrefixes[pKey.trim()] = pValue.join(':').trim().replace('<','').replace('>','')
  })

export const curiefy = (str) => {
  for(let [pKey, pValue] of Object.entries(extractedPrefixes)){
    str = str.replace(pValue, pKey + ':')
  }
  return str
}

  console.log(extractedPrefixes)
/** Utility function to make simpler to query with comunica. */
export const query = (queryStr, labels) => new Promise( (resolve, reject) => {
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

  addEventListener('hashchange', (event) => { window.location.reload() });

  export const entity = window.location.hash.replace('#', '')

  /* Repeatedly try to query the database until you get the tour list */
  export const properties = writable(null)
  const refreshEntities = async() => {
    try {
      // Query tours
      properties.set(await query(`
          SELECT * {
            pgt:${window.location.hash.substring(1)} ?p ?o
          } LIMIT 1000
        `, ['p', 'o']))
    }catch(e){
      console.log("Failure connection", e)
      await new Promise(resolve => setTimeout(resolve, 1000))
      refreshEntities()
    }
  }
  if(entity){
    refreshEntities()
  }

