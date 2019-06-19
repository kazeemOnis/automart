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

  static gerCarByOwner(id) {
    return cars.filter(car => car.owner === id);
  }
}
