How to build the docs;

```
# if apidoc isn't installed
# npm install apidoc -g
apidoc -i app/routes/ -o public/
```

How to test this locally;
```
git clone git@gitlab.com:jacebenson/fcc-microservice-imagesearch.git
cd fcc-microservice-imagesearch
npm install
cd app
cd routes
nano .env
# Make the file with these contents;
# exports.client_id = 'yourclientidgoeshere';
# exports.uri = 'mongodb://user:pass@host.mlab.com:port/collection';
cd .. 
cd ..
# should be on fcc-microservice-imagesearch
npm install
node index.js
```

```
#call it with curl
curl http://localhost:5000/api/query=term=cats&offset=0
curl http://localhost:5000/api/history
```