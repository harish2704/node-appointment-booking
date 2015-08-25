var teachersCtrl = require('./controllers/teachers.js');

module.exports = function(app){
    app.get('/', teachersCtrl.showSeachPage );
    app.get('/teachers/list', teachersCtrl.showListPage );
    app.put('/teachers/:id', teachersCtrl.update );
    app.get('/teachers/list.json', teachersCtrl.index );
    app.post('/teachers/search', teachersCtrl.search );
    app.post('/teachers', teachersCtrl.create );
    app.post('/teachers/del', teachersCtrl.deleteByQuery );
};
