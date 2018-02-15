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

Employee.createFromForm = function(body){
  if(body.managerId === '-1'){
    delete body.managerId;
  }
  return Employee.create(body);
}

Employee.updateFromForm = function(id, body){
  if(body.managerId === '-1'){
    body.managerId = null;
  }
  return Employee.findById(id)
    .then( employee => {
      Object.assign(employee, body);
      return employee.save();
    })
}

Employee.belongsTo(Employee, { as: 'manager' });
Employee.hasMany(Employee, {as: 'manages', foreignKey: 'managerId'});

module.exports = Employee;
