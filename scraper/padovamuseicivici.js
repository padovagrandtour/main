const fs            = require('fs')
const path          = require('path')
const puppeteer     = require('puppeteer')


// Output object (put here scraped data)
/* At the begin, this script was meant to support resume/recover
from error by caching to results/padovamusicivi-tmp.json intermediate
status, but at the end it wasn't really needed */
const {resumeData, output } = JSON.parse(`{
  "output": {},
  "resumeData": {}
}`)


;(async () => {

  browser = await puppeteer.launch({
    headless: false,
    args: ["--disable-setuid-sandbox"],
    'ignoreHTTPSErrors': true
  });

  let page = await browser.newPage();

  //Code to Set Viewport
  await page.setViewport({
    width: 1300,
    height: 600
  })




  // Museum base paths
  const museumUrls = {
    'https://cappellascrovegni.padovamusei.it' : "Cappella degli Scrovegni",
    'https://padovamusei.it/it/musei/museo-archeologico' : "Museo archeologico",
    'https://padovamusei.it/it/musei/museo-arte-medievale-moderna': "Museo d'Arte Medievale e Moderna",
    'https://padovamusei.it/it/musei/museo-bottacin': "Museo Bottacin",
    'https://padovamusei.it/it/musei/museo-risorgimento-eta-contemporanea' : "Museo del Risorgimento e dell'Età Contemporanea",
  }



  for(const [museumUrl, museumName] of Object.entries(museumUrls)){
    console.log("museum", museumUrl)
    resumeData.museumUrl = museumUrl


    output[museumUrl] = {
      name: museumName,
      img: '',
      description: '',
      collections: {},
    }

    let collezioni = []

    if(museumUrl !== 'https://cappellascrovegni.padovamusei.it'){
      // Workflow for standard museums
      await page.goto(museumUrl)
      await page.waitForSelector('#banner img')
      output[museumUrl].img = await page.evaluate( () => document.querySelector('#banner img').src )
  
  
      await page.goto(museumUrl + '/collezioni')
  
      try{
        await page.waitForSelector('#header .container .descrizione')
        output[museumUrl].description = await page.evaluate( () => document.querySelector('#header .container .descrizione').innerHTML )  
      }catch(e){
        console.log("[ERROR] Can't get description for " + museumName)
      }
  
      await page.waitForSelector('.view-elenco-collezioni a')
      collezioni = await page.evaluate( () => 
        ([... document.querySelectorAll('.view-elenco-collezioni a')].map(a => [
          a.href, 
          'https://padovamusei.it' + a.getAttribute('data-background'),
        ]))
      )

    }else{
      // Workflow for the "Cappella degli Scrovegni" special section
      await page.goto('https://cappellascrovegni.padovamusei.it/it/cappella-giotto/storia')
      await page.waitForSelector('#banner img')
      output[museumUrl].img = await page.evaluate( () => document.querySelector('#banner img').src )
    
      await page.waitForSelector('a#main-content~div .field-item')
      output[museumUrl].description = await page.evaluate( () => document.querySelector('a#main-content~div .field-item').innerHTML )
  

      await page.goto('https://cappellascrovegni.padovamusei.it/it/lettura-affreschi-cappella-scrovegni')

      await page.waitForSelector('.view-elenco-collezioni a')
      collezioni = await page.evaluate( () => 
        ([... document.querySelectorAll('.view-elenco-collezioni a')].map(a => [
          a.href, 
          'https://cappellascrovegni.padovamusei.it' + a.getAttribute('data-background'),
        ]))
      )

    }


    for(const [collectionUrl, collectionImg] of collezioni){
      console.log("  collection", collectionUrl)
      resumeData.collectionUrl = collectionUrl

      if(collectionImg.endsWith('null')){
        console.log("[ERROR] Collection has null img, skipping", collectionImg)
        continue;
      }
      output[museumUrl].collections[collectionUrl] = {
        name: '',
        img: collectionImg,
        description: '',
        artworks: {},
      }
      await page.goto(collectionUrl);

      await page.waitForSelector('#header .container h1')
      output[museumUrl].collections[collectionUrl].name = await page.evaluate( () => document.querySelector('#header .container h1').textContent )
      output[museumUrl].collections[collectionUrl].description = await page.evaluate( () => document.querySelector('#header .container .descrizione').innerHTML )


      await page.waitForSelector('.view-elenco-opere a, .view-elenco-collezioni a')
      const opere = await page.evaluate( () => 
        ([... document.querySelectorAll('.view-elenco-opere a, .view-elenco-collezioni a')].map(a => a.href))
      )


      for (const artworkUrl of opere){
        console.log("    artwork", artworkUrl)
        resumeData.artworkUrl = artworkUrl


        const artwork = { }

        await page.goto(artworkUrl);

        await page.waitForSelector('#header .container h1')
        artwork.name = await page.evaluate( () => document.querySelector('#header .container h1').textContent )  
        try{
          await page.waitForSelector('#banner a img')
          artwork.img = await page.evaluate( () => document.querySelector('#banner a img').src )  
        }catch(e){
          console.log("[ERROR] Can't get image of ", artwork, collection, museumUrl, collezioni)
        }
        try{
          await page.waitForSelector('.field-item.descrizione_oggetto,.field-item.descrizione_soggetto')
          artwork.description = await page.evaluate( () => document.querySelector('.field-item.descrizione_oggetto, .field-item.descrizione_soggetto').innerHTML )
        }catch(e){
          console.log("[ERROR] Can't get description for " + artwork.name)
        }
        await page.waitForSelector('#header .container h3')
        artwork.tags = (await page.evaluate( () => document.querySelector('#header .container h3').textContent )).split(',')

        artwork.fields = await page.evaluate( () => {
          const r = {}

          for(let field of document.querySelectorAll('.field-items-list .field-item .content')) {
            r[field.querySelector('.label').textContent.trim()] = field.querySelector('.text').textContent.trim()
          }
          return r
        })

        output[museumUrl].collections[collectionUrl].artworks[artworkUrl] = artwork
        delete resumeData.artworkUrl
      }

      delete resumeData.collectionUrl
    }



  }

  fs.mkdirSync(path.join(__dirname, 'results'), { recursive: true })
  fs.writeFileSync(path.join(__dirname, 'results', 'padovamuseicivici.json'), JSON.stringify(output, null, 2))
  console.log('[EXIT] [SUCCESS] Done!')

})().catch( (e) => {
  console.log('[EXIT] [FAILURE]', e)

  fs.mkdirSync(path.join(__dirname, 'results'), { recursive: true })
  fs.writeFileSync(path.join(__dirname, 'results', 'padovamuseicivici-tmp.json'), JSON.stringify({resumeData, output}, null, 2))
})

