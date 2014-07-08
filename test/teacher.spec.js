var should = require('should');
var async = require('async');
var Teacher = require('../models/Teacher.js');
var teachersData = require('./teachers-data.js');

var falseData = JSON.parse( JSON.stringify( teachersData[0] ));
falseData.name = 'Buggy';
falseData.availability.push({ start: '2014-7-4 15:15', end: '2014-7-4 15:45' });

require('../models/db').connect();

describe('Teacher', function() {
    before(function( done ){
        return async.series([
            function(cb){ return Teacher.remove({}, cb ); },
            function(cb){ return Teacher.create( teachersData , cb); },
            ],
            done );
        
    });


    it('should exist teacher', function(done){
        Teacher.findOne({}, function(err, doc ){
            should.not.exist( err );
            should.exist( doc );
            done();
        });
    });

    it('should find availabile teachers', function(done){
        Teacher.findAvailable({start: '2014-7-4 9:00', end: '2014-7-4 10:00'}, function(err, docs){
            should.not.exist( err );
            should.exist( docs );
            docs.should.have.lengthOf(1);
            done();
        });
    });
    it('should find availabile teachers', function(done){
        async.series([
        function(cb){
            Teacher.findAvailable({start: '2014-7-4 9:30', end: '2014-7-4 10:00'}, function(err, docs){
                should.not.exist( err );
                should.exist( docs );
                docs.should.have.lengthOf(2);
                cb();
            });
        },
        function(cb){
            Teacher.findAvailable({start: '2014-7-4 9:00', end: '2014-7-4 16:00'}, function(err, docs){
                should.not.exist( err );
                should.exist( docs );
                docs.should.have.lengthOf(0);
                cb();
            });
        }
        ], done );
    });
    it('get Appointments for a teacher', function(done){
        Teacher.findAvailable({start: '2014-7-4 9:00', end: '2014-7-4 10:00'}, function(err, docs){
            should.not.exist( err );
            should.exist( docs );
            docs.should.have.lengthOf(1);
            var teacher = docs[0];
            var appointmentTime = { start: '2014-7-4 9:00', end: '2014-7-4 10:00' };
            teacher.getAppointment( appointmentTime, function(err, doc ){
                Teacher.findAvailable( appointmentTime, function(err, docs){
                    should.not.exist( err );
                    should.exist( docs );
                    docs.should.have.lengthOf(0);
                    done();
                });
            });
        });
    });
    it('should not save data with overlaped time slots', function(done){
        Teacher.create( falseData, function(err, docs){
            should.exist( err );
            should.not.exist( docs );
            err.message.should.be.equal('Time slots overlaps');
            done();
        });
    });

    it('should support query conditions to find availabile teachers', function(done){
        async.series([
        function(cb){
            Teacher.findAvailable({start: '2014-7-7 9:30', end: '2014-7-7 10:00', topics: ['Zoology', 'Biology']}, function(err, docs){
                should.not.exist( err );
                should.exist( docs );
                docs.should.have.lengthOf(1);
                cb();
            });
        },
        ], done );
    });
});
