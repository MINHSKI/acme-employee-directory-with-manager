const conn = require('./conn');
const Employee = require('./Employee');

const sync = ()=> {
  return conn.sync({ force: true });
}

const seed = ()=> {
  return Promise.all([
    Employee.create({ email: 'moe@gmail.com' }),
    Employee.create({ email: 'larry@gmail.com' }),
    Employee.create({ email: 'curly@gmail.com' }),
    Employee.create({ email: 'jeremy_one@gmail.com' }),
    Employee.create({ email: 'jeremy_two@yahoo.com' }),
  ])
  .then(([ moe, larry, curly])=> {
    return Promise.all([
      larry.setManager(moe),
      curly.setManager(larry)
    ]);
  });
}

module.exports = {
  sync,
  seed,
  models: {
    Employee
  }
};
