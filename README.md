# Padova Grand Tour
Main mono repository for the Database 2 project "Padova Grand Tour"



## Retrieving data from [padovamusei.it](https://padovamusei.it)
The official website does not provide any kind of machine-friendly API. Thus, the only solution is to extract the information from the website. We have written a node+puppeteer data scraper to accomplish this task. The resulting csv files are stored into the `data-scraper/results` folder.

- Install `Node.js` version >=18.

- (optional) to use the copy of chrome/chromium/edge already installed in your computer, find the path with `whereis google-chrome` and setup:
```bash 
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome #replace with your own path
```
- setup node dependencies and run the scraper:
```bash
cd data-scraper
npm install
node index.js
```

This will open a chrome window and will start browsing the [padovamusei.it](https://padovamusei.it). Do not interfer with the window while the program is running! It will take around 4mins to generate the csv files.


###