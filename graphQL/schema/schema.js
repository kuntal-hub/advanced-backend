import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLInputObjectType, GraphQLNonNull } from "graphql";

const users = [
    { id: 1, name: 'Alice', email: 'alice@example.com', age: 25 },
    { id: 2, name: 'Bob', email: 'bob@example.com', age: 30 },
    { id: 3, name: 'Charlie', email: 'charlie@example.com', age: 35 },
    { id: 4, name: 'David', email: 'david@example.com', age: 40 }
];

const addresses = [
    { street: '123 Main St', city: 'New York', state: 'NY', zip: '10001', country: 'USA', userId: 1 },
    { street: '456 Elm St', city: 'Los Angeles', state: 'CA', zip: '90001', country: 'USA', userId: 2 },
    { street: '789 Oak St', city: 'Chicago', state: 'IL', zip: '60601', country: 'USA', userId: 3 },
    { street: '101 Pine St', city: 'Houston', state: 'TX', zip: '77001', country: 'USA', userId: 4 },
    { street: '202 Maple St', city: 'Phoenix', state: 'AZ', zip: '85001', country: 'USA', userId: 1 },
    { street: '303 Cedar St', city: 'Philadelphia', state: 'PA', zip: '19101', country: 'USA', userId: 2 },
    { street: '404 Birch St', city: 'San Antonio', state: 'TX', zip: '78201', country: 'USA', userId: 3 },
    { street: '505 Walnut St', city: 'San Diego', state: 'CA', zip: '92101', country: 'USA', userId: 4 }
];

const categoryData = [
    { id: 1, name: 'Electronics', description: 'Electronic devices and gadgets', parentCategoryId: null },
    { id: 2, name: 'Computers', description: 'Desktops, laptops, and accessories', parentCategoryId: 1 },
    { id: 3, name: 'Smartphones', description: 'Mobile phones and accessories', parentCategoryId: 1 },
    { id: 4, name: 'Home Appliances', description: 'Appliances for home use', parentCategoryId: null },
    { id: 5, name: 'Kitchen Appliances', description: 'Appliances for the kitchen', parentCategoryId: 4 },
    { id: 6, name: 'Refrigerators', description: 'Cooling appliances for food storage', parentCategoryId: 5 },
];

// we must make <object>Types by using GraphQLObjectType any external types (like mongoose schema models) do not work

const userAddressType = new GraphQLObjectType({
    name: 'userAddress',
    fields: {
        street: { type: GraphQLString },
        city: { type: GraphQLString },
        state: { type: GraphQLString },
        zip: { type: GraphQLString },
        country: { type: GraphQLString },
        userId: { type: GraphQLInt }
    }
});

const userType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        email: { type: GraphQLString },
        age: { type: GraphQLInt },
        addresses: {
            type: new GraphQLList(userAddressType),
            resolve(parent, args) {
                return addresses.filter(address => address.userId === parent.id);
            }
        }
    }
});

const categoryType = new GraphQLObjectType({
    name: 'Category',
    fields: () => ({
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        parentCategory: {
            type: categoryType,
            resolve(parent, args) {
                return categoryData.find(category => category.id === parent.parentCategoryId);
            }
        },
        subCategories: {
            type: new GraphQLList(categoryType),
            resolve(parent, args) {
                return categoryData.filter(category => category.parentCategoryId === parent.id);
            }
        }
    })
}); 

const userInputType = new GraphQLInputObjectType({
    name: 'userInput',
    fields: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt },
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
        },
        category: {
            type: categoryType,
            args: { id: { type: GraphQLInt } },
            resolve(parent, args) {
                return categoryData.find(category => category.id === args.id);
            }
        },
        categories: {
            type: new GraphQLList(categoryType),
            resolve(parent, args) {
                return categoryData;
            }
        }
    }
});

const rootMutation = new GraphQLObjectType({
    name: 'userMutaion',
    fields: {
        addUser: {
            type: userType,
            args: {
                input: { type: userInputType }
            },
            resolve(parent, { input }) {
                if (!input.age) {
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
            resolve(parent, args) {
                users[args.id - 1] = {
                    name: args.name,
                    email: args.email,
                    age: args.age,
                    id: args.id
                }

                return users[args.id - 1];
            }
        },

        addCategory: {
            type: categoryType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                description: { type: GraphQLString },
                parentCategoryId: { type: GraphQLInt }
            },
            resolve(parent, args) {
                const newCategory = {
                    id: categoryData.length + 1,
                    name: args.name,
                    description: args.description,
                    parentCategoryId: args.parentCategoryId || null
                };

                categoryData.push(newCategory);
                return newCategory;
            }
        }
    }
})

const schema = new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation
});

export default schema;
