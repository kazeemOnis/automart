import Order from '../models/orderModel';
import { ApiError } from '../helpers/index';
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
        success: true,
      });
    } catch (err) {
      return res.status(err.status).send(
        { status: err.status, message: err.message, success: err.success },
      );
    }
  }

  static updatePrice(req, res) {
    try {
      const { id: buyer } = req.user;
      const id = parseInt(req.params.order_id, 10);
      const order = Order.findById(id);
      const data = { ...order };
      const { amount: oldAmount, status } = data;
      const { amount: newAmount } = req.body;
      if (order === undefined) {
        throw new ApiError('Order Doesn\'t Exist For Update', 400);
      }
      if (order.buyer !== buyer) {
        throw new ApiError('Only The Actual Buyer Can Update', 401);
      }
      if (status !== 'pending') {
        throw new ApiError('Only Pending Orders Can be Updated', 400);
      }
      const message = Order.updatePrice(id, newAmount);
      data.oldPriceOffered = oldAmount;
      data.newPriceOffered = newAmount;
      delete data.amount;
      return res.status(200).send({
        status: 200,
        data,
        message,
        success: true,
      });
    } catch (err) {
      return res.status(err.status).send(
        { status: err.status, message: err.message, success: err.success },
      );
    }
  }
}
