const users = [];
export default class User {
  static generateID() {
    return users.length + 1;
  }

  static createUser(user) {
    const newUser = {
      id: User.generateID(), ...user, isAdmin: false, creadetAt: Date.now(),
    };
    users.push(newUser);
    return newUser;
  }

  static getUsers() {
    return users;
  }

  static findById(id) {
    return users.find(user => user.id === id);
  }

  static findByEmail(email) {
    return users.find(user => user.email === email);
  }

  static checkEmailExist(email) {
    return users.some(user => user.email === email);
  }
}
