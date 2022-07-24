import { gql, gqlRequest } from "./lib/graphql-client.js";

console.log("Kūʻē Petition test query");

const HASURA_GRAPHQL_ENDPOINT = process.env.HASURA_GRAPHQL_ENDPOINT || '';
console.log("HASURA_GRAPHQL_ENDPOINT: ", HASURA_GRAPHQL_ENDPOINT);

let name = process.argv[2] || '';

// search by name parameter, exact match on family_name or given_name

const petitioners = await get_petitioner_by_name_search(name, 'public', '');

console.log(petitioners);




export async function get_petitioner_by_name_search(name: string, role: string, jwt_token: string) {
    console.log(`get_petitioner_by_name_search(${name}, role, jwt_token)`);

    const query = gql`
        query get_petitioner_by_name_search($name: String!) {
        petitioner(where: {_or: [
            {family_name: {_eq: $name}}, 
            {given_name: {_eq: $name}}
        ]}) {
            age
            district
            family_name
            gender
            given_name
            island
            line
            page
            prefix
        }
        }
    `;
    const variables = {
        name: name,
    };

    let addHeaders = {
        "x-hasura-role": role
    };

    return await gqlRequest(query, variables, jwt_token, addHeaders);
}

