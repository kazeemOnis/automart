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

const userProperties = ['id', 'firstName', 'email', 'token', 'lastName', 'address', 'isAdmin'];

describe('User Sign Up', () => {
  it('User should have property firstName, lastName, email, address, password', () => {
    expect(propertyChecker(newUser, 'firstName', 'email', 'password', 'lastName', 'address')).to.equal(true);
  });

  it('User should have not unwanted property', () => {
    expect(propertyChecker(newUser, 'username', 'name', 'hackUser')).to.equal(false);
  });

  // it('Should create a new user', () => {
  //   const createdUser = User.createUser(newUser);
  //   const allUsers = User.getUsers();
  //   expect(allUsers.length).to.not.equal(0);
  //   expect(createdUser.firstName).to.equal(newUser.firstName);
  //   expect(createdUser.lastName).to.equal(newUser.lastName);
  //   expect(createdUser.address).to.equal(newUser.address);
  //   expect(createdUser.password).to.equal(newUser.password);
  //   expect(createdUser.email).to.equal(newUser.email);
  //   expect(createdUser.id).to.be.a('number');
  // });

  // it('Should find a user by id', () => {
  //   const foundUser = User.findById(1);
  //   expect(foundUser.firstName).to.equal(newUser.firstName);
  //   expect(foundUser.lastName).to.equal(newUser.lastName);
  //   expect(foundUser.address).to.equal(newUser.address);
  //   expect(foundUser.password).to.equal(newUser.password);
  //   expect(foundUser.email).to.equal(newUser.email);
  //   expect(foundUser.id).to.equal(1);
  // });

  // it('Should find a user by email', () => {
  //   const foundUser = User.findByEmail('konisarotu@yahoo.com');
  //   expect(foundUser.firstName).to.equal(newUser.firstName);
  //   expect(foundUser.lastName).to.equal(newUser.lastName);
  //   expect(foundUser.address).to.equal(newUser.address);
  //   expect(foundUser.password).to.equal(newUser.password);
  //   expect(foundUser.email).to.equal(newUser.email);
  //   expect(foundUser.id).to.equal(1);
  // });

  // it('Check if email exists', () => {
  //   const foundEmail = User.checkEmailExist('testemail@automart.com');
  //   const foundEmail2 = User.checkEmailExist('konisarotu@yahoo.com');
  //   expect(foundEmail).to.equal(false);
  //   expect(foundEmail2).to.equal(true);
  // });

  it('Should check if signup form is valid', () => {
    const user = {
      firstName: 'Jimmy',
      lastName: 'Neutron',
      email: 'jimmy@automart.com',
      password: 'automart1234',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/user/signup`)
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
      .post(`${API_V1_PRFEIX}/user/signup`)
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
      .post(`${API_V1_PRFEIX}/user/signup`)
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
      .post(`${API_V1_PRFEIX}/user/signup`)
      .send(user)
      .end((err, res) => {
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
      .post(`${API_V1_PRFEIX}/user/signup`)
      .send(user)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(201);
        expect(propertyChecker(res.body.data, ...userProperties)).to.equal(true);
        expect(res.body.data.firstName).to.equal(user.firstName);
        expect(res.body.data.lastName).to.equal(user.lastName);
        expect(res.body.data.email).to.equal(user.email);
        expect(res.body.data.address).to.equal(user.address);
        expect(res.body.data.isAdmin).to.be.a('boolean');
        expect(res.body.data.id).to.be.a('number');
        expect(res.body.data.token).to.be.a('string');
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
      .post(`${API_V1_PRFEIX}/user/signup`)
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
      .post(`${API_V1_PRFEIX}/user/signin`)
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
      .post(`${API_V1_PRFEIX}/user/signin`)
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
      .post(`${API_V1_PRFEIX}/user/signin`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('User Doesn\'t Exist, Check Email');
      });
  });

  it('Should sign in the user', (done) => {
    const user = {
      email: 'jimmiabaje@yahoo.com',
      password: 'automart1234',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/user/signin`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(propertyChecker(res.body.data, ...userProperties)).to.equal(true);
        expect(res.body.data.firstName).to.be.a('string');
        expect(res.body.data.lastName).to.be.a('string');
        expect(res.body.data.email).to.equal(user.email);
        expect(res.body.data.address).to.be.a('string');
        expect(res.body.data.isAdmin).to.be.a('boolean');
        expect(res.body.data.id).to.be.a('number');
        expect(res.body.data.token).to.be.a('string');
        done();
      });
  });
});
