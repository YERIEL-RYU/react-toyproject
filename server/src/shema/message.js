import { gql } from 'apollo-server-express'

const messageSchema = gql`
  type Message {
    id: ID!
    text: String!
    user: User!
    timestamp: Float #13자리 숫자
  }

  extend type Query {
    message(cursor: ID): [Message!]!  # getMessages
    message(id: ID!): Message!        # getMessage
  }

  extend type Mutataion {
    createMessage(text: String!, userId: ID!): Message!
    updateMessage(id: ID!, text: String!, userId: ID!): Message!
    deleteMessage(id: ID!, userID: ID!): ID!
  }
`

export default messageSchema