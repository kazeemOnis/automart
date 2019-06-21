// eslint-disable-next-line import/no-extraneous-dependencies
import { use, expect, request } from 'chai';
// eslint-disable-next-line import/no-extraneous-dependencies
import chaiHttp from 'chai-http';
import app from '../../app';
import Order from '../models/orderModel';
import authHeader from './cars';


use(chaiHttp);

const API_V1_PRFEIX = '/api/v1';
const newOrder = {
  car_id: 2,
  amount: 1500000,
};

const price = { amount: 2000 };

describe('Unauthorized users shouldn\'t be able to purchase', () => {
  it('Unauthorized user should be denied', () => {
    request(app)
      .post(`${API_V1_PRFEIX}/order`)
      .send(newOrder)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Unauthorizerd Access, Provide Valid Token');
      });
  });

  it('User should provide a token', () => {
    request(app)
      .post(`${API_V1_PRFEIX}/order`)
      .set({ authorization: null })
      .send(newOrder)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('No Authorization Token Provided');
      });
  });
});

describe('Create purcahse order', () => {
  it('Order should have valid properties', () => {
    const order = {
      payer: 2,
      car_id: 4,
      is419: true,
    };
    request(app)
      .post(`${API_V1_PRFEIX}/order`)
      .set(authHeader)
      .send(order)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Invalid Order Provided');
      });
  });

  it('Order should have valid amount', () => {
    const order = {
      car_id: 4,
      amount: '29000ee',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/order`)
      .set(authHeader)
      .send(order)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Invalid Amount, Please Enter Numbers Only');
      });
  });

  it('Should check if car exists', () => {
    const order = {
      car_id: 4,
      amount: 1000,
    };
    request(app)
      .post(`${API_V1_PRFEIX}/order`)
      .set(authHeader)
      .send(order)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Car Doesn\'t Exist For Purchase');
      });
  });

  it('User cannot purchase a car that is theirs', () => {
    const order = {
      car_id: 1,
      amount: 1000,
    };
    request(app)
      .post(`${API_V1_PRFEIX}/order`)
      .set(authHeader)
      .send(order)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Cannot Purchase Your Car');
      });
  });

  it('Should create a purchase order', () => {
    request(app)
      .post(`${API_V1_PRFEIX}/order`)
      .set(authHeader)
      .send(newOrder)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.status).to.equal(201);
        expect(Order.getOrders()).to.not.equal([]);
        const createdOrder = Order.findById(res.body.data.id);
        expect(createdOrder).to.not.equal(null);
        expect(createdOrder.car_id).to.equal(newOrder.car_id);
        expect(createdOrder.amount).to.equal(newOrder.amount);
        expect(res.body.data.status).to.equal('pending');
        expect(createdOrder.status).to.equal(res.body.data.status);
      });
  });
});

describe('Update order price', () => {
  it('Should not allow unauthorized users', () => {
    request(app)
      .patch(`${API_V1_PRFEIX}/order/1/price`)
      .send(price)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Unauthorizerd Access, Provide Valid Token');
      });
  });

  it('User should provide a token', () => {
    request(app)
      .patch(`${API_V1_PRFEIX}/order/1/price`)
      .set({ authorization: null })
      .send(price)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('No Authorization Token Provided');
      });
  });

  it('User should provide a valid amount', () => {
    const updatePrice = { amount: '2000ee' };
    request(app)
      .patch(`${API_V1_PRFEIX}/order/1/price`)
      .set(authHeader)
      .send(updatePrice)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Invalid Amount, Please Enter Numbers Only');
      });
  });

  it('User should provide a valid update form', () => {
    const updatePrice = { price: 50000 };
    request(app)
      .patch(`${API_V1_PRFEIX}/order/1/price`)
      .set(authHeader)
      .send(updatePrice)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Invalid Update Form');
      });
  });

  it('Cannot update order that does not exist', () => {
    request(app)
      .patch(`${API_V1_PRFEIX}/order/20/price`)
      .set(authHeader)
      .send(price)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Order Doesn\'t Exist For Update');
      });
  });

  it('Cannot update order that isn\'t pending', () => {
    request(app)
      .patch(`${API_V1_PRFEIX}/order/1/price`)
      .set(authHeader)
      .send(price)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Only Pending Orders Can be Updated');
      });
  });

  it('Only the actual buyer can update order', () => {
    request(app)
      .patch(`${API_V1_PRFEIX}/order/2/price`)
      .set(authHeader)
      .send(price)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Only The Actual Buyer Can Update');
      });
  });

  it('Update purchase order price', () => {
    request(app)
      .patch(`${API_V1_PRFEIX}/order/3/price`)
      .set(authHeader)
      .send(price)
      .end((err, res) => {
        const order = Order.findById(res.body.data.id);
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal('Successfully Updated Order Amount');
        expect(res.body.data).to.haveOwnProperty('newPriceOffered');
        expect(res.body.data).to.haveOwnProperty('oldPriceOffered');
        expect(order.amount).to.equal(price.amount);
      });
  });
});
