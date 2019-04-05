const graphql = require('graphql');
const {
    GraphQLObjectType, GraphQLString, GraphQLID, GraphQLBoolean,
    GraphQLFloat, GraphQLList, GraphQLSchema } = graphql;
const _ = require('lodash');
const cassandra = require('cassandra-driver');

// connect to cassandra database 
const client = new cassandra.Client({ contactPoints: ['127.0.0.1'], keyspace: 'jerseys237', localDataCenter: 'datacenter1' });
client.connect((err, result) => {
    console.log('Cassandra connected');
});

const ResultType = new GraphQLObjectType({
    name: 'Result',
    fields: () => ({
        status: { type: GraphQLBoolean }
    })
});

const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        prod_id: { type: GraphQLID },
        available: { type: GraphQLFloat },
        description: { type: GraphQLString },
        discount: { type: GraphQLFloat },
        league: { type: GraphQLString },
        picture: { type: GraphQLString },
        price: { type: GraphQLFloat },
        team_country: { type: GraphQLString },
        team_crest: { type: GraphQLString },
        team_name: { type: GraphQLString },
        team_region: { type: GraphQLString },
        title: { type: GraphQLString }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        user_id: { type: GraphQLID },
        birthdate: { type: GraphQLString },
        email: { type: GraphQLString },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        password: { type: GraphQLString },
        phone: { type: GraphQLString },
        role: { type: GraphQLString },
        username: { type: GraphQLString }
    })
});

const ProductReportType = new GraphQLObjectType({
    name: 'ProductReport',
    fields: () => ({
        prod_id: { type: GraphQLID },
        time: { type: GraphQLString },
        comment: { type: GraphQLString },
        operation: { type: GraphQLString },
        prod_qty: { type: GraphQLFloat },
        prod_title: { type: GraphQLString }
    })
});

const CustomersWhoPurchasedProductType = new GraphQLObjectType({
    name: 'CustomersWhoPurchasedProduct',
    fields: () => ({
        prod_id: { type: GraphQLID },
        time: { type: GraphQLString },
        cust_birthdate: { type: GraphQLString },
        cust_email: { type: GraphQLString },
        cust_id: { type: GraphQLID },
        cust_phone: { type: GraphQLID },
        cust_username: { type: GraphQLString },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        prod_title: { type: GraphQLString },
        purchased_qty: { type: GraphQLFloat }
    })
});

const CustomersWhoCartedProductType = new GraphQLObjectType({
    name: 'CustomersWhoCartedProduct',
    fields: () => ({
        prod_id: { type: GraphQLID },
        time: { type: GraphQLString },
        cust_birthdate: { type: GraphQLString },
        cust_email: { type: GraphQLString },
        cust_id: { type: GraphQLID },
        cust_username: { type: GraphQLString },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        prod_title: { type: GraphQLString }
    })
});

const ProductsCartedByCustomerType = new GraphQLObjectType({
    name: 'ProductsCartedByCustomer',
    fields: () => ({
        cust_id: { type: GraphQLID },
        time: { type: GraphQLString },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        prod_discount: { type: GraphQLFloat },
        prod_id: { type: GraphQLID },
        prod_picture: { type: GraphQLString },
        prod_price: { type: GraphQLFloat },
        prod_title: { type: GraphQLString },
        team_crest: { type: GraphQLString },
        team_name: { type: GraphQLString }
    })
});

const ProductsPurchasedByCustomerType = new GraphQLObjectType({
    name: 'ProductsPurchasedByCustomer',
    fields: () => ({
        cust_id: { type: GraphQLID },
        time: { type: GraphQLString },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        prod_discount: { type: GraphQLFloat },
        prod_id: { type: GraphQLID },
        prod_league: { type: GraphQLString },
        prod_picture: { type: GraphQLString },
        prod_price: { type: GraphQLFloat },
        prod_title: { type: GraphQLString },
        purchased_qty: { type: GraphQLFloat },
        team_crest: { type: GraphQLString },
        team_name: { type: GraphQLString }
    })
});

// root Query
const Query = new GraphQLObjectType({
    name: 'Query',
    fields: {
        product: {
            type: ProductType,
            args: { prod_id: { type: GraphQLID } },
            resolve(parent, args) {
                const query = 'SELECT * FROM product WHERE prod_id = ?';
                return client.execute(query, [args.prod_id])
                    .then(result => {
                        // return _.filter(products, {prod_id: args.prod_id})
                        return result.first();
                    });
            }
        },
        product_by_league: {
            type: new GraphQLList(ProductType),
            args: { league: { type: GraphQLString } },
            resolve(parent, args) {
                const query = 'SELECT * FROM product WHERE league = ? ALLOW FILTERING';
                return client.execute(query, [args.league])
                    .then(result => {
                        return result.rows;
                    });
            }
        },
        product_by_team_name: {
            type: new GraphQLList(ProductType),
            args: { team_name: { type: GraphQLString } },
            resolve(parent, args) {
                const query = 'SELECT * FROM product WHERE team_name = ? ALLOW FILTERING';
                return client.execute(query, [args.team_name])
                    .then(result => {
                        return result.rows;
                    });
            }
        },
        products: {
            type: new GraphQLList(ProductType),
            resolve(parent, args) {
                const query = 'SELECT * FROM product';
                return client.execute(query, [])
                    .then(result => {
                        return result.rows;
                    });
            }
        },
        user: {
            type: UserType,
            args: { user_id: { type: GraphQLID } },
            resolve(parent, args) {
                // code to get data from datasource  
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve(parent, args) {
                // code to get data from datasource 
                return products;
            }
        },
        product_report: {
            type: ProductReportType,
            args: { prod_id: { type: GraphQLID } },
            resolve(parent, args) {
                // code to get data from datasource   
            }
        },
        customers_whopurchased_product: {
            type: CustomersWhoPurchasedProductType,
            args: { prod_id: { type: GraphQLID } },
            resolve(parent, args) {
                // code to get data from datasource  ProductReportType
            }
        },
        customers_whocarted_product: {
            type: CustomersWhoCartedProductType,
            args: { prod_id: { type: GraphQLID } },
            resolve(parent, args) {
                // code to get data from datasource  ProductReportType
            }
        },
        products_cartedby_customer: {
            type: ProductsCartedByCustomerType,
            args: { cust_id: { type: GraphQLID } },
            resolve(parent, args) {
                // code to get data from datasource  ProductReportType
            }
        },
        products_purchasedby_customer: {
            type: ProductsPurchasedByCustomerType,
            args: { cust_id: { type: GraphQLID } },
            resolve(parent, args) {
                // code to get data from datasource  ProductReportType
            }
        }
    }
});

// root Mutation
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        add_product: {
            type: ProductType,
            args: {
                available: { type: GraphQLFloat },
                description: { type: GraphQLString },
                discount: { type: GraphQLFloat },
                league: { type: GraphQLString },
                picture: { type: GraphQLString },
                price: { type: GraphQLFloat },
                team_country: { type: GraphQLString },
                team_crest: { type: GraphQLString },
                team_name: { type: GraphQLString },
                team_region: { type: GraphQLString },
                title: { type: GraphQLString }
            },
            resolve(parent, args) {
                const prod_id = cassandra.types.TimeUuid.fromDate(new Date());
                const query = 'INSERT INTO product(prod_id, available, description, discount, league, picture,'
                    + 'price, team_country, team_crest, team_name, team_region, title) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
                return client.execute(query, [prod_id, args.available, args.description, args.discount, args.league, args.picture,
                    args.price, args.team_country, args.team_crest, args.team_name, args.team_region, args.title], { prepare: true })
                    .then(result => {
                        const query = 'SELECT * FROM product WHERE prod_id = ?';
                        return client.execute(query, [prod_id], { prepare: true })
                            .then(result => {
                                return result.first();
                            });
                    });
            }
        },
        update_product: {
            type: ProductType,
            args: {
                prod_id: { type: GraphQLID },
                available: { type: GraphQLFloat },
                description: { type: GraphQLString },
                discount: { type: GraphQLFloat },
                league: { type: GraphQLString },
                picture: { type: GraphQLString },
                price: { type: GraphQLFloat },
                team_country: { type: GraphQLString },
                team_crest: { type: GraphQLString },
                team_name: { type: GraphQLString },
                team_region: { type: GraphQLString },
                title: { type: GraphQLString }
            },
            resolve(parent, args) {
                const query = 'INSERT INTO product(prod_id, available, description, discount, league, picture,'
                    + 'price, team_country, team_crest, team_name, team_region, title) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)';
                return client.execute(query, [args.prod_id, args.available, args.description, args.discount, args.league, args.picture,
                args.price, args.team_country, args.team_crest, args.team_name, args.team_region, args.title], { prepare: true })
                    .then(result => {
                        const query = 'SELECT * FROM product WHERE prod_id = ?';
                        return client.execute(query, [args.prod_id], { prepare: true })
                            .then(result => {
                                return result.first();
                            });
                    });
            }
        },
        remove_product: {
            type: ResultType,
            args: { prod_id: { type: GraphQLID } },
            resolve(parent, args) {
                const query = 'DELETE FROM product WHERE prod_id = ?';
                return client.execute(query, [args.prod_id], { prepare: true })
                    .then(result => {
                        return { status: true };
                    });
            }
        }
    }
});


module.exports = new GraphQLSchema({
    query: Query,
    mutation: Mutation
})