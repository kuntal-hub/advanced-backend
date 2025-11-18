import { gql } from 'apollo-server-express';

const subscriptionUserTypeDef = gql`
    type User {
        id: Int
        name: String
        email: String
        age: Int
    }

    type Query {
        getUser(id: Int!): User
        getUsers: [User]
    }

    type Mutation {
        createUser(name: String!, email: String!, age: Int): User
    }

    type Subscription {
        userCreated: User
    }
`;

export { subscriptionUserTypeDef };