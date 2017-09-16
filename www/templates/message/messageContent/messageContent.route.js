(function () {
  'use strict';

  angular
    .module('app.messageContent')
    .config(messageContentConfig);

  messageContentConfig.$inject = ['$stateProvider'];

  /** @ngInject */
  function messageContentConfig($stateProvider) {
    $stateProvider
      .state('messageContent', {
        url: '/messageContent/:msgId',
        templateUrl: 'templates/message/messageContent/messageContent.html'
      });
  }
}());
