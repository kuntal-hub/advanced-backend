import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";

const rootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        hello: {
            type: GraphQLString,
            resolve: () => 'Hello world!'
        }
    }
});

const schema = new GraphQLSchema({
    query: rootQuery
});

export default schema;
