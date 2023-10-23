"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutations = void 0;
exports.mutations = `#graphql
    followUser(to: ID!): Boolean
    unfollowUser(to: ID!): Boolean
`;
