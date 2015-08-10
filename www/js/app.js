// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','starter.controllers', 'starter.services', 'checklist-model'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }

  });

})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html",
    onEnter: function (Plans) {
        return Plans.populate();
    }
  })


  // Each tab has its own nav history stack:
  .state('tab.plans', {
    url: '/plans',
    views: {
      'tab-plans': {
        templateUrl: 'templates/tab-plans.html',
        controller: 'PlansCtrl'
      }
    }
  })

   .state('tab.plan-detail', {
       url: '/plans/:planId',
       views: {
           'tab-plans': {
               templateUrl: 'templates/plan-detail.html',
               controller: 'PlanDetailCtrl'
           }
       }
   })
   
    .state('tab.plan-exercise-detail', {
        url: '/plans/:planId/:exerciseId',
        views: {
            'tab-plans': {
                templateUrl: 'templates/exercise-detail.html',
                controller: 'PlanDetailCtrl'
            }
        }
    })

  .state('tab.exercises', {
     url: '/exercises',
     views: {
       'tab-exercises': {
            templateUrl: 'templates/tab-exercises.html',
            controller: 'ExercisesCtrl'
        }
      }
    })
    .state('tab.exercise-detail', {
        url: '/exercises/:exerciseId',
        views: {
          'tab-exercises': {
              templateUrl: 'templates/exercise-detail.html',
              controller: 'ExerciseDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/account');

})


// CHECKLIST-MODEL DIRECTIVE:
angular.module('checklist-model', [])
.directive('checklistModel', ['$parse', '$compile', function ($parse, $compile) {
    // contains
    function contains(arr, item, comparator) {
        if (angular.isArray(arr)) {
            for (var i = arr.length; i--;) {
                if (comparator(arr[i], item)) {
                    return true;
                }
            }
        }
        return false;
    }

    // add
    function add(arr, item, comparator) {
        arr = angular.isArray(arr) ? arr : [];
        if (!contains(arr, item, comparator)) {
            arr.push(item);
        }
        return arr;
    }

    // remove
    function remove(arr, item, comparator) {
        if (angular.isArray(arr)) {
            for (var i = arr.length; i--;) {
                if (comparator(arr[i], item)) {
                    arr.splice(i, 1);
                    break;
                }
            }
        }
        return arr;
    }

    // http://stackoverflow.com/a/19228302/1458162
    function postLinkFn(scope, elem, attrs) {
        // compile with `ng-model` pointing to `checked`
        $compile(elem)(scope);

        // getter / setter for original model
        var getter = $parse(attrs.checklistModel);
        var setter = getter.assign;
        var checklistChange = $parse(attrs.checklistChange);

        // value added to list
        var value = $parse(attrs.checklistValue)(scope.$parent);


        var comparator = angular.equals;

        if (attrs.hasOwnProperty('checklistComparator')) {
            comparator = $parse(attrs.checklistComparator)(scope.$parent);
        }

        // watch UI checked change
        scope.$watch('checked', function (newValue, oldValue) {
            if (newValue === oldValue) {
                return;
            }
            var current = getter(scope.$parent);
            if (newValue === true) {
                setter(scope.$parent, add(current, value, comparator));
            } else {
                setter(scope.$parent, remove(current, value, comparator));
            }

            if (checklistChange) {
                checklistChange(scope);
            }
        });

        // declare one function to be used for both $watch functions
        function setChecked(newArr, oldArr) {
            scope.checked = contains(newArr, value, comparator);
        }

        // watch original model change
        // use the faster $watchCollection method if it's available
        if (angular.isFunction(scope.$parent.$watchCollection)) {
            scope.$parent.$watchCollection(attrs.checklistModel, setChecked);
        } else {
            scope.$parent.$watch(attrs.checklistModel, setChecked, true);
        }
    }

    return {
        restrict: 'A',
        priority: 1000,
        terminal: true,
        scope: true,
        compile: function (tElement, tAttrs) {
            if (tElement[0].tagName !== 'INPUT' || tAttrs.type !== 'checkbox') {
                throw 'checklist-model should be applied to `input[type="checkbox"]`.';
            }

            if (!tAttrs.checklistValue) {
                throw 'You should provide `checklist-value`.';
            }

            // exclude recursion
            tElement.removeAttr('checklist-model');

            // local scope var storing individual checkbox model
            tElement.attr('ng-model', 'checked');

            return postLinkFn;
        }
    };
}]);
