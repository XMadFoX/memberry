import { ApolloServer, gql } from 'apollo-server-micro';
import dbConnect from '../../lib/dbConnect';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {},
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

const startServer = apolloServer.start();

export default async function handler(req: any, res: any) {
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
