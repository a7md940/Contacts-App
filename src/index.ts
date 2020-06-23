import app from './app';
import { PORT } from './config';
import { MongoNetworkError } from 'mongodb';
import * as os from 'os';
import { connectDatabase } from './presistence/mongo/db-instance';

const bootstrap = async () => {
    try {
        const mongoose = await connectDatabase();
        console.log('Mongoose connection established !!');

        app.listen(PORT, () => console.log(`App listening on ${os.hostname}:${PORT}`));
    } catch (exc) {
        if (exc instanceof MongoNetworkError) { 
            console.log('Faild to connect to the database!!');
        } else {
            console.error(exc);
        }
        
    }
};

bootstrap();