export const userQueries = `#graphql
    getUserToken(email: String!, password: String!): String
    getCurrentLoggedInUser: User
`;