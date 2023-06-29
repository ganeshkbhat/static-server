# nserve

Run a simple static server using node based http server / nserve

# INSTALLATION

Install using the following command

`npm install -g servedev`

Run command to run a http development server

`nserve ./www 3000 0 list=true index`

`nserve ./www 3000 0 list=true index`

`nserve ./www 3000 secure=false list=true index`

`nserve ./www 3000 secure=, list=true index`

<!-- `nserve ./www 3000 secure=, list=false index` -->

<!-- `nserve ./www 3000 secure=/path/to/pvt.key,path/to/pub.crt list={format:'json',names:['index','index.json','/']} index` -->

`nserve ./www 3000 secure=/path/to/pvt.key,path/to/pub.crt list={format:'json',names:['index','index.json','/']} index`

`nserve ./www 3000 secure=/path/to/pvt.key,path/to/pub.crt list={format:'json',names:['index','index.json','/']} index`
