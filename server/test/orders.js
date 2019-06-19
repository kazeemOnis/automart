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
      .post(`${API_V1_PRFEIX}/car`)
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
        expect(res.body.data.status).to.equal('Pending');
        expect(createdOrder.status).to.equal(res.body.data.status);
      });
  });
});
