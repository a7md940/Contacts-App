import { ConnectionOptions, connect, Connection } from 'mongoose';
import * as config from '../../config';

const MONGO_URI = process.env.MONGO_URI || `mongodb://localhost:27017/contactApp`;
const dbConnectionOptoins: ConnectionOptions = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
};
const setMongooseOptions = async (instance: any): ReturnType<typeof connect> => {
    if (!config.PRODUCTION) {
        instance.set('debug', true);
    }
    return instance;
}

const connectProcess = connect(MONGO_URI, dbConnectionOptoins)
.then(setMongooseOptions);

export const connectDatabase = async () => {
    let mongoose;
    if (!mongoose) {
        mongoose = await connectProcess;
        return mongoose;
    } else {
        return mongoose;
    }
};

export const getdbConnection = async (): Promise<Connection> => (await connectDatabase()).connection;



