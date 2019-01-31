const { ApolloServer, gql } = require("apollo-server");
//gql takes schema and turns it into an object / abstract syntax tree

const lifts = require("./data/lifts.json");
const trails = require("./data/trails.json");
//need schema and resolvers
const typeDefs = gql`
type Lift {
  id: ID!
  name: String
  status: LiftStatus!
  capacity: Int
  night: Boolean
  elevationGain: Int
  url: String!
}
enum LiftStatus {
  OPEN
  CLOSED
  HOLD
}
  type Query {
    allLifts: [Lift!]!
    findLiftById(id: ID!): Lift!
  }
  type Mutation {
    setLiftStatus(id: ID! status: LiftStatus!): Lift!
  }
`;

//resolvers are just functions that live on the Server
const resolvers = {
  Query: {
    allLifts: () => lifts,
    findLiftById: (parent, args) =>
    lifts.find(lift => args.id === lift.id)
  },
  Mutation: {
    setLiftStatus: (parent, {id, status}) => {
      let updatedLift = lifts.find(lift => id === lift.id)
      updatedLift.status = status;
      return updatedLift;
    }
  },
  Lift: {
    url: parent => `/lifts/${parent.id}.html`
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({url}) => console.log(`Server running on ${url}`));
