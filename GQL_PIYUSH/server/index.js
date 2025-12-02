import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express5';
import cors from 'cors';
import bodyParser from 'body-parser';

const sampleData = [
    { id: 1, title: 'Learn GraphQL', completed: false },
    { id: 2, title: 'Build a GraphQL Server', completed: false },
    { id: 3, title: 'Deploy the Server', completed: false }
];

async function startServer() {
    const app = express();

    const server = new ApolloServer({
        // typeDefs and resolvers would be defined/imported here
        typeDefs: `
            type User {
                id: ID!
                name: String!
                email: String!
                username: String!
            }
            type Todo {
                id: ID!
                title: String!
                completed: Boolean!
                user: User
            }
            
            type Query {
                todos: [Todo!]!
                todo(id: ID!): Todo
            }
            
            type Mutation {
                addTodo(title: String!): Todo!
            }
            `,
        resolvers: {
            Todo: {
                user: async (parent) => {
                    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${parent.id}`);
                    const json = await response.json();
                    return json;
                }
            },
            Query: {
                todos: async () => {
                    const response = await fetch('https://jsonplaceholder.typicode.com/todos');
                    const json = await response.json();
                    // console.log(json);

                    return json;
                },

                todo: async (parent, { id }) => {
                    const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
                    const json = await response.json();
                    // console.log(json);

                    return json;
                },
            },
            Mutation: {
                addTodo: (parent, { title }) => {
                    const newTodo = {
                        id: sampleData.length + 1,
                        title,
                        completed: false
                    };
                    sampleData.push(newTodo);
                    return newTodo;
                }
            }
        }
    });

    app.use(bodyParser.json());
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