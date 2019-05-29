import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import Debug from 'debug';
import { config } from 'dotenv';

config();

const debug = Debug('http');

const app = express();

const port = process.env.PORT || 3000;

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.listen(port, () => {
    debug(`Server listening on port ${port}`)
});