/* Here a simple schema is constructed without using the GraphQL query language. 
  e.g. using 'new GraphQLObjectType' to create an object type 
*/

let {
  // These are the basic GraphQL types need in this tutorial
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  // This is used to create required fileds and arguments
  GraphQLNonNull,
  // This is the class we need to create the schema
  GraphQLSchema,
} = require('graphql');
const axios = require('axios');

const LigthSwitchType = new GraphQLObjectType({
    name: "LightSwitch",
    description: "This represents an lightSwitch",
    fields: () => ({
      Name: {type: new GraphQLNonNull(GraphQLString)},
      idx: {type: new GraphQLNonNull(GraphQLString)}
    })
});

const TemperatureType = new GraphQLObjectType({
  name: "TemperatureType",
  description: "This represents an Temperature",
  fields: () => ({
    d: {type: new GraphQLNonNull(GraphQLString)},
    ta: {type: new GraphQLNonNull(GraphQLFloat)},
    te: {type: new GraphQLNonNull(GraphQLFloat)},
    tm: {type: new GraphQLNonNull(GraphQLFloat)}
  })
});

// This is the Root Query
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
      temperatureMonthly: {
        type: new GraphQLList(TemperatureType),
        description: "List of monthly TemperatureType",
        resolve: function() {
            const temperatureMonthly = axios.get('http://synoo:synoo@192.168.178.101:8080/json.htm?type=graph&sensor=temp&idx=29&range=month').then(function (response) {
                return response.data.result
            })
  
            return temperatureMonthly;
        }
      }
    })
  });

const Schema = new GraphQLSchema({
    query: RootType
});

module.exports = Schema;

