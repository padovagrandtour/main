const { HashMapDataset, Graph, PlanBuilder } = window.sparqlEngine


let database = fetch('./hdt-wasm/padovagrandtour.hdt')
    .then( r => r.arrayBuffer())
    .then( buffer => {
    const data = new Uint8Array(buffer)
    Module['FS_createDataFile']('/', 'file.hdt', data, true, true, true);
    Module.ccall('loadHDT', null, [], null)
    })


export const executeQueryWithHDT = (queryStr, queryLabels) => new Promise( (resolve, reject) => {
    database.then( () => {// check the database is ready
        

    const formatTripleValue = tVal => tVal.startsWith('?') ? '' : tVal
    class HDTGraph extends Graph {
      constructor () {
        super()
      }

      find (triple) {
        const { subject, predicate, object } = triple
        console.log(subject, predicate, object)
        window.queryMatches = []

        console.log("running")
        window.Module.ccall('search', null, ['string', 'string', 'string'], [
          formatTripleValue(subject), formatTripleValue(predicate), formatTripleValue(object)
        ]);
        console.log("runningEnded")

        return window.queryMatches
      }

    }



    const graph = new HDTGraph()
    const dataset = new HashMapDataset('https://padovagrandtour.github.io/entities#', graph)

    const query = queryStr

    // Creates a plan builder for the RDF dataset
    const builder = new PlanBuilder(dataset)

    // Get an iterator to evaluate the query
    const iterator = builder.build(query)
    const results = []
    // Read results
    iterator.subscribe(bindings => {
      const result = bindings.toObject()
      console.log(queryLabels)
      results.push(queryLabels.map( label => result['?' + label]))

    }, err => {
      console.error('error', err)
    }, () => {
        resolve(results);


    })

  })})