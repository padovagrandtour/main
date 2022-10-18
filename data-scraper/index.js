const puppeteer = require('puppeteer');

(async () => {

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




  const museumUrls = [
    'https://padovamusei.it/it/musei/museo-archeologico',
  ]

  for(const museumUrl of museumUrls){

    console.log(museumUrl)
    await page.goto(museumUrl + '/collezioni');

    await page.waitForSelector('.view-elenco-collezioni a')
    const collezioni = await page.evaluate( () => 
      ([... document.querySelectorAll('.view-elenco-collezioni a')].map(a => a.href))
    )

    for(const collection of collezioni){
      console.log(collection)
      await page.goto(collection);

      await page.waitForSelector('.view-elenco-opere a')
      const opere = await page.evaluate( () => 
        ([... document.querySelectorAll('.view-elenco-opere a')].map(a => a.href))
      )


      for (const opera of opere){
        console.log('\n' + opera)
        await page.goto(opera);
  
        await page.waitForSelector('#banner a img')
        const img = await page.evaluate( () => document.querySelector('#banner a img').src )

        await page.waitForSelector('.field-item.descrizione_oggetto')
        const description = await page.evaluate( () => document.querySelector('.field-item.descrizione_oggetto').textContent )

        const fields = await page.evaluate( () => {
          const r = {}

          for(let field of document.querySelectorAll('.field-items-list .field-item .content')) {
            r[field.querySelector('.label').textContent.trim()] = field.querySelector('.text').textContent.trim()
          }
          return r
        })

        console.log('immagine', img)
        console.log('descrizione', description)
        console.log('fields', fields)

      }
    }


  }



})()

