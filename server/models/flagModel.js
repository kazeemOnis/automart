const flags = [];

export default class Flag {
  static generateID() {
    return flags.length + 1;
  }

  static createFlag(flag) {
    const newFlag = {
      id: Flag.generateID(), ...flag, created_on: Date.now(),
    };
    flags.push(newFlag);
    return newFlag;
  }

  static getFlags() {
    return flags;
  }

  static findById(id) {
    return flags.find(flag => flag.id === id);
  }

  static deleteFlag(id) {
    const flag = Flag.findById(id);
    flags.splice(flags.indexOf(flag), 1);
    return 'Flag Successfully Deleted';
  }
}
