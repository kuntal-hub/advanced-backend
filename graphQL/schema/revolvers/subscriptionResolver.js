import pubsub from '../pubsub.js';
const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 30 },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
    { id: 4, name: 'David', email: 'david@example.com', age: 40 }
];

const userResolver = {
    Query: {
        getUser: (parent, args, context, info) => {
            if (!context.isAuthorized) {
                throw new Error("Unauthorized");
            };
            return users.find(user => user.id === args.id);
        },
        getUsers: () => users
    },
    Mutation: {
        createUser: (parent, args, context, info) => {
            const newUser = {
                id: users.length + 1,
                name: args.name,
                email: args.email,
                age: args.age || null
            };
            users.push(newUser);
            pubsub.publish('USER_CREATED', { userCreated: newUser });
            return newUser;
        }
    },
    Subscription: {
        userCreated: {
            subscribe: () => pubsub.asyncIterableIterator(['USER_CREATED'])
        }
    }
}

export { userResolver };