import Order from '../models/orderModel';
import { ApiError, serverError } from '../helpers/index';
import Car from '../models/carModel';

export default class OrderController {
  static create(req, res) {
    try {
      if (Car.getCarByID(req.body.car_id) === undefined) {
        throw new ApiError('Car Doesn\'t Exist For Purchase', 400);
      }
      const ownerCars = Car.getCarByOwner(req.user.id);
      if (ownerCars.some(car => car.id === req.body.car_id)) {
        throw new ApiError('Cannot Purchase Your Car', 400);
      }
      req.body.buyer = req.user.id;
      const data = Order.createOrder(req.body);
      return res.status(201).send({
        status: 201,
        data,
        message: 'Purchase Order Successfully Created',
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
}
