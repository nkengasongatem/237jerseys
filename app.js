const express = require('express');
const graphqlExpress = require('express-graphql');
const schema = require('./schema/schema');

const app = express();

app.use('/graphql', graphqlExpress({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('Listening to port 4000');
});
