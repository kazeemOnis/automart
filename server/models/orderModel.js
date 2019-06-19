const orders = [];

export default class Order {
  static generateID() {
    return orders.length + 1;
  }

  static createOrder(order) {
    const newOrder = {
      id: Order.generateID(), ...order, status: 'Pending', created_on: Date.now(),
    };
    orders.push(newOrder);
    return newOrder;
  }

  static getOrders() {
    return orders;
  }

  static findById(id) {
    return orders.find(order => order.id === id);
  }
}
