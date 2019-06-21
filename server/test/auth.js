// eslint-disable-next-line import/no-extraneous-dependencies
import { use, expect, request } from 'chai';
// eslint-disable-next-line import/no-extraneous-dependencies
import chaiHttp from 'chai-http';
import app from '../../app';
import { propertyChecker } from '../helpers/index';
import User from '../models/userModel';

use(chaiHttp);

const API_V1_PRFEIX = '/api/v1';

const newUser = {
  firstName: 'Kazeem',
  lastName: 'Onisarotu',
  email: 'konisarotu@yahoo.com',
  address: 'Magodo Isheri Lagos',
  password: 'automart1234',
};

const userAuth = { authorization: null };
const adminAuth = { authorization: null };

const userProperties = ['id', 'firstName', 'email', 'token', 'lastName', 'address'];

describe('User Sign Up', () => {
  it('User should have property firstName, lastName, email, address, password', () => {
    expect(propertyChecker(newUser, 'firstName', 'email', 'password', 'lastName', 'address')).to.equal(true);
  });

  it('User should have not unwanted property', () => {
    expect(propertyChecker(newUser, 'username', 'name', 'hackUser')).to.equal(false);
  });

  it('Should check if signup form is valid', () => {
    const user = {
      firstName: 'Jimmy',
      lastName: 'Neutron',
      email: 'jimmy@automart.com',
      password: 'automart1234',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/auth/signup`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Invalid SignUp Form');
      });
  });

  it('Should check if firstname and surname are valid', () => {
    const user = {
      firstName: '1234',
      lastName: '123 5',
      email: 'user@automart.com',
      password: 'automart1234',
      address: 'Ikeja Lagos',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/auth/signup`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Fisrtname or Lastname Invalid');
      });
  });

  it('Should check if email is valid', () => {
    const user = {
      firstName: 'Thor',
      lastName: 'Ragnorok',
      email: 'thor@automart',
      password: 'automart1234',
      address: 'Asgard',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/auth/signup`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Invalid Email');
      });
  });

  it('Should check if password is valid', () => {
    const user = {
      firstName: 'Thor',
      lastName: 'Ragnorok',
      email: 'thor@automart.com',
      password: 'thor',
      address: 'Asgard',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/auth/signup`)
      .send(user)
      .end((err, res) => {
        const allUsers = User.getUsers();
        expect(allUsers.length).to.equal(0);
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Password must be 6 characters or more');
      });
  });

  it('Should sign up a new user', (done) => {
    const user = {
      firstName: 'Jimmy',
      lastName: 'Abaje',
      email: 'jimmiabaje@yahoo.com',
      address: 'Magodo Isheri Lagos',
      password: 'automart1234',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/auth/signup`)
      .send(user)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(201);
        expect(propertyChecker(res.body.data, ...userProperties)).to.equal(true);
        const createdUser = User.findById(res.body.data.id);
        expect(res.body.data.id).to.be.equal(createdUser.id);
        expect(res.body.data.email).to.be.equal(createdUser.email);
        expect(res.body.data.firstName).to.equal(user.firstName);
        expect(res.body.data.lastName).to.equal(user.lastName);
        expect(res.body.data.email).to.equal(user.email);
        expect(res.body.data.address).to.equal(user.address);
        expect(res.body.data.id).to.be.a('number');
        expect(res.body.data.token).to.be.a('string');
        done();
      });
  });

  it('Should sign up a new user', (done) => {
    const user = {
      firstName: 'Automart',
      lastName: 'Admin',
      email: 'admin@automart.com',
      address: 'Magodo Isheri Lagos',
      password: 'automart1234',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/auth/signup`)
      .send(user)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(201);
        expect(propertyChecker(res.body.data, ...userProperties)).to.equal(true);
        const createdUser = User.findById(res.body.data.id);
        expect(res.body.data.id).to.be.equal(createdUser.id);
        expect(res.body.data.email).to.be.equal(createdUser.email);
        expect(res.body.data.firstName).to.equal(user.firstName);
        expect(res.body.data.lastName).to.equal(user.lastName);
        expect(res.body.data.email).to.equal(user.email);
        expect(res.body.data.address).to.equal(user.address);
        expect(res.body.data.id).to.be.a('number');
        expect(res.body.data.token).to.be.a('string');
        User.makeadmin(createdUser.id);
        done();
      });
  });

  it('Should not sign up because email already used', (done) => {
    const user = {
      firstName: 'Jimmy',
      lastName: 'Abaje',
      email: 'jimmiabaje@yahoo.com',
      address: 'Magodo Isheri Lagos',
      password: 'automart1234',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/auth/signup`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Email Already Exists');
        done();
      });
  });
});


describe('User Sign In', () => {
  it('Should check if the sign in form is valid', () => {
    const user = {
      email: 'jimmy@automart.com',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/auth/signin`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Invalid SignIn Form');
      });
  });

  it('Should check if the email is valid', () => {
    const user = {
      email: 'jimmy',
      password: 'automart1234',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/auth/signin`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Invalid Email');
      });
  });

  it('Should check if the user exists', () => {
    const user = {
      email: 'jimmy@notautomart.com',
      password: 'automart1234',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/auth/signin`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('User Doesn\'t Exist, Check Email');
      });
  });

  it('Should check if the password is valid', () => {
    const user = {
      email: 'jimmiabaje@yahoo.com',
      password: 'notautomart1234',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/auth/signin`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Password Invalid');
      });
  });

  it('Should sign in the user', (done) => {
    const user = {
      email: 'jimmiabaje@yahoo.com',
      password: 'automart1234',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/auth/signin`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(propertyChecker(res.body.data, ...userProperties)).to.equal(true);
        expect(res.body.data.firstName).to.be.a('string');
        expect(res.body.data.lastName).to.be.a('string');
        expect(res.body.data.email).to.equal(user.email);
        expect(res.body.data.address).to.be.a('string');
        expect(res.body.data.id).to.be.a('number');
        expect(res.body.data.token).to.be.a('string');
        userAuth.authorization = `Bearer ${res.body.data.token}`;
        done();
      });
  });

  it('Should sign in the user', (done) => {
    const user = {
      email: 'admin@automart.com',
      password: 'automart1234',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/auth/signin`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(propertyChecker(res.body.data, ...userProperties)).to.equal(true);
        expect(res.body.data.firstName).to.be.a('string');
        expect(res.body.data.lastName).to.be.a('string');
        expect(res.body.data.email).to.equal(user.email);
        expect(res.body.data.address).to.be.a('string');
        expect(res.body.data.id).to.be.a('number');
        expect(res.body.data.token).to.be.a('string');
        adminAuth.authorization = `Bearer ${res.body.data.token}`;
        done();
      });
  });
});

export { userAuth, adminAuth };
