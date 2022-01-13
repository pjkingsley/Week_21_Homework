const { AuthenticationError } = require('apollo-server-express');
const { Profile } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        profiles: async () => {
            return Profile.find();
        },

        profile: async (parent, { profileID}) => {
            return Profile.findOne({ _id: profileID });
        },

        me: async (parent, args, context) => {
            if (context.user) {
                reurn Profile.findOne({ _id: context.user._id });
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },

    Mutation: {
        addProfile: async (parent, { name, email, password }) => {
            const profile = await Profile.create({ name, email, password });
            const token = signToken(profile);
            return { token, profile };
        },
        login: async (parent, { email, password }) => {
            const profile = await Profile.findOne({ email });
            if (!profile) {
                throw new AuthenticationError('No profile with this email found!');
            };
            const correctPw = await profile.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect password!');
            };
            const token = signToken(profile);
            return { token, profile };
        }
    },

    addBook: async (parent, { profileId, book }, context) => {
        if (context.user) {
            return Profile.findOneAndUpdate(
                { _id: profileId },
                {
                  $addToSet: { books: book },
                },
                {
                  new: true,
                  runValidators: true,
                }
            );
        };
    },

    removeBook: async (parent, { book }, context) => {
        if (context.user) {
            return Profile.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { books: book }},
                {new: true }
            );
        };
    },
};

module.exports = resolvers;