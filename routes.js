var teachersCtrl = require('./controllers/teachers.js');

module.exports = function(app){
    app.get('/', teachersCtrl.index );
    app.get('/teachers/list', teachersCtrl.list );
    app.post('/teachers/search', teachersCtrl.search );
    app.post('/teachers', teachersCtrl.create );
    app.post('/teachers/del', teachersCtrl.deleteByQuery );
};
