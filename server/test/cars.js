// eslint-disable-next-line import/no-extraneous-dependencies
import { use, expect, request } from 'chai';
// eslint-disable-next-line import/no-extraneous-dependencies
import chaiHttp from 'chai-http';
import app from '../../app';
import Car from '../models/carModel';
import { userAuth, adminAuth } from './auth';

use(chaiHttp);

const API_V1_PRFEIX = '/api/v1';
const authHeader = { authorization: null };
const newCar = {
  state: 'used',
  status: 'available',
  price: 2000000,
  manufacturer: 'Honda',
  model: 'Accord',
  body_type: 'sedan',
  year: '2006',
  description: 'Chiiled AC, fast engine',
};
const price = { price: 5000 };


describe('Unauthorized users shouldn\'t be able to create car ads', () => {
  it('Unauthorized user should be denied', () => {
    request(app)
      .post(`${API_V1_PRFEIX}/car`)
      .send(newCar)
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
      .set(authHeader)
      .send(newCar)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('No Authorization Token Provided');
      });
  });
});

describe('Create a user to get token', () => {
  it('Should sign up a new user', (done) => {
    const user = {
      firstName: 'Seller',
      lastName: 'Seller',
      email: 'sellere@yahoo.com',
      address: 'Seller Avenue',
      password: 'seller1234',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/auth/signup`)
      .send(user)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.status).to.equal(201);
        expect(res.body.data.firstName).to.equal(user.firstName);
        expect(res.body.data.lastName).to.equal(user.lastName);
        expect(res.body.data.email).to.equal(user.email);
        expect(res.body.data.address).to.equal(user.address);
        expect(res.body.data.id).to.be.a('number');
        expect(res.body.data.token).to.be.a('string');
        done();
      });
  });

  it('Should sign in the user', (done) => {
    const user = {
      email: 'sellere@yahoo.com',
      password: 'seller1234',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/auth/signin`)
      .send(user)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.data.firstName).to.be.a('string');
        expect(res.body.data.lastName).to.be.a('string');
        expect(res.body.data.email).to.equal(user.email);
        expect(res.body.data.address).to.be.a('string');
        expect(res.body.data.id).to.be.a('number');
        expect(res.body.data.token).to.be.a('string');
        authHeader.authorization = `Bearer ${res.body.data.token}`;
        done();
      });
  });
});

describe('Create a car ad', () => {
  it('Car should have valid properties', () => {
    const car = {
      state: 'used',
      manufacturer: 'toyota',
      status: 'available',
      model: 'camry`',
      body_type: 'sedan',
      year: '2006',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/car`)
      .set(authHeader)
      .send(car)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid Car Provided');
        expect(res.body.success).to.equal(false);
      });
  });

  it('Car should have a valid price', () => {
    const car = {
      state: 'used',
      status: 'available',
      price: '200abcd',
      manufacturer: 'Toyota',
      model: 'camry',
      body_type: 'sedan',
      year: '2006',
      description: 'Chilled AC, fast engine',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/car`)
      .set(authHeader)
      .send(car)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Incorrect Price, Please Enter Numbers Only');
        expect(res.body.success).to.equal(false);
      });
  });

  it('Car should have a valid year', () => {
    const car = {
      state: 'used',
      status: 'available',
      price: 1000,
      manufacturer: 'Toyota',
      model: 'camry',
      body_type: 'sedan',
      year: 1885,
      description: 'Old camry 1885',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/car`)
      .set(authHeader)
      .send(car)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Incorrect Year Entered, Please Check');
        expect(res.body.success).to.equal(false);
      });
  });

  it('Should create a new car', () => {
    const car = {
      state: 'used',
      status: 'available',
      price: 1000,
      manufacturer: 'Toyota',
      model: 'camry',
      body_type: 'sedan',
      year: 2016,
      description: 'Fast Engine, clean and calm affordable rate',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/car`)
      .set(authHeader)
      .send(car)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.status).to.equal(201);
        expect(Car.getCars()).to.not.equal([]);
        const createdCar = Car.getCarByID(res.body.data.id);
        expect(createdCar).to.not.equal(null);
        expect(createdCar.state).to.equal(car.state);
        expect(createdCar.manufacturer).to.equal(car.manufacturer);
        expect(createdCar.model).to.equal(car.model);
        expect(createdCar.description).to.equal(car.description);
        expect(createdCar.price).to.equal(car.price);
      });
  });

  it('Should create a new car', () => {
    request(app)
      .post(`${API_V1_PRFEIX}/car`)
      .set(userAuth)
      .send(newCar)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.status).to.equal(201);
        expect(Car.getCars()).to.not.equal([]);
        const createdCar = Car.getCarByID(res.body.data.id);
        expect(createdCar).to.not.equal(null);
        expect(createdCar.state).to.equal(newCar.state);
        expect(createdCar.manufacturer).to.equal(newCar.manufacturer);
        expect(createdCar.model).to.equal(newCar.model);
        expect(createdCar.description).to.equal(newCar.description);
        expect(createdCar.price).to.equal(newCar.price);
      });
  });

  it('Should create a new car', () => {
    const car = {
      state: 'used',
      status: 'available',
      price: 1000,
      manufacturer: 'Mercedes',
      model: 'c300',
      body_type: 'sport',
      year: 2016,
      description: 'Fast Engine, clean and calm affordable rate',
    };
    request(app)
      .post(`${API_V1_PRFEIX}/car`)
      .set(authHeader)
      .send(car)
      .end((err, res) => {
        expect(res.status).to.equal(201);
        expect(res.body.status).to.equal(201);
        expect(Car.getCars()).to.not.equal([]);
        const createdCar = Car.getCarByID(res.body.data.id);
        expect(createdCar).to.not.equal(null);
        expect(createdCar.state).to.equal(car.state);
        expect(createdCar.manufacturer).to.equal(car.manufacturer);
        expect(createdCar.model).to.equal(car.model);
        expect(createdCar.description).to.equal(car.description);
        expect(createdCar.price).to.equal(car.price);
      });
  });
});

describe('View a car', () => {
  it('Cannot view a car that does not exist', () => {
    request(app)
      .get(`${API_V1_PRFEIX}/car/20`)
      .end((err, res) => {
        expect(res.status).to.equal(404);
        expect(res.body.status).to.equal(404);
        expect(res.body.message).to.equal('Cannot Find This Car');
        expect(res.body.success).to.equal(false);
      });
  });

  it('Should return all information about car', () => {
    request(app)
      .get(`${API_V1_PRFEIX}/car/1`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal(200);
        const foundCar = Car.getCarByID(res.body.data.id);
        expect(foundCar).to.not.equal(null);
        expect(foundCar.state).to.equal(res.body.data.state);
        expect(foundCar.manufacturer).to.equal(res.body.data.manufacturer);
        expect(foundCar.model).to.equal(res.body.data.model);
        expect(foundCar.description).to.equal(res.body.data.description);
        expect(foundCar.price).to.equal(res.body.data.price);
      });
  });
});

describe('Mark car as sold', () => {
  it('Should not allow unauthorized users', () => {
    request(app)
      .patch(`${API_V1_PRFEIX}/car/1/status`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Unauthorizerd Access, Provide Valid Token');
      });
  });

  it('User should provide a token', () => {
    request(app)
      .patch(`${API_V1_PRFEIX}/car/1/status`)
      .set({ authorization: null })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('No Authorization Token Provided');
      });
  });

  it('Cannot sell car that does not exist', () => {
    request(app)
      .patch(`${API_V1_PRFEIX}/car/20/status`)
      .set(authHeader)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Car Doesn\'t Exist');
      });
  });

  it('Only owner can sell car', () => {
    request(app)
      .patch(`${API_V1_PRFEIX}/car/2/status`)
      .set(authHeader)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Only The Actual Seller Can Sell');
      });
  });

  it('Mark car as sold', () => {
    request(app)
      .patch(`${API_V1_PRFEIX}/car/1/status`)
      .set(authHeader)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal(200);
        const foundCar = Car.getCarByID(res.body.data.id);
        expect(foundCar).to.not.equal(null);
        expect(foundCar.state).to.equal(res.body.data.state);
        expect(foundCar.manufacturer).to.equal(res.body.data.manufacturer);
        expect(foundCar.model).to.equal(res.body.data.model);
        expect(foundCar.description).to.equal(res.body.data.description);
        expect(foundCar.price).to.equal(res.body.data.price);
        expect(foundCar.status).to.equal('sold');
        expect(res.body.data.status).to.equal('sold');
      });
  });

  it('Car already sold', () => {
    request(app)
      .patch(`${API_V1_PRFEIX}/car/1/status`)
      .set(authHeader)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Car Already Sold');
      });
  });
});

describe('Update car price', () => {
  it('Should not allow unauthorized users', () => {
    request(app)
      .patch(`${API_V1_PRFEIX}/car/1/price`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Unauthorizerd Access, Provide Valid Token');
      });
  });

  it('User should provide a token', () => {
    request(app)
      .patch(`${API_V1_PRFEIX}/car/1/price`)
      .set({ authorization: null })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('No Authorization Token Provided');
      });
  });

  it('Provide valid update form', () => {
    const testPrice = { amount: 5000 };
    request(app)
      .patch(`${API_V1_PRFEIX}/car/1/price`)
      .set(authHeader)
      .send(testPrice)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Invalid Update Form');
      });
  });

  it('Provide valid update price', () => {
    const testPrice = { price: '2000ee' };
    request(app)
      .patch(`${API_V1_PRFEIX}/car/1/price`)
      .set(authHeader)
      .send(testPrice)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Invalid Price, Please Enter Numbers Only');
      });
  });

  it('Cannot sell car that does not exist', () => {
    request(app)
      .patch(`${API_V1_PRFEIX}/car/20/price`)
      .set(authHeader)
      .send(price)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Car Doesn\'t Exist');
      });
  });

  it('Only owner can sell car', () => {
    request(app)
      .patch(`${API_V1_PRFEIX}/car/2/price`)
      .set(authHeader)
      .send(price)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Only The Actual Seller Can Update Price');
      });
  });

  it('Update Car Price', () => {
    const testPrice = { price: 16000 };
    request(app)
      .patch(`${API_V1_PRFEIX}/car/1/price`)
      .set(authHeader)
      .send(testPrice)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal(200);
        const foundCar = Car.getCarByID(res.body.data.id);
        expect(foundCar).to.not.equal(null);
        expect(foundCar.state).to.equal(res.body.data.state);
        expect(foundCar.manufacturer).to.equal(res.body.data.manufacturer);
        expect(foundCar.model).to.equal(res.body.data.model);
        expect(foundCar.description).to.equal(res.body.data.description);
        expect(foundCar.price).to.equal(testPrice.price);
        expect(res.body.data.price).to.equal(testPrice.price);
      });
  });
});

describe('View all unsold cars', () => {
  it('Should not allow invalid query parameters', () => {
    request(app)
      .get(`${API_V1_PRFEIX}/car?status=available&model=Accord&price=1000`)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Invalid Query');
      });
  });

  it('Should view all available car', () => {
    let cars = Car.getCars();
    cars = Car.filter(cars, 'status', 'available');
    request(app)
      .get(`${API_V1_PRFEIX}/car?status=available`)
      .end((err, res) => {
        expect(res.body.data.length).to.equal(cars.length);
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal(200);
      });
  });

  it('Should view all available accord cars cars', () => {
    request(app)
      .get(`${API_V1_PRFEIX}/car?status=available&model=Accord`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal(200);
      });
  });

  it('Should view all unsold toyota cars', () => {
    request(app)
      .get(`${API_V1_PRFEIX}/car?status=available&manufacturer=Toyota`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal(200);
      });
  });

  it('Should view all unsold tousedyota cars', () => {
    request(app)
      .get(`${API_V1_PRFEIX}/car?status=available&state=used`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal(200);
      });
  });

  it('Should view all unsold cars from 1mil to 3mil', () => {
    let cars = Car.getCars();
    cars = Car.filter(cars, 'status', 'available');
    cars = Car.filterPrice(cars, 1000000, 3000000);
    request(app)
      .get(`${API_V1_PRFEIX}/car?status=available&min_price=1000000&max_price=3000000`)
      .end((err, res) => {
        expect(res.body.data.length).to.equal(cars.length);
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal(200);
      });
  });

  it('Should view all unsold cars from 3m to 4m', () => {
    request(app)
      .get(`${API_V1_PRFEIX}/car?status=available&min_price=3000000&max_price=4000000`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal(200);
      });
  });
});

describe('Admin should delete car ad', () => {
  it('Should not allow unauthorized users', () => {
    request(app)
      .delete(`${API_V1_PRFEIX}/car/3`)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('Unauthorizerd Access, Provide Valid Token');
      });
  });

  it('User should provide a token', () => {
    request(app)
      .delete(`${API_V1_PRFEIX}/car/3`)
      .set({ authorization: null })
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.message).to.equal('No Authorization Token Provided');
      });
  });

  it('Only admin can delete car ad', () => {
    request(app)
      .delete(`${API_V1_PRFEIX}/car/3`)
      .set(authHeader)
      .end((err, res) => {
        expect(res.status).to.equal(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.equal('Only Admin Has Access');
      });
  });

  it('Should delete car ad', () => {
    request(app)
      .delete(`${API_V1_PRFEIX}/car/3`)
      .set(adminAuth)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal(200);
        expect(res.body.data).to.equal('Car Ad Successfully Deleted');
      });
  });

  it('Cannot delete ad that doesn\'t exist', () => {
    request(app)
      .delete(`${API_V1_PRFEIX}/car/3`)
      .set(adminAuth)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Car Doesn\'t Exist');
      });
  });
});

describe('Admin should view all cars', () => {
  it('View all cars sold & unsold', () => {
    request(app)
      .get(`${API_V1_PRFEIX}/car/`)
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body.status).to.equal(200);
        expect(res.body.success).to.equal(true);
      });
  });
});
export default authHeader;
