angular.module('starter.controllers', ['ionic', 'ionic-datepicker'])

   

    // CONTROLLER FYRIR TAB-PLANS
.controller('PlansCtrl', function ($scope, Plans, $timeout, $localstorage) {
    
    //plans notar Plans.all() service til �ess a� taka inn � sig �ll pl�n
    $scope.plans = Plans.all();

    //remove notar slide-delete til �ess a� ey�a pl�num �r plans
    $scope.remove = function (plan) {
        Plans.remove(plan);
        // �egar plani er eytt �arf a� vista pl�nin
        $localstorage.setObject('saved', $scope.plans);
    };

    //showAddPlan er nota� til �ess a� fela og birta datepicker (add plan og cancel takkana)
    $scope.showAddPlan = false;
    //showButton er nota� til �ess a� fela og birta rau�a pl�smerkta takkann
    $scope.showButton = true;
    //addPlan felur datepicker og birtir aftur rau�a pl�smerkta takkann
    $scope.addPlan = function () {
        $scope.showButton = false
        $timeout(function () {
            $scope.showAddPlan = true;
        }, 150);
        
    };

    // addNewPlan falli� breytir valinni datepicker dagsetningu � streng og setur �a� sem nafn � n�ju plani
    // sem Plans.add() service b�tir svo vi� plans
    $scope.addNewPlan = function (newItemName) {
        // Breyta �r date � string
        newItemName = newItemName.toString();
        // Klippa ��arfa info af string
        newItemName = newItemName.substring(4, 15);
        // Plans.long() skilar id fyrir n�tt plan.
        $scope.number = Plans.long();

        Plans.add(newItemName, $scope.number);

        alert('Name: '+newItemName+' Number: ' +$scope.number);
        $localstorage.setObject('saved', $scope.plans);
    }

    // �egar cancel er vali� - er datepicker falinn og rau�i pl�smerkti takkinn birtist aftur
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
    
    // Fyrir pl�smerkta takkann - til �ess a� b�ta vi� �fingum � plan
    $scope.addExercises = function () {
        $scope.showCheckboxes = true;
    };

    // Confirm takkinn til �ess a� fela valm�guleikann a� b�ta vi� �fingum, og save-a plans � localstorage
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
    // #1 �egar tunnan er valinn � �fingu er �eirri �fingu hent �r plan
    $scope.removeExercise = function (plan, exercise) {
        //alert('PlanID: ' + plan + ' ExID: ' + exercise)
        Plans.removeE(plan, exercise);
        // �egar �fingu hefur veri� eytt �arf a� vista pl�nin
        $localstorage.setObject('saved', $scope.plans);
    };
    // #2�egar notandi l�kur �fingu getur hann stroka� yfir hana me� �v� a� �ta � checked merki�
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

