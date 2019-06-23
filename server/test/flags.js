// eslint-disable-next-line import/no-extraneous-dependencies
import { use, expect, request } from 'chai';
// eslint-disable-next-line import/no-extraneous-dependencies
import chaiHttp from 'chai-http';
import app from '../../app';
import Flag from '../models/flagModel';
import { adminAuth } from './auth';
import authHeader from './cars';

use(chaiHttp);

const API_V1_PRFEIX = '/api/v1';

const flag = {
  car_id: 1,
  reason: 'Seems suspicious',
  description: 'Called the owner multiple times to meet up',
};

describe('Create a flag for a car ad', () => {
  it('Flag should have valid parameters', () => {
    const newFlag = {
      car: 2,
      reason: 'I just dont\'t like the car',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/flag/`)
      .send(newFlag)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid Flag Form');
        expect(res.body.success).to.equal(false);
      });
  });

  it('Should create flag', () => {
    request(app)
      .post(`${API_V1_PRFEIX}/flag/`)
      .send(flag)
      .end((err, res) => {
        const flags = Flag.getFlags();
        const newFlag = Flag.findById(res.body.data.id);
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(flags.length).to.not.equal(0);
        expect(newFlag.id).to.equal(res.body.data.id);
        expect(newFlag.car_id).to.equal(res.body.data.car_id);
        expect(newFlag.reason).to.equal(res.body.data.reason);
        expect(newFlag.description).to.equal(res.body.data.description);
      });
  });
});

describe('Admin view all flags', () => {
  it('Should not allow unauthorized users', () => {
    request(app)
      .get(`${API_V1_PRFEIX}/flag/`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Unauthorizerd Access, Provide Valid Token');
      });
  });

  it('User should provide a token', () => {
    request(app)
      .get(`${API_V1_PRFEIX}/flag/`)
      .set({ authorization: null })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('No Authorization Token Provided');
      });
  });

  it('Only admin can view all flags', () => {
    request(app)
      .get(`${API_V1_PRFEIX}/flag/`)
      .set(authHeader)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.equal('Only Admin Has Access');
      });
  });

  it('Admin can view all flags', () => {
    request(app)
      .get(`${API_V1_PRFEIX}/flag/`)
      .set(adminAuth)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal(200);
        expect(res.body.success).to.equal(true);
      });
  });
});

describe('View a flag', () => {
  it('Should not allow unauthorized users', () => {
    request(app)
      .get(`${API_V1_PRFEIX}/flag/1`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Unauthorizerd Access, Provide Valid Token');
      });
  });

  it('User should provide a token', () => {
    request(app)
      .get(`${API_V1_PRFEIX}/flag/1`)
      .set({ authorization: null })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('No Authorization Token Provided');
      });
  });

  it('Only admin can view all flags', () => {
    request(app)
      .get(`${API_V1_PRFEIX}/flag/1`)
      .set(authHeader)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.equal('Only Admin Has Access');
      });
  });

  it('Cannot view a flag that does not exist', () => {
    request(app)
      .get(`${API_V1_PRFEIX}/flag/20`)
      .set(adminAuth)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.status).to.equal(404);
        expect(res.body.message).to.equal('Cannot Find This Flag');
        expect(res.body.success).to.equal(false);
      });
  });

  it('Should return all information about flag', () => {
    request(app)
      .get(`${API_V1_PRFEIX}/flag/1`)
      .set(adminAuth)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal(200);
        const foundFlag = Flag.findById(res.body.data.id);
        expect(foundFlag).to.not.equal(null);
        expect(foundFlag.car_id).to.equal(res.body.data.car_id);
        expect(foundFlag.reason).to.equal(res.body.data.reason);
        expect(foundFlag.description).to.equal(res.body.data.description);
      });
  });
});
