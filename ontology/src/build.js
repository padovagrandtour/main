const fs     = require('fs')
const path   = require('path')






const template = `
<html>
<head>
  <title>Schema entities - Padova Grand Tour</title>
  <style>
    h1 {text-align:center;}
    body {
      margin: auto;
      padding: 40px;
      max-width: 600px;
    }
    a {text-decoration: none;}

    table {
      border-collapse: collapse;
      width: 100%;
      margin-bottom: 70px;
    }
    table td, table th {
      border: 1px solid #ddd;
      padding: 8px;
    }
    table tr:nth-child(even){background-color: #f2f2f2;}
    table tr:hover {background-color: #ddd;}

    
  </style>
</head>
<body>
  <h1>Padova Grand Tour</h1>
  ${
   `<h2 id="#museum">Museum</h2>
    <p><a href="#museum">
    https://padovagrandtour.github.io/entities/#museum</a></p>
    <table>
      <tr>
       <td>rdf:type</td>
       <td>rdf:class</td> 
      </tr>
      <tr>
       <td>schema:description</td>
       <td>Building where collection and artworks are stored</td> 
      </tr>
    </table>

    <h2 id="#museum">Museum</h2>
    <p><a href="#museum">
    https://padovagrandtour.github.io/entities/#museum</a></p>
    <table>
      <tr>
       <td>rdf:type</td>
       <td>rdf:class</td> 
      </tr>
      <tr>
       <td>schema:description</td>
       <td>Building where collection and artworks are stored</td> 
      </tr>
    </table>

    <h2 id="#museum">Museum</h2>
    <p><a href="#museum">
    https://padovagrandtour.github.io/entities/#museum</a></p>
    <table>
      <tr>
      <td>rdf:type</td>
      <td>rdf:class</td> 
      </tr>
      <tr>
      <td>schema:description</td>
      <td>Building where collection and artworks are stored</td> 
      </tr>
    </table>
    `
  }
  <hr>
  <a style="float:right" href="#">Back to top ⬆️</a>
</body>
</html>
`


fs.writeFileSync(path.join(path.dirname(__dirname),"index.html"), template)

