import { ApolloServer, gql } from 'apollo-server-micro';
import dbConnect from '@lib/dbConnect';
import register from '@gql/resolvers/mutations/register';
import login from '@gql/resolvers/mutations/login';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import type { NextApiRequest, NextApiResponse } from 'next';
import User from '@models/User';
import { req, JwtPayload } from '@lib/types';

const typeDefs = gql`
  type Query {
  type Mutation {
    register(username: String!, email: String!, password: String!): String!
    login(email: String!, password: String!): String!
  }
  }
`;

const resolvers = {
  Query: {},
  Mutation: {
    register,
    login,
  },
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

const startServer = apolloServer.start();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Origin',
    'https://studio.apollographql.com'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }

  await startServer;
  await apolloServer.createHandler({
    path: '/api/gql',
  })(req, res);
}

export const config = {
  api: {
    bodyParser: false,
  },
};
