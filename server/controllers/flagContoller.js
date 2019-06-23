import { serverError, ApiError } from '../helpers';
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

  static getAll(req, res) {
    try {
      const data = Flag.getFlags();
      return res.status(200).send({
        status: 200,
        data,
        success: true,
      });
    } catch (err) {
      return res.status(serverError.status).send(serverError);
    }
  }

  static get(req, res) {
    try {
      const id = parseInt(req.params.flag_id, 10);
      const data = Flag.findById(id);
      if (data === undefined) {
        throw new ApiError('Cannot Find This Flag', 404);
      }
      return res.status(200).send({
        status: 200,
        data,
      });
    } catch (err) {
      return res.status(err.status).send(
        { status: err.status, message: err.message, success: err.success },
      );
    }
  }
}
