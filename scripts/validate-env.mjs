import envSchema from '../env.mjs';
import dotenv from 'dotenv';

dotenv.config();

function getZodSchemaFieldsShallow(schema) {
    const fields = {};
    const proxy = new Proxy(fields, {
        get(_, key) {
            if (key === 'then' || typeof key !== 'string') {
                return;
            }
            fields[key] = true;
        },
    });
    schema.safeParse(proxy);
    return fields;
}

console.log('List of possible environment variables: ')
Object.keys(getZodSchemaFieldsShallow(envSchema)).forEach(key => console.log(` - ${key} (${!!process.env[key] ? "present" : "not present"})`));
console.log('')
const result = envSchema.safeParse(process.env);

const {error} = result;
if (error) {
    console.error('');
    console.error(
        'Error while parsing environment variables:' +
        Object.entries(error.flatten().fieldErrors).map(([k, v]) => {
            return `\n - ${k}: ${v}`;
        }),
    );
    console.error('');

    process.exit(1);
}
console.log("Environment variables validated successfully.")