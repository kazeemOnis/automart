const users = [];
class User {
  constructor() {
    this.users = users;
  }

  generateID() {
    return this.users.length + 1;
  }

  createUser(user) {
    const newUser = {
      id: this.generateID(), ...user, isAdmin: false, creadetAt: Date.now(),
    };
    this.users.push(newUser);
    return newUser;
  }

  getUsers() {
    return this.users;
  }

  findById(id) {
    return this.users.find(user => user.id === id);
  }

  findByEmail(email) {
    return this.users.find(user => user.email === email);
  }

  checkEmailExist(email) {
    return this.users.some(user => user.email === email);
  }
}


export default new User();
