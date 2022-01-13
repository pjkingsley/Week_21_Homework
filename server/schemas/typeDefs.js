const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Profile {
        _id: ID
        name: String
        email: String
        password: String
        books: [String]!
    }

    type Auth {
        token: ID!
        profile: Profile
    }

    type Query {
        profiles: [Profile]!
        profile(profileID: ID!): Profile
        me: Profile
    }

    type Mutation {
        addProfile(name: String!, email: String!, password: String!): Auth
        login(email: String!, password; String!): Auth
        addBook(profileID: ID!, book: String!): Profile
        removeProfile: Profile
        removeBook(Book: String!): Profile
    }
`;

module.exports = typeDefs;