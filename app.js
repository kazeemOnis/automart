import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import Debug from 'debug';

import { config } from 'dotenv';
import routes from './server/routes/index';

config();

const debug = Debug('http');

const app = express();

const port = process.env.PORT || 3000;

app.use(logger('dev'));

app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

const resp = {
  status: 404,
  message: 'Resource cannot be found',
  success: false,
};

const API_V1_PREFIX = '/api/v1';

app.use(API_V1_PREFIX, routes);

app.use('*', (req, res) => {
  res.status(404).json(resp);
});


app.listen(port, () => {
  debug(`Server listening on port ${port}`);
});


export default app;
