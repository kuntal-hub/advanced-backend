import express from 'express';
import { ApolloServer } from 'apollo-server-express';

const app = express();

const server = new ApolloServer({
    // Define your typeDefs and resolvers here
});

await server.start();
server.applyMiddleware({ app, path: '/graphql' });

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000/graphql');
});