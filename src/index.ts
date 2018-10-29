import { app, connectDatabase, initDatabase } from './refs';

connectDatabase();
initDatabase();
const port = process.env.PORT || 4000;
app.listen(port, () => console.log('SERVER STARTED SUCCESSFULLY!'));
