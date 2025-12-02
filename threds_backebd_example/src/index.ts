import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';

async function startServer() {
    const app = express();

    const server = new ApolloServer({
        // typeDefs and resolvers would be defined/imported here
        typeDefs: `
            type Query {
                hello: String
                sayHi(name: String!): String
            }
        `,
        resolvers: {
            Query: {
                hello: () => 'Hello, world!',
                sayHi: (_: any, { name }: { name: string }) => `Hi, ${name}!`,
            }
        }
    });

    app.use(express.json());
    app.use(cors());

    await server.start();

    app.use('/graphql', expressMiddleware(server));

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
};

startServer().catch(err => {
    console.error('Failed to start server:', err);
});