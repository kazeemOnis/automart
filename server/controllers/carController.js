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

  static getCar(req, res) {
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
      return res.status(err.status).send(
        { status: err.status, message: err.message, success: err.success },
      );
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
        message: 'Car Successfully Sold',
      });
    } catch (err) {
      return res.status(err.status).send(
        { status: err.status, message: err.message, success: err.success },
      );
    }
  }

  static updatePrice(req, res) {
    try {
      const { id: user } = req.user;
      const id = parseInt(req.params.car_id, 10);
      const data = Car.getCarByID(id);
      const { price } = req.body;
      if (data === undefined) {
        throw new ApiError('Car Doesn\'t Exist', 400);
      }
      if (data.owner !== user) {
        throw new ApiError('Only The Actual Seller Can Update Price', 401);
      }
      const car = Car.updatePrice(data.id, price);
      return res.status(200).send({
        status: 200,
        data: car,
        message: 'Car Price Successfully Updated',
      });
    } catch (err) {
      return res.status(err.status).send(
        { status: err.status, message: err.message, success: err.success },
      );
    }
  }

  static filter(req, res) {
    try {
      let data = Car.getCars();
      const { query } = req;
      const minPrice = parseInt(query.min_price, 10);
      const maxPrice = parseInt(query.max_price, 10);
      const keys = Object.keys(query);
      let filterPrice = false;
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        if (filterPrice) {
          break;
        } else if (key === 'min_price' || key === 'max_price') {
          data = Car.filterPrice(data, minPrice, maxPrice);
          filterPrice = true;
        } else {
          data = Car.filter(data, key, query[key]);
        }
      }
      return res.status(200).send({
        status: 200,
        data,
        success: true,
      });
    } catch (err) {
      return res.status(serverError.status).send(serverError);
    }
  }

  static deleteCar(req, res) {
    try {
      const id = parseInt(req.params.car_id, 10);
      const car = Car.getCarByID(id);
      if (car === undefined) {
        throw new ApiError('Car Doesn\'t Exist', 400);
      }
      const data = Car.deleteCar(id);
      return res.status(200).send({
        status: 200,
        data,
        success: true,
      });
    } catch (err) {
      return res.status(err.status).send(
        { status: err.status, message: err.message, success: err.success },
      );
    }
  }
}
