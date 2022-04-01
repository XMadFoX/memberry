import { ApolloServer, gql } from 'apollo-server-micro';
import dbConnect from '../../lib/dbConnect';
import register from '../../gql/resolvers/mutations/register';

import type { NextApiRequest, NextApiResponse } from 'next';

const typeDefs = gql`
  type Query {
  type Mutation {
    register(username: String!, email: String!, password: String!): String!
  }
`;

const resolvers = {
  Query: {},
  Mutation: {
    register,
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
