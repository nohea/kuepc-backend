import { gqlRequest, gql } from './graphql-client.js';
import { Petitioner } from '../models/Petitioner.js';

export async function insertPetitioner(pet: Petitioner, role: string, jwt_token: string) {
    console.log("insertPetitioner()");

    // if (!jwt_token) {
    //     return;
    // }

    let params: { [key: string]: any } = {
        family_name: pet.family_name?.trim(),
        given_name: pet.given_name?.trim(),
        prefix: pet.prefix?.trim(),
        age: pet.age?.trim(),
        page: pet.page?.trim(),
        line: pet.line?.trim(),
        island: pet.island?.trim(),
        district: pet.district?.trim(),
        gender: pet.gender?.trim(),
    };
    console.log("params: ", params);

    const query = gql`
        mutation createPet($object: kuepc_petitioner_insert_input!) {
            insert_kuepc_petitioner_one(object: $object) {
                given_name
                family_name
                prefix
                age
                page
                line
                island
                district
                gender
            }
        }
    `;
    const variables = {
        object: params,
    };

    let addHeaders = {
        "x-hasura-role": role
    };

    return await gqlRequest(query, variables, jwt_token, addHeaders);
}

export async function get_petitioner_by_pk(pet_id: number, role: string, jwt_token: string) {
    console.log(`get_petitioner_by_pk(${pet_id}, role, jwt_token)`);

    const query = gql`
    query get_petitioner_by_pk($pet_id:Int!) {
        kuepc_petitioner_by_pk(pet_id: $pet_id) {
            pet_id
            given_name
            family_name
            prefix
            age
            page
            line
            island
            district
            gender
        }
      }
    `;
    const variables = {
        pet_id: pet_id,
    };

    let addHeaders = {
        "x-hasura-role": role
    };

    return await gqlRequest(query, variables, jwt_token, addHeaders);
}

