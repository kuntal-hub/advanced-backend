import express from 'express';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import { createGraphQlServer } from './graphql/index.js';

async function startServer() {
    const app = express();

    app.use(express.json());
    app.use(cors());

    app.use('/graphql', expressMiddleware(await createGraphQlServer()));

    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
};

startServer().catch(err => {
    console.error('Failed to start server:', err);
});