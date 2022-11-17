<script>
  import Logo from './assets/logo.webp'
</script>

  <aside>
    <p>ciao</p>
  </aside>
  <main>  
    <div class="content">
      <img class="logo" src={Logo}>
    </div>
  </main>


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
