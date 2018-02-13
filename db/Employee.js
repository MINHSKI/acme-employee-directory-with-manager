const conn = require('./conn');
const { Sequelize } = conn;

const Employee = conn.define('employee', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  }
}, {
  getterMethods: {
    emailProvider: function(){
      return this.email.split('@')[1];
    },
    name: function(){
      return this.email.split('@')[0];
    }
  }
});

Employee.belongsTo(Employee, { as: 'manager' });
Employee.hasMany(Employee, {as: 'manages', foreignKey: 'managerId'});

Employee.findOrCreateManager = function(email){
  if(!email){
    return Promise.resolve(null);
  }
  return Employee.findOne({ where: { email: email }})
    .then( manager => {
      if(manager){
        return manager;
      }
      return this.create({ email });
    });
};

module.exports = Employee;
