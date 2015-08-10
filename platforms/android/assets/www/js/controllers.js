angular.module('starter.controllers', ['ionic', 'ionic-datepicker'])

   

    // CONTROLLER FYRIR TAB-PLANS
.controller('PlansCtrl', function ($scope, Plans, $timeout, $localstorage) {
    
    //plans notar Plans.all() service til þess að taka inn í sig öll plön
    $scope.plans = Plans.all();

    //remove notar slide-delete til þess að eyða plönum úr plans
    $scope.remove = function (plan) {
        Plans.remove(plan);
        // Þegar plani er eytt þarf að vista plönin
        $localstorage.setObject('saved', $scope.plans);
    };

    //showAddPlan er notað til þess að fela og birta datepicker (add plan og cancel takkana)
    $scope.showAddPlan = false;
    //showButton er notað til þess að fela og birta rauða plúsmerkta takkann
    $scope.showButton = true;
    //addPlan felur datepicker og birtir aftur rauða plúsmerkta takkann
    $scope.addPlan = function () {
        $scope.showButton = false
        $timeout(function () {
            $scope.showAddPlan = true;
        }, 150);
        
    };

    // addNewPlan fallið breytir valinni datepicker dagsetningu í streng og setur það sem nafn á nýju plani
    // sem Plans.add() service bætir svo við plans
    $scope.addNewPlan = function (newItemName) {
        // Breyta úr date í string
        newItemName = newItemName.toString();
        // Klippa óþarfa info af string
        newItemName = newItemName.substring(4, 15);
        // Plans.long() skilar id fyrir nýtt plan.
        $scope.number = Plans.long();

        Plans.add(newItemName, $scope.number);

        alert('Name: '+newItemName+' Number: ' +$scope.number);
        $localstorage.setObject('saved', $scope.plans);
    }

    // þegar cancel er valið - er datepicker falinn og rauði plúsmerkti takkinn birtist aftur
    $scope.cancelPlan = function () {
        $scope.showButton = true;
        $scope.showAddPlan = false;
        alert($scope.plans)
    }

    // Datepicker:
    $scope.currentDate = new Date();
    $scope.title = "Pick a date for your plan";
    $scope.datePickerCallback = function (val) {
        if (typeof (val) === 'undefined') {
            //alert('Date not selected');
        } else {
            //alert('Date selected: ' + val);
        }
    };

    $scope.clearPlans = function () {
        Plans.clear();
    }

})



    // CONTROLLER FYRIR TAB-PLAN-DETAIL
.controller('PlanDetailCtrl', function ($scope, $stateParams, Plans, Exercises, $localstorage, $ionicPopup) {
    $scope.plan = Plans.get($stateParams.planId);
    $scope.plans = Plans.all();
    $scope.exercises = Exercises.all();

    $scope.showCheckboxes = false;
    
    // Fyrir plúsmerkta takkann - til þess að bæta við æfingum í plan
    $scope.addExercises = function () {
        $scope.showCheckboxes = true;
    };

    // Confirm takkinn til þess að fela valmöguleikann að bæta við æfingum, og save-a plans í localstorage
    $scope.hideExercises = function () {
        $scope.showCheckboxes = false;
        $localstorage.setObject('saved', $scope.plans);

        $ionicPopup.alert({
            title: 'Success',
            content: 'Plan Saved'
        })

    };

    


    $scope.exercise = Exercises.get($stateParams.exerciseId);

    //// SWIPE OPTION ////
    // #1 Þegar tunnan er valinn á æfingu er þeirri æfingu hent úr plan
    $scope.removeExercise = function (plan, exercise) {
        //alert('PlanID: ' + plan + ' ExID: ' + exercise)
        Plans.removeE(plan, exercise);
        // Þegar æfingu hefur verið eytt þarf að vista plönin
        $localstorage.setObject('saved', $scope.plans);
    };
    // #2Þegar notandi lýkur æfingu getur hann strokað yfir hana með því að ýta á checked merkið
    $scope.finished = function (plan, exercise) {
        //alert('PlanID: ' + plan + ' ExID: ' + exercise)
        Plans.finished(plan, exercise)
    };

})

    // CONTROLLER FYRIR TAB-EXERCISES
.controller('ExercisesCtrl', function ($scope, Exercises) {
    $scope.exercises = Exercises.all();
    $scope.remove = function (exercise) {
        Exercises.remove(exercise);
    }
})

    // CONTROLLER FYRIR TAB-EXERCISE-DETAIL
.controller('ExerciseDetailCtrl', function ($scope, $stateParams, Exercises) {
    $scope.exercise = Exercises.get($stateParams.exerciseId);
})

.controller('AccountCtrl', function ($scope) {
   
});

