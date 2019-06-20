const orders = [
  {
    id: 1,
    car_id: 2,
    buyer: 2,
    amount: 10000,
    status: 'rejected',
    created_on: Date.now(),
  },
  {
    id: 2,
    car_id: 2,
    buyer: 3,
    amount: 10000,
    status: 'rejected',
    created_on: Date.now(),
  },
];

export default class Order {
  static generateID() {
    return orders.length + 1;
  }

  static createOrder(order) {
    const newOrder = {
      id: Order.generateID(), ...order, status: 'pending', created_on: Date.now(),
    };
    orders.push(newOrder);
    return newOrder;
  }

  static getOrders() {
    return orders;
  }

  static updatePrice(id, amount) {
    const order = Order.findById(id);
    const orderIndex = orders.findIndex(data => data === order);
    order.amount = amount;
    orders[orderIndex] = order;
    return 'Successfully Updated Order Amount';
  }

  static findById(id) {
    return orders.find(order => order.id === id);
  }
}
