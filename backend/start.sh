# start.sh
#!/bin/sh

npm run migrate up

node ./src/server.js