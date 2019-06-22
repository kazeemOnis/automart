import { serverError } from '../helpers';
import Flag from '../models/flagModel';

export default class FlagController {
  static create(req, res) {
    try {
      const data = Flag.createFlag(req.body);
      return res.status(200).send({
        status: 200,
        data,
        success: true,
      });
    } catch (err) {
      return res.status(serverError.status).send(serverError);
    }
  }
}
