const { GraphQLString, GraphQLFloat, GraphQLList, GraphQLObjectType, GraphQLNonNull, GraphQLSchema } = require('graphql');
const axios = require('axios');
const _ = require('lodash');

const LigthSwitchType = new GraphQLObjectType({
    name: "LightSwitch",
    description: "This represents an lightSwitch",
    fields: () => ({
      Name: {type: new GraphQLNonNull(GraphQLString)},
      idx: {type: new GraphQLNonNull(GraphQLString)}
    })
});

const TemperatureGasType = new GraphQLObjectType({
  name: "TemperatureGasType",
  description: "This represents an TemperatureGas",
  fields: () => ({
    d: {type: new GraphQLNonNull(GraphQLString)},
    tm: {type: new GraphQLNonNull(GraphQLFloat)},
    ta: {type: new GraphQLNonNull(GraphQLFloat)},
    te: {type: new GraphQLNonNull(GraphQLFloat)},
    gas: {
      type: GraphQLString,
      resolve: function(temp) {
        const gasMonthly = axios.get('http://synoo:synoo@192.168.178.101:8080/json.htm?type=graph&sensor=counter&idx=7&range=month').then(function (response) {
              return _.find(response.data.result, { 'd': temp.d}).v
            })

        return gasMonthly;
      }
    }
  })
});

const RootType = new GraphQLObjectType({
    name: 'RootTypeSchema',
    description: "RootTypeSchema",
    fields: () => ({
      allLightSwitches: {
        type: new GraphQLList(LigthSwitchType),
        description: "List of all Lightswitches",
        resolve: function() {
            const lightSwitches = axios.get('http://synoo:synoo@192.168.178.101:8080/json.htm?type=command&param=getlightswitches').then(function (response) {
                return response.data.result
            })

            return lightSwitches;
        }
      },
      temperatureGasMonthly: {
        type: new GraphQLList(TemperatureGasType),
        description: "List of monthly TemperatureGasType",
        resolve: function() {
            const temperatureGasMonthly = axios.get('http://synoo:synoo@192.168.178.101:8080/json.htm?type=graph&sensor=temp&idx=29&range=month').then(function (response) {
                return response.data.result
            })
  
            return temperatureGasMonthly;
        }
      }
    })
  });

const Schema = new GraphQLSchema({
    query: RootType
});

module.exports = Schema;

