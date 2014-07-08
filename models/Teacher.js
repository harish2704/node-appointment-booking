var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var debug = require('debug')('TeacherModel');

var availabilitySchema = new Schema({
    start: Date,
    end: Date,
    availabile: { type: Boolean, default: true }
});

var TeacherSchema = new Schema({
    name: String,
    topics: [String],
    availability:[ availabilitySchema ]
});

function checkSlotOverLaps( slots ){
    var iSlots = {};
    slots.forEach( function(v){
        iSlots[v.start] = v;
    });
    var startPoints = slots.map( function(v){ return v.start; });
    startPoints.sort(function(u,v){ return v<u; });
    var overlaps = false, i, l;
    for ( i = 0, l = startPoints.length-1; i < l; i ++) {
        var curr = iSlots[ startPoints[i] ];
        var next = iSlots[ startPoints[i+1] ];
        if( next && ( curr.end > next.start ) ){
            overlaps = true;
            break;
        }
    }
    return overlaps;
}

TeacherSchema.pre('save', function(cb){
    this.topics = this.topics.map( function(v){ return v.toLowerCase(); });
    var overlaps = checkSlotOverLaps( this.availability );
    if(overlaps){
        return cb( new Error('Time slots overlaps') );
    }
    return cb( null, this );
});

function parseConditions ( orig ){
    var conditions = {};
    if ( orig.topics ){
        if ( typeof orig.topics == 'string' ){
            orig.topics = [ orig.topics ];
        }
        orig.topics = orig.topics.map( function(v){ return v.toLowerCase(); });
        conditions.topics = { $in: orig.topics };
    }
    if ( orig.start && orig.end ){
        conditions.availability = {
            $elemMatch: {
                start: { $lte: new Date( orig.start ) },
                end: { $gte: new Date( orig.end ) },
                availabile: true,
            }
        };
    }
    return conditions;
}

TeacherSchema.statics.findAvailable = function( args, cb ){
    var conditions = parseConditions( args );
    this.find( conditions, cb );
};

var MIN_DELTA = 5 * 60 * 1000; // 5 Minutes;
var timeDiff = function( v1, v2 ){
    var delta = v1 -v2;
    if( Math.abs(delta) <= MIN_DELTA ){
        return 0;
    }
    return delta > 0? 1 : -1;
};

var slotFilter = function( v1 ){
    return function(v2){
        return ( ( v2.start <= v1.start ) && ( v2.end >= v1.end ) );
    };
};
TeacherSchema.methods.getAppointment = function(args, cb ){
    args = {
        start: new Date( args.start ),
        end: new Date( args.end ),
    };
    var self = this;
    debug( self );
    var slot = self.availability.filter( slotFilter( args ) )[0];
    var newSlots = [], diff;
    diff = timeDiff( slot.start, args.start );
    if (diff == -1 ) { // slot.start is before args.start
        newSlots.push ( { start: slot.start, end: args.start } );
        slot.start = args.start;
    }
    diff = timeDiff( slot.end, args.end );
    if (diff == 1 ) { // slot.end is after args.end
        newSlots.push ( { start: args.end, end: slot.end } );
        slot.end = args.end;
    }
    newSlots.forEach( function(v){
        var slot = self.availability.create( v )
        self.availability.push( slot );
    });
    slot.availabile = false;
    debug( self );
    self.save( cb );
};

var Teacher = mongoose.model('Teacher', TeacherSchema );

module.exports = Teacher;

