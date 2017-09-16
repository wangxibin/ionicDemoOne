(function () {
  'use strict';

  angular
    .module('app.addAssessment')
    .config(AddAssessmentConfig);

  AddAssessmentConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function AddAssessmentConfig($stateProvider) {
    $stateProvider
      .state('addAssessment', {
        url: '/addAssessment',
        params: {
          addAssessmentData: null
        },
        templateUrl: 'templates/assessment/addAssessment/addAssessment.html'
      });
  }
}());

