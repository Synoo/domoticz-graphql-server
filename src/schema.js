const { GraphQLString, GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLNonNull, GraphQLSchema } = require('graphql');
const axios = require('axios');
const _ = require('lodash');
const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = `
  type LightSwitch {
    idx: Int!,
    Name: String
  }

  type TempDevice {
    idx: Int!,
    Name: String
  }

  type TemperatureUtility {
    d: String!,
    tm: Float,
    te: Float,
    ta: Float,
    gas(interval: String): Float,
    electricity(interval: String): Float
  }

  type Query {
    allLightSwitches: [LightSwitch],
    temperatureUtility(tempId: String, interval: String): [TemperatureUtility],
    allTempDevices: [TempDevice]
  }
`;

const resolvers = {
  Query: {
    allLightSwitches: () => axios.get('http://synoo:synoo@192.168.178.101:8080/json.htm?type=command&param=getlightswitches').then(function (response) {
      return response.data.result
    }),
    temperatureUtility: (_, {tempId, interval}) => axios.get('http://synoo:synoo@192.168.178.101:8080/json.htm?type=graph&sensor=temp&idx=' + tempId + '&range=' + interval).then(function (response) {
      return response.data.result
    }),
    allTempDevices: () => axios.get('http://synoo:synoo@192.168.178.101:8080/json.htm?type=devices&filter=temp&used=true&order=Name').then(function (response) {
      return response.data.result
    })
  },
  TemperatureUtility: {
    gas: (temp, {interval}) => axios.get('http://synoo:synoo@192.168.178.101:8080/json.htm?type=graph&sensor=counter&idx=7&range=' + interval).then(function (response) {
      if(response.data.result) {
        return _.find(response.data.result, { 'd': temp.d}).v
      }
    }),
    electricity: (temp, {interval}) => axios.get('http://synoo:synoo@192.168.178.101:8080/json.htm?type=graph&sensor=counter&idx=5&range=' + interval).then(function (response) {
      if(response.data.result) {
        result = _.find(response.data.result, { 'd': temp.d})
        return  parseFloat(result.v) + parseFloat(result.v2)
      }
    })
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

module.exports = schema;

