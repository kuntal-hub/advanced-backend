import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from "cors";

// use separate files for typeDefs and resolvers
import {userResolver} from './schema/revolvers/resolver.js';
import { userTypeDef } from './schema/typeDefs/type.js';

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}

const app = express();
app.use(cors(corsOptions));

const server = new ApolloServer({
    typeDefs: [userTypeDef],
    resolvers: [userResolver],
    context: ({ req }) => {
        // You can add authentication or other context setup here
        return {isAuthorized: true};
    }
});

await server.start();
server.applyMiddleware({ app, path: '/graphql' });

app.listen(4000, () => {
    console.log('Server is running on http://localhost:4000/graphql');
});