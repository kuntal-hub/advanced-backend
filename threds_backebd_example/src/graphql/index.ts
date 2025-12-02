import { ApolloServer } from "@apollo/server";
import { User } from "./user/index.js";

async function createGraphQlServer() {
    const server = new ApolloServer({
        // typeDefs and resolvers would be defined/imported here
        typeDefs: `
            ${User.userTypeDef}

            type Query {
                ${User.userQueries}
            }

            type Mutation {
                ${User.userMutations}
            }
        `,
        resolvers: {
            Query: {
                ...User.userResolver.queries,
            },

            Mutation: {
                ...User.userResolver.mutations,
            },
        }
    });

    await server.start();

    return server;
}

export { createGraphQlServer };