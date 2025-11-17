import {  gql } from 'apollo-server-express';

const userTypeDef = gql`
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
`;

export { userTypeDef } ;