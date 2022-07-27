
'use strict'
const GraphQLUpload  = require('graphql-upload/GraphQLUpload.js')
const { finished } = require('stream/promises')

module.exports = function setupUploadSchema(serverPkgExport) {
  const {
    gql,
  } = serverPkgExport

  const resolvers = {
    Upload: GraphQLUpload,
    Query: {
      hello: () => {
        return 'hello world'
      }
    },
    Mutation: {
      singleUpload: async (parent, { file }) => {
        const { createReadStream, filename, mimetype, encoding } = await file

        // Invoking the `createReadStream` will return a Readable Stream.
        // See https://nodejs.org/api/stream.html#stream_readable_streams
        const stream = createReadStream()

        const out = require('fs').createWriteStream(`./uploads/${filename}`)
        stream.pipe(out)
        await finished(out)

        return { filename, mimetype, encoding }
      }
    }
  }

  const schema = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type Query {
    hello: String
  }

  type Mutation {
    # Multiple uploads are supported. See graphql-upload docs for details.
    singleUpload(file: Upload!): File!
  }`

  return { schema, resolvers }
}
