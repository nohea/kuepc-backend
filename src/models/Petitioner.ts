export class Petitioner {
    pet_id: number|undefined;
    family_name: string|undefined;
    given_name: string|undefined;
    prefix: string|undefined;
    age: string|undefined;
    page: string|undefined;
    line: string|undefined;
    island: string|undefined;
    district: string|undefined;
    gender: string|undefined;
    create_timestamp: Date|undefined;

    public constructor(init?:Partial<Petitioner>) {
        Object.assign(this, init);
    }
}
