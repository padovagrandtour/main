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
 


    await page.goto(category)
    await page.waitForSelector('#mw-pages a')
    output[category] = {}

    output[category] = await page.evaluate( 
      () =>
      ([... document.querySelectorAll('#mw-pages a')].map(a => [a.href, a.innerText]))
    )  



  }

  fs.mkdirSync(path.join(__dirname, 'results'), { recursive: true })
  fs.writeFileSync(path.join(__dirname, 'results', 'wikipedia-categories.json'), JSON.stringify(output, null, 2))
  console.log('[EXIT] [SUCCESS] Done!')

})().catch( (e) => {
  console.log('[EXIT] [FAILURE]', e)

  fs.mkdirSync(path.join(__dirname, 'results'), { recursive: true })
  fs.writeFileSync(path.join(__dirname, 'results', 'wikipedia-categories-tmp.json'), {output}, null, 2)
})

