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
    me: User
  }
  type Mutation {
    register(username: String!, email: String!, password: String!): String!
    login(email: String!, password: String!): String!
  }
  type User {
    _id: String
    username: String
    email: String
  }
`;

const resolvers = {
  Query: {
    me: async (parent: any, args: any, context: any) => {
      if (!context.req.user) return null;
      return context.req.user;
    },
  },
  Mutation: {
    register,
    login,
  },
};

const context = async ({ req, res }: { req: req; res: NextApiResponse }) => {
  if (req.cookies.token) {
    try {
      const payload: JwtPayload = jwt.verify(
        req.cookies.token,
        process.env.JWT_SECRET!
      ) as JwtPayload;
      const user = await User.findOne({
        _id: payload.userId,
      });
      if (user && (await bcrypt.compare(payload.password, user.password)))
        req.user = user;
    } catch (err) {
      console.log(err);
    }
  }
  return {
    req,
    res,
  };
};

const apolloServer = new ApolloServer({ typeDefs, resolvers, context });

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
