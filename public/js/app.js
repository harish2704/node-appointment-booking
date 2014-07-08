var searchApp = angular.module('searchApp', ['ui.bootstrap']);

var setDate = function( time, date){
    time.setDate( date.date );
    time.setMonth( date.month );
    time.setUTCFullYear( date.year );
};

searchApp.controller('searchCtrl', function searchCtrl($scope, $http) {
    var date = new Date();
    // TODO: Rm below line
    // date.setDate( date.getDate() - 4);
    var ONE_DAY = 24 * 60 *60 *1000;
    var DAYS = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var tabs = [], i;
    for ( i = 0; i < 7; i ++) {
        var tab = {};
        tab.day = DAYS[ date.getDay() ];
        tab.date = {
            date: date.getDate(),
            month: date.getMonth(),
            year: date.getUTCFullYear(),
        };
        tabs.push( tab );
        date.setTime( date.getTime() + ONE_DAY );
    }
    tabs[0].day = 'Today';
    tabs[0].active = true ;
    var keywords = [ 'Chemistry', 'Biology' ];
    $scope.keywords = {};
    keywords.forEach( function(v) { $scope.keywords[v] = false; });

    $scope.tabs = tabs;
    $scope.startTime = new Date();
    $scope.endTime = new Date();
    $scope.age = 20;
    $scope.sex = 'male';
    $scope.seletedTab=0;
    $scope.teachers = [];

    gg = $scope;
    $scope.setActiveTab = function( tab ){
        $scope.tabs.forEach( function(v){ v.active = false; });
        tab.active = true;
        $scope.seletedTab = $scope.tabs.indexOf( tab );
    };
    $scope.submitSearch = function(){
        var keywords = [];
        Object.keys( $scope.keywords ).forEach( function(kw){
            if( $scope.keywords[kw] ) {
                keywords.push( kw );
            }
        });
        if( $scope.keywordText ){
            keywords.push( $scope.keywordText );
        }
        var seletedTab = $scope.tabs[ $scope.seletedTab ];
        setDate( $scope.startTime, seletedTab.date );
        setDate( $scope.endTime, seletedTab.date );
        var data = {
            start : $scope.startTime,
            end : $scope.endTime,
            sex : $scope.sex,
            age : $scope.age,
            keywords: keywords
        };
        $http.post('/teachers/search', data ).success( function(data){
            console.log( data );
            $scope.teachers.splice(0);
            if( data.success ){
                data.data.teachers.forEach( function(v){ $scope.teachers.push( v ); } );
            }
        });
    };
});
