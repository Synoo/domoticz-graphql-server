const { GraphQLString, GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLNonNull, GraphQLSchema } = require('graphql');
const axios = require('axios');
const _ = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = `
  type LightSwitch {
    idx: Int!,
    Name: String
  }

  type TemperatureGas {
    d: String!,
    tm: Float,
    te: Float,
    ta: Float,
    gas(interval: String): Float
  }

  type Query {
    allLightSwitches: [LightSwitch],
    temperatureGas(interval: String): [TemperatureGas]
  }
`;

const resolvers = {
  Query: {
    allLightSwitches: () => axios.get('http://synoo:synoo@192.168.178.101:8080/json.htm?type=command&param=getlightswitches').then(function (response) {
      return response.data.result
    }),
    temperatureGas: (_, {interval}) => axios.get('http://synoo:synoo@192.168.178.101:8080/json.htm?type=graph&sensor=temp&idx=29&range=' + interval).then(function (response) {
      return response.data.result
    })
  },
  TemperatureGas: {
    gas: (temp, {interval}) => axios.get('http://synoo:synoo@192.168.178.101:8080/json.htm?type=graph&sensor=counter&idx=7&range=' + interval).then(function (response) {
      return _.find(response.data.result, { 'd': temp.d}).v
    })
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = schema;

