const fs            = require('fs')
const path          = require('path')
const puppeteer     = require('puppeteer')



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
  const categoryUrls = [
    'https://it.wikipedia.org/wiki/Categoria:Musei_di_Padova', 
    'https://it.wikipedia.org/wiki/Categoria:Architetture_di_Padova',
    'https://it.wikipedia.org/wiki/Categoria:Castelli_di_Padova',
    'https://it.wikipedia.org/wiki/Categoria:Chiese_di_Padova',
    'https://it.wikipedia.org/wiki/Categoria:Basiliche_di_Padova',
    'https://it.wikipedia.org/wiki/Categoria:Monumenti_di_Padova',
    'https://it.wikipedia.org/wiki/Categoria:Mura_e_porte_di_Padova',
    'https://it.wikipedia.org/wiki/Categoria:Palazzi_di_Padova',
    'https://it.wikipedia.org/wiki/Categoria:Logge_di_Padova',
    'https://it.wikipedia.org/wiki/Categoria:Ponti_di_Padova',
  ]


  let output = {}

  for(const category of categoryUrls){
 

    console.log("Category " + category)
    await page.goto(category)
    await page.waitForSelector('#mw-pages a')
    output[category] = {}

    const placeUrls = await page.evaluate( 
      () =>
      ([... document.querySelectorAll('#mw-pages a')].map(a => [a.href, a.innerText]))
    )

    for (const [place, name] of placeUrls){
      console.log("   place " + place)

      output[category][place] = {
        name
      }

      await page.goto(place)

      try{
        await page.waitForSelector('.geo-default .longitude')
        output[category][place].longitude = await page.evaluate( () => document.querySelector('.geo-default .longitude').innerText )
        output[category][place].latitude = await page.evaluate( () => document.querySelector('.geo-default .latitude').innerText )
      }catch(e){
        console.log("[ERROR] Can't get longitude or latitude for " + name)
      }

      

    }



  }

  fs.mkdirSync(path.join(__dirname, 'results'), { recursive: true })
  fs.writeFileSync(path.join(__dirname, 'results', 'wikipedia-categories.json'), JSON.stringify(output, null, 2))
  console.log('[EXIT] [SUCCESS] Done!')

})().catch( (e) => {
  console.log('[EXIT] [FAILURE]', e)

  fs.mkdirSync(path.join(__dirname, 'results'), { recursive: true })
  fs.writeFileSync(path.join(__dirname, 'results', 'wikipedia-categories-tmp.json'), {output}, null, 2)
})

