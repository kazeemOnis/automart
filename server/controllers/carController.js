import { config } from 'dotenv';
import { v2 } from 'cloudinary';
import { serverError, ApiError } from '../helpers';
import Car from '../models/carModel';
import { dataUri } from '../helpers/multer';

config();

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


export default class CarController {
  static async create(req, res) {
    try {
      req.body.owner = req.user.id;
      req.body.owner_email = req.user.email;
      if (req.files !== undefined && req.files !== null) {
        const files = req.files.map(
          file => v2.uploader.upload(dataUri(file).content),
        );
        const images = await Promise.all(files);
        req.body.images = images;
      }
      const data = Car.createCar(req.body);
      return res.status(201).send({
        status: 201,
        data,
        message: 'Car Successfully Created',
      });
    } catch (err) {
      return res.status(serverError.status).send(serverError);
    }
  }

  static get(req, res) {
    try {
      const id = parseInt(req.params.car_id, 10);
      const data = Car.getCarByID(id);
      if (data === undefined) {
        throw new ApiError('Cannot Find This Car', 404);
      }
      return res.status(200).send({
        status: 200,
        data,
        message: 'Car Successfully Found',
      });
    } catch (err) {
      if (err.name === 'ApiError') {
        return res.status(err.status).send(
          { status: err.status, message: err.message, success: err.success },
        );
      }
      return res.status(serverError.status).send(serverError);
    }
  }

  static sell(req, res) {
    try {
      const { id: user } = req.user;
      const id = parseInt(req.params.car_id, 10);
      const data = Car.getCarByID(id);
      if (data === undefined) {
        throw new ApiError('Car Doesn\'t Exist', 400);
      }
      if (data.owner !== user) {
        throw new ApiError('Only The Actual Seller Can Sell', 401);
      }
      if (data.status === 'sold') {
        throw new ApiError('Car Already Sold', 400);
      }
      const car = Car.sellCar(data.id);
      return res.status(200).send({
        status: 200,
        data: car,
        message: 'Car Successfully Found',
      });
    } catch (err) {
      return res.status(err.status).send(
        { status: err.status, message: err.message, success: err.success },
      );
    }
  }
}
