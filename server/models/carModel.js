const cars = [];
export default class Car {
  static generateID() {
    return cars.length + 1;
  }

  static createCar(car) {
    const newCar = {
      id: Car.generateID(), ...car, created_on: Date.now(), status: 'available',
    };
    cars.push(newCar);
    return newCar;
  }

  static getCars() {
    return cars;
  }

  static getCarByID(id) {
    return cars.find(car => car.id === id);
  }

  static sellCar(id) {
    const car = Car.getCarByID(id);
    const carIndex = cars.findIndex(data => data === car);
    car.status = 'sold';
    cars[carIndex] = car;
    return car;
  }

  static updatePrice(id, price) {
    const car = Car.getCarByID(id);
    const carIndex = cars.findIndex(data => data === car);
    car.price = price;
    cars[carIndex] = car;
    return car;
  }

  static deleteCar(id) {
    const car = Car.getCarByID(id);
    cars.splice(cars.indexOf(car), 1);
    return 'Car Ad Successfully Deleted';
  }

  static filter(data, field, value) {
    return data.filter(car => car[field] === value);
  }

  static filterPrice(data, min = 0, max = 0) {
    return data.filter(car => (car.price >= min) && (car.price <= max));
  }

  static getCarByOwner(id) {
    return cars.filter(car => car.owner === id);
  }
}
