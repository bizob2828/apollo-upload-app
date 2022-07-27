/*
 * Copyright 2020 New Relic Corporation. All rights reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict'

const setupSchema = require('./lib/schema')
const createPlugin = require('@newrelic/apollo-server-plugin')
const plugin = createPlugin()
const express = require('express')
const graphqlUploadExpress = require('graphql-upload/graphqlUploadExpress.js')
const expressServerPkg = require('apollo-server-express')
const { ApolloServer, gql } = expressServerPkg
const { schema, resolvers }  = setupSchema(expressServerPkg)
const server = new ApolloServer({
  typeDefs: [schema],
  resolvers,
  plugins: [plugin]
})
const app = express()

async function start() {
  await server.start()
  // This middleware should be added before calling `applyMiddleware`.
  app.use(graphqlUploadExpress())
  server.applyMiddleware({ app })
  await new Promise((resolve, reject) => {
    const expressServer = app.listen(0, (err) => {
      if (err) {
        reject(err)
      }

      const serverUrl = `http://localhost:${expressServer.address().port}${server.graphqlPath}`

      console.log(`Listening on ${serverUrl}`)
      resolve()
    })
  })
}

start()
