angular.module('starter.services', [])

.factory('Exercises', function () {
  // Might use a resource here that returns a JSON array.
  // Some fake testing data
    var exercises = [{
    id: 0,
    title: 'Dumbbell shoulder press',
    exerciseDesc: 'Lysing blabla',
    type: 'Upper Body',
    face: 'http://workoutlabs.com/wp-content/uploads/watermarked/Dumbbell_Shoulder_Press1.png'
  }, {
    id: 1,
    title: 'Dumbell bench press',
    exerciseDesc: 'Lysing blabla',
    type: 'Upper Body',
    face: 'http://workoutlabs.com/wp-content/uploads/watermarked/Dumbbell_Bench_Press1.png'
  }, {
    id: 3,
    title: 'Barbell bicep curls',
    exerciseDesc: 'Lysing blabla',
    type: 'Upper Body',
    face: 'http://workoutlabs.com/wp-content/uploads/watermarked/Barbell_Curl.png'
  }];


  return {
    all: function() {
        return exercises;
    },
    remove: function (exercise) {
        exercises.splice(exercises.indexOf(exercise), 1);
    },
    get: function (exerciseId) {
        for (var i = 0; i < exercises.length; i++) {
            if (exercises[i].id === parseInt(exerciseId)) {
                return exercises[i];
        }
      }
      return null;
    }
  };
})

    // PLANS SERVICE
.factory('Plans', function ($localstorage) {
    
    /*var plans = [{
        id: 0,
        title: "Feb 19 1990",
        exercises: []
    }, {
        id: 1,
        title: "Feb 21 1990",
        exercises: []
    }];*/

    // plans notar object 'saved' sem vistað er í localstorage
    //var plans = $localstorage.getObject('saved');
    var plans = [];


    
    return {
        populate: function () {
            var svdObj =  $localstorage.getObject('saved')
            if (svdObj === null || svdObj === undefined || svdObj == {}) {
                plans = [];
            } else {
                plans = $localstorage.getObject('saved');
            }
        },
        all: function () {
            return plans;
        },
        remove: function (plan) {
            plans.splice(plans.indexOf(plan), 1);
        },
        removeE: function (plan, exercise) {
            var plan = plans.indexOf(plan);
            plans[plan].exercises.splice(plans[plan].exercises.indexOf(exercise), 1)
            //alert(plans[plan].exercises.indexOf(exercise))
        },
        // add setur nýtt plan inn í plans
        add: function (itemName, ID) {
            plans.push({
                id: ID,
                title: itemName,
                exercises: []
            });
        },
        // Plans.get() skilar plani út frá planId
        get: function (planId) {
            for (var i = 0; i < plans.length; i++) {
                if (plans[i].id === parseInt(planId)) {
                    return plans[i];
                }
            }
        },
        finished: function(plan, exercise) {
            //plans[plan].exercises[plans[plan].exercises.indexOf(exercise)].complete = true;
            var myItem = angular.element(document.querySelector('#item_' + plan + '_' + exercise));
            myItem.toggleClass('strike');
            //alert('#item_' + plan + '_' + exercise);
        },
        // Plans.long() skilar id = 0 ef plans er tómt annars nýju ID sem er hærra en síðasta gildi
        long: function() {            
                if (plans.length < 1) {
                    id = 0;
                } else {
                    id = plans[plans.length - 1].id + 1;
                }
             return id;
        },
        clear: function () {
            $localstorage.clear('saved');
        }
    }
})

    // Local Storage Service
.factory('$localstorage', ['$window', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}]);
