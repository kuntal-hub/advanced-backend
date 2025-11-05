import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";

const userType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
});

const rootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        hello: {
            type: GraphQLString,
            resolve: () => 'Hello world!'
        },
        hii: {
            type: GraphQLString,
            resolve: () => 'Hii!'
        },
        user: {
            type: userType,
            args: { id: { type: GraphQLInt } },
            resolve: (parent, args) => {
                const users = [
                    { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 },
                    { id: 2, name: 'Bob', email: 'bob@example.com', age: 30 },
                    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
                    { id: 4, name: 'David', email: 'david@example.com', age: 40 }
                ];
                return users.find(user => user.id === args.id);
            }
        }
    }
});

const schema = new GraphQLSchema({
    query: rootQuery
});

export default schema;
