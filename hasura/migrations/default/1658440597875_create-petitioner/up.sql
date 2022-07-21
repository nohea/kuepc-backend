
CREATE TABLE kuepc.petitioner (
    pet_id integer NOT NULL,
    family_name text NULL,
    given_name text NULL,
    prefix text NULL,
    age text NULL,
    page text NULL,
    line text NULL,
    island text NULL,
    district text NULL,
    gender text NULL,
    create_timestamp timestamp(3) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);
ALTER TABLE kuepc.petitioner OWNER TO kuepc;
CREATE SEQUENCE kuepc.petitioner_pet_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER TABLE kuepc.petitioner_pet_id_seq OWNER TO kuepc;
ALTER SEQUENCE kuepc.petitioner_pet_id_seq OWNED BY kuepc.petitioner.pet_id;
ALTER TABLE ONLY kuepc.petitioner
    ADD CONSTRAINT pk_petitioner PRIMARY KEY (pet_id);

ALTER TABLE ONLY kuepc.petitioner ALTER COLUMN pet_id SET DEFAULT nextval('kuepc.petitioner_pet_id_seq'::regclass);

CREATE INDEX petitioner_fname_unique_idx ON kuepc.petitioner USING btree (family_name);

CREATE INDEX petitioner_gname_unique_idx ON kuepc.petitioner USING btree (given_name);

CREATE INDEX petitioner_island_unique_idx ON kuepc.petitioner USING btree (island);
