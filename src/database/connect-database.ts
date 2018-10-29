import mongoose from 'mongoose';
import { DATABASE_URI } from '../refs';

mongoose.Promise = global.Promise;

export function connectDatabase() {
    return mongoose.connect(DATABASE_URI, { useMongoClient: true, promiseLibrary: global.Promise })
    .then(() => console.log(`DATABASE CONNECTED SUCCESSFULLY TO ${DATABASE_URI}.`))
    .catch(error => (console.log(error), process.exit(1)));
}
