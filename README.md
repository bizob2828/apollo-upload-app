This app demonstrates file upload with apollo server express and @newrelic/apollo-server-plugin.


## Start app
```
NEW_RELIC_APP_NAME=upload-example NEW_RELIC_LICENSE__KEY=<key> node server.js
```

The output will show which port the server is listening on.

If you run the following curl you can upload files and see the appropriate segments

```sh
curl --location --request POST 'http://localhost:58751/graphql' \
--form 'operations="{ \"query\": \"mutation ($file: Upload!) { singleUpload(file: $file) { filename } }\", \"variables\": { \"file\": null } }"' \
--form 'map="{ \"0\": [\"variables.file\"] }"' \
--form '0=@"/path/to/a/local/file"'
```

