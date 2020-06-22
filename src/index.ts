import app from './app';
import { PORT } from './config';
import mongoose from 'mongoose';
import { MongoNetworkError } from 'mongodb';
import * as os from 'os';

const bootstrap = async () => {
    try {
        const mongooseInstance = await mongoose.connect(
            'mongodb://localhost:27017/contactApp',
            { useUnifiedTopology: true, useNewUrlParser: true }
        );
        mongooseInstance.set('debug', true);

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