import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { execute, subscribe } from 'graphql';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { makeExecutableSchema } from '@graphql-tools/schema';

// use separate files for typeDefs and resolvers
import { userResolver } from './schema/revolvers/subscriptionResolver.js';
import { subscriptionUserTypeDef } from './schema/typeDefs/subscriptionUserType.js';

(async () => {
    const app = express();

    const httpServer = createServer(app);

    const apolloServer = new ApolloServer({
        typeDefs: [subscriptionUserTypeDef],
        resolvers: [userResolver],
        context: ({ req }) => {
            // You can add authentication or other context setup here
            return { isAuthorized: true };
        }
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app, path: '/graphql' });

    const schema = makeExecutableSchema({
        typeDefs: [subscriptionUserTypeDef],
        resolvers: [userResolver],
    });

    SubscriptionServer.create(
        {
            schema,
            execute,
            subscribe,
            onConnect: (connectionParams, webSocket, context) => {
                // You can add authentication or other context setup here
                console.log('Client connected for subscriptions');
                return { isAuthorized: true };
            },
            onDisconnect: (webSocket, context) => {
                console.log('Client disconnected from subscriptions');
            }
        },
        {
            server: httpServer,
            path: '/graphql',
        }
    );

    httpServer.listen(4000, () => {
        console.log('Server is running on http://localhost:4000/graphql');
    });
})();


// **Note**: watch "https://www.youtube.com/watch?v=kt6xav5B4w8&list=PLQDioScEMUhmp4dErFcyDM3kwhcid-odz&index=27" this video for show customized errors in graphql