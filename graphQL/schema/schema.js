import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLInputObjectType, GraphQLNonNull } from "graphql";

const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 30 },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
    { id: 4, name: 'David', email: 'david@example.com', age: 40 }
];

// we must make <object>Types by using GraphQLObjectType any external types (like mongoose schema models) do not work

const userType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt }
    }
});

const userInputType = new GraphQLInputObjectType({
    name: 'userInput',
    fields: {
        name:{type:new GraphQLNonNull(GraphQLString)},
        email:{type:new GraphQLNonNull(GraphQLString)},
        age:{type:GraphQLInt},
    }
})


// Define the Root Query
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
                return users.find(user => user.id === args.id);
            }
        },
        users: {
            type: new GraphQLList(userType),
            resolve: function resolve(parent, args) {
                return users;
            }
        }
    }
});

const rootMutation = new GraphQLObjectType({
    name:'userMutaion',
    fields:{
        addUser: {
            type: userType,
            args: {
                input:{type:userInputType}
            },
            resolve(parent,{input}) {
                if(!input.age) {
                    throw new Error('provide age ')
                }

                const newUser = {
                    name: input.name,
                    email: input.email,
                    age: input.age,
                    id: users.length + 1
                }

                users.push(newUser);

                return newUser;
            }
        },
        updateUser: {
            type: userType,
            args: {
                id: { type: GraphQLInt },
                name: { type: GraphQLString },
                email: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(parent,args) {
                    users[args.id -1] = {
                    name: args.name,
                    email: args.email,
                    age: args.age,
                    id: args.id
                }

                return users[args.id -1];
            }
        },
    }
})

const schema = new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation
});

export default schema;
