<p align="center">
  <img width="460" src="https://padovagrandtour.github.io/logo.webp">
</p>

Main mono repository for the Database 2 project "Padova Grand Tour".

Luca FABBIAN, Loic DUPUY-KERANGUEVEN, Jean LE CHEVALIER

**TL;DR:** just run `docker compose up --force-recreate`, wait for GraphDB to start and then open <https://padovagrandtour.github.io>, visit <https://padovagrandtour.github.io/entities#> to get more details on the schema, or check the queries inside the `queries.ipynb` notebook. Enjoy!

<p align="center">
  <img width="100%" src="https://github.com/padovagrandtour/padovagrandtour/raw/main/screenshotWebsite.png">
</p>
<p align="center">
  <img width="100%" src="https://github.com/padovagrandtour/padovagrandtour/raw/main/screenshotEntities.png">
</p>



## Project motivation
As a group made up of 2 Erasmus students and an italian one,our idea was to create an ontology related to tourism, focusing on Padova.

The main goal was to generate some "Tours" touching key places of the city, and then provide some insights about them. In order to do so, we retrieved data about artworks and cultural sites from various sources ([padovamusei.it](https://padovamusei.it), [wikipedia.it](https://padovamusei.it), [dati.cultura.gov.it](https://dati.cultura.gov.it/)) and ingested them under a common schema. Finally, we built some queries and a website to showcase our results.



## Overview

### Project structure

```bash
padovagrandtour/
  .github/                       # Build workflows which run every "git push"
  data/                          # Everything ready to be loaded in GraphDB
  ingesting/                     # Notebooks for ingesting and generating data
  playground/                    # Experiments and other stuffs
  scraper/                       # Scraper source code and results
  sparql/                        # Data retrieved by the "Ministero dei beni culturali" sparql endpoint
  website/                       # https://padovagrandtour.github.io website source
  website-entities/              # https://padovagrandtour.github.io/entities website source

  docker-compose.yml             # GraphDB docker compose manifest
  ontologyVisual.png             # Visual representation of our schema
  queries.ipynb                  # Queries for our project  
```

## Retrieving the data

### Scraped data
Most of the official websites we refer to do not provide any kind of machine-friendly API. Thus, the only solution is to extract the information from the website itself. We have written some node+puppeteer data scrapers to accomplish these tasks. The resulting JSON files are stored into the `scraper/results` folder. Intermediate files are named with a `-tmp` suffix. If you want to generate those files again from scratch, follow the instructions below.

- Install `Node.js` version >=18.

- (optional) to use the copy of chrome/chromium/edge already installed in your computer, find the path with `whereis google-chrome` and setup:
```bash 
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome #replace with your own path

# Remember: if you choose to use your already installed browser, you MUST export these var EVERY TIME you want to use the scraper.
```
- install node dependencies:
```bash
cd scraper
npm install
```

#### Retrieving data from [padovamusei.it](https://padovamusei.it)

```bash
cd scraper
node padovamuseicivici.js
```
This will open a chrome window and will start browsing the [padovamusei.it](https://padovamusei.it). Do not interfer with the window while the program is running! It will take around 15mins to generate the JSON file.


#### Retrieving data from [wikipedia.it](https://padovamusei.it)

```bash
cd scraper
node wikipedia-categories.js
```
This will open a chrome window and will start crawling the [Portale:Padova](https://it.wikipedia.org/wiki/Portale:Padova) page on wikipedia. Do not interfer with the window while the program is running! It will take around 15mins to generate the JSON file.


### Querying the sparql endpoint of "Ministero dei Beni Culturali"

This is done by the `sparql/sparqlRetriever.ipynb` and stored as JSON files in the same folder.

The server was unable to provide all the data in one query, thus we decided for a two-step approach:
- first we got a list of all artworks and sites
- then we issued one query for each artwork or site

To find the right query, we had to explore and experiment with the endpoint. You find those tries under `playground/sparqlExperiments.ipynb`



## Ontology

The ontology has been generated with `Protégé` and stored as `data/ttlData/ontology.ttl`


### First draft (outdated)
<p align="center">
  <img width="100%" src="https://github.com/padovagrandtour/padovagrandtour/raw/main/playground/ontologyVisualV1.png">
</p>

We have four main classes: *Tour*, *CulturalSite*, *Artwork* and *Collection* and many subclasses of the *CulturalSite* to further categorize places. 

### Final schema
<p align="center">
  <img width="100%" src="https://github.com/padovagrandtour/padovagrandtour/raw/main/ontologyVisual.png">
</p>

In this third (and final) version, we removed the subclasses of *CulturalSite* and replaced them with a property referring to an instance of a pgt:CSCategory class. This has several advantages:
- we do not rely anymore on the reasoner for inferring triples. This is huge, because the GraphDB reasoner was not consistent/reliable and the one in Protégé was slow and impractical to embed in an automatic workflow.
- now some queries looks more elengant and are shorter. For example, it's easier to request the list of CulturalSites grouped by categories.
- this decouples "recognize it's a CulturalSite" from "give the site a category". This is really useful while ingesting data.

We also considered owl `enumeratedClass` to represent categories (`playground/ontologyV2.ttl`), but they were overall harder to deal with; data ranges, instead, while being easier to deal with, lacked the full capability of objects to have properties. At the end we sticked with the `pgt:CSCategory` class solution. It also agrees with the conventions explained [here](https://jazz.net/wiki/bin/view/LinkedData/UseUrisForEnums).

Finally, we switched from `xsd:year` to `xsd:int` because the former is not suited to represent our data range (for example, we are using negative values to represent a.C. dates, which are not allowed in `xsd:year` and were not handled right by sparql operators).


## Ingesting the data

In this step, the data taken from `scraper/results/*.json` is merged with the ones taken from the enpoind (stored as  `sparql/*.json`) and the ones generated on the fly. The data are processed by `ingesting/*.ipynb` notebooks and used to populate the `data/ttlData/` folder.

Getting started:
```bash
pip3 install pandas rdflib roman
```

Notebooks overview:

| Notebook                    | Result        | Data ingested/generated                                                      |
|-----------------------------|---------------|------------------------------------------------------------------------------|
| `schemaInfoGenerator.ipynb` | `schema.ttl`  | Some metadata and insight on the schema                                      |
| `scrapedDataIngester.ipynb` | `scraped.ttl` | Scraped cultural sites and artworks                                          |
| `sparqlIngester.ipynb`      | `sparql.ttl`  | Cultural sites and artworks from the "Ministero dei Beni Culturali" endpoint |
| `toursGenerator.ipynb`      | `tours.ttl`   | Generated tours                                                              |


You may run all of them at once from CLI with:
```bash
jupyter nbconvert --to notebook --inplace --execute ingesting/*.ipynb
```

## Setting up GraphDB
This is done auto-magically via Docker. Just run `docker compose up --force-recreate`. This will create a new GraphDB repo from `data/graphdb-repo.ttl`, ingest all ttl files in `data/ttlData/*.ttl` and start a GraphDB server on <http://localhost:7210>.

Keep in mind that every time you shut down the docker compose service and use the `--force-recreate`, everything is recreated and populated again from scratch. This is done on purpose, since during the development phase the data changes frequently, so it's important to always work on fresh data.


## Queries
Queries are stored inside the `queries.ipynb` notebook.


## Building the website and the entity website
We provide two websites, one is a webapp built on top of our database, the other is a static html file showing details on our schema.

You DO NOT NEED to build them manually. It is done every time you `git push` thanks to actions stored in `.github/workflows`


- Install `Node.js` version >=18.

```bash
npm run build    # or "npm run dev" for debugging, with hot reload enabled
```

