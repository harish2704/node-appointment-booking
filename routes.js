var teachersCtrl = require('./controllers/teachers.js');

module.exports = function(app){
    app.get('/', teachersCtrl.index );
    app.post('/teachers/search', teachersCtrl.search );
};
