#!/bin/bash

# Change location of the file location as needed
FILE=.env
JSONFILE=./secrets/secret_database.json


#Declaration of .env variables
dbname="$(cat $JSONFILE | grep DB_NAME | cut -d":" -f2 | tr -d '", ')"
dbuser="$(cat $JSONFILE | grep DB_USER | cut -d":" -f2 | tr -d '", ')"
dbpass="$(cat $JSONFILE | grep DB_PASS | cut -d":" -f2 | tr -d '", ')"
#dbport="$(cat $JSONFILEn | grep DB_PORT | cut -d":" -f2 | tr -d '", ')"
dbhost="$(cat $JSONFILE | grep DB_HOST | cut -d":" -f2 | tr -d '", ')"
secretip="$(ifconfig | sed -En 's/127.0.0.1//;s/.*inet (addr:)?(([0-9]*\.){3}[0-9]*).*/\2/p' | head -1)"

# If .env is found overwrite it, if not, create one
if test -f "$FILE"; then
        echo "DB_NAME=${dbname}" > $FILE
        echo "DB_USER=${dbuser}" >> $FILE
        echo "DB_PASS=${dbpass}" >> $FILE
        echo "DB_PORT=5432" >> $FILE
#       echo "DB_NAME=${dbport}" >> $FILE
        echo "DB_HOST=${dbhost}" >> $FILE
        echo "SECRET_HASH=RSA-SHA256" >> $FILE
        echo "SECRET_IP=http://${secretip}:8080/" >> $FILE
else
        echo "DB_NAME=${dbname}" >> $FILE
        echo "DB_USER=${dbuser}" >> $FILE
        echo "DB_PASS=${dbpass}" >> $FILE
        echo "DB_PORT=5432" >> $FILE
#       echo "DB_NAME=${dbport}"
        echo "DB_HOST=${dbhost}" >> $FILE
        echo "SECRET_HASH=RSA-SHA256" >> $FILE
        echo "SECRET_IP=http://${secretip}:8080/" >> $FILE
fi