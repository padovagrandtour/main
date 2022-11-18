<script>
  import Logo from './assets/logo.webp'




  const queryEndpoint = (query, labels) => new Promise( (resolve, reject) => {

    const results = []

    new window.Comunica.QueryEngine().queryBindings(query, {
      sources: [{type:'sparql', value:'http://localhost:7210/repositories/pgt'}],
    }).then(function (bindingsStream) {
      bindingsStream.on('data', function (data) {
        console.log(labels.map( label => data.get(label).value))
        results.push( labels.map( label => data.get(label).value))
      });

      bindingsStream.on('end', function () {
        resolve(results)
      })
    });

  })

  let l = ['s', 'p', 'o']
  let r = queryEndpoint(`
      SELECT * {
        ?s ?p ?o
      } LIMIT 100
    `, l)

</script>

  <aside>
    <p>

    </p>
  </aside>
  <main>  
    <div class="content">
      <img class="logo" alt="Padova Grand Tour logo" src={Logo}>
      {#await r}
        <p>waiting</p>
      {:then results} 
      <div class="sparql-results">
      <table class="sparql-results">
        <tr>
          {#each l as label}
            <td>{label}</td>
          {/each}
        </tr>
        {#each results as result}
        <tr>
        {#each result as value}
          <td>{value}</td>

        {/each}   
        </tr>
        {/each}
      </table>
    </div>
     
      {/await}

    </div>
  </main>


<style>

.sparql-results {
  max-width: 500px;
  overflow-x: auto;
  
}


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
  background-color: brown;
  width: 300px;
  flex: 0 0 auto;
  height: 100vh;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

main {flex: 1 1 auto;}
main > .content {max-width: 500px; margin: 0 auto; padding: 30px;}

.logo {
  width: 60%;
  margin: 30px auto;
  display: block;
}
</style>
