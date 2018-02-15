const app = require('express').Router();
const db = require('../db');
const { Employee } = db.models;

module.exports = app;

app.use((req, res, next)=> {
  Employee.findAll({
    include: [
      { model: Employee, as: 'manager' },
      { model: Employee, as: 'manages' }
    ]
  })
    .then( employees => {
      res.locals.employeeCount = employees.length;
      res.locals.managerCount = employees.filter( employee => !!employee.managerId).length;
      next();
    })
    .catch(next);
});

app.get('/', (req, res, next)=> {
  res.render('index', {});
});


app.get('/employees', (req, res, next)=> {
  Employee.findAll({
    order: [['email', 'ASC']],
    include: [
      { model: Employee, as: 'manager' },
      { model: Employee, as: 'manages' }
    ]
  })
    .then( employees => {
      res.render('employees', { employees });
    })
    .catch(next);
});


app.post('/employees', (req, res, next)=> {
  Employee.createFromForm(req.body)
  .then(()=> res.redirect('/employees'))
  .catch(next);
});

app.put('/employees/:id', (req, res, next)=> {
  Employee.updateFromForm(req.params.id, req.body)
  .then(()=> res.redirect('/employees'))
  .catch(next);
});

app.delete('/employees/:id', (req, res, next)=> {
  Employee.findById(req.params.id)
    .then( employee => employee.destroy())
    .then(()=> res.redirect('/employees'))
    .catch(next);

});
