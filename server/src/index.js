import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import messagesRoute from './routes/messages.js'
import usersRoute from './routes/users.js'

const app = express()

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
)

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models: {
      messages: '',
      users: ''
    }
  }
})

server.applyMiddleware({ app, path: '/graphql' })

app.listen(7000, ()=>{
  console.log('server listening on 8000....')
})

