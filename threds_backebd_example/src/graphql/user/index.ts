import { userTypeDef } from './typedef.js';
import { userQueries } from './queries.js';
import { userMutations } from './mutations.js';
import { resolvers } from './resolver.js';

export const User = {
    userTypeDef,
    userQueries,
    userMutations,
    userResolver: resolvers,
};