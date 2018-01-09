/* Here a simple schema is constructed without using the GraphQL query language. 
  e.g. using 'new GraphQLObjectType' to create an object type 
*/

let {
  // These are the basic GraphQL types need in this tutorial
  GraphQLString,
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

// This is the Root Query
const LightSwitchRootType = new GraphQLObjectType({
    name: 'LightSwitchSchema',
    description: "Lightswitch",
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
      }
    })
  });

const LightSwitchSchema = new GraphQLSchema({
    query: LightSwitchRootType
});

module.exports = LightSwitchSchema;