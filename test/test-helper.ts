import { connectDatabase } from '../src/refs';

before(async () => await connectDatabase())

beforeEach(async () => {
   
});
