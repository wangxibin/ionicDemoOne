(function () {
  'use strict';

  angular
    .module('app.problemFeedbackDetails')
    .controller('ProblemFeedbackDetailsController', ProblemFeedbackDetailsController);

  ProblemFeedbackDetailsController.$inject = ['$scope', '$rootScope', '$stateParams', 'ProblemFeedbackDetailsService', '$ionicPopup', '$ionicHistory'];

  /** @ngInject */
  function ProblemFeedbackDetailsController($scope, $rootScope, $stateParams, ProblemFeedbackDetailsService, $ionicPopup, $ionicHistory) {
    var vm = this;
    vm.title = '问题详情'
    vm.fromWhere = '';
    vm.data = {};//从上一页面传递过来的数据要存储到这个data中
    vm.problemDetails = {
      id: '',
      planId: ''
    };
    vm.footerContent = '确定'
    vm.fun = {
      initCamera: initCamera,
      uploadProblemFeedbackData: uploadProblemFeedbackData,
      deletePic: deletePic
    }
    vm.uploadData = {
      id: '',
      planId: '',
      feedbackDescription: '',
      feedbackUser: '',
      img: ''
    };
    vm.imgPath = '';

    activate();

    function activate() {

      if ($stateParams.problemItem) {
        vm.data = $stateParams.problemItem;
      }
      if ($stateParams.fromWhere) {
        vm.fromWhere = $stateParams.fromWhere;
      }

      switch (vm.fromWhere) {
        case 'waitForWork':
          ProblemFeedbackDetailsService.getProblemDetailsData(vm.data, function (resData) {
            if (resData.length == 0) {//resData的格式是[]如果resData是个空数组，取resData[0]时会得到undefined，所以需要判断
            } else {
              vm.problemDetails = resData[0];
            }
            ProblemFeedbackDetailsService.getProblemFeedbackDetailsMap(vm.problemDetails);
          });
          break;
        case 'problemFeedback':
          vm.problemDetails = $stateParams.problemItem;
          ProblemFeedbackDetailsService.getProblemFeedbackDetailsMap(vm.problemDetails);
          break
        default:
          ProblemFeedbackDetailsService.getProblemFeedbackDetailsMap(vm.problemDetails);
          break;
      }
    }


    function initCamera() {

      var options = {
        quality: 100,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: Camera.PictureSourceType.CAMERA,
        allowEdit: true,
        encodingType: Camera.EncodingType.JPEG,
        targetWidth: 200,
        targetHeight: 200,
        popoverOptions: CameraPopoverOptions,
        saveToPhotoAlbum: true,
        correctOrientation: true
      };

      $cordovaCamera.getPicture(options).then(function (imageData) {
        var image = document.getElementById('problemFeedbackDetailsImg');
        image.src = "data:image/jpeg;base64," + imageData;
        vm.imgPath = moment().format('YYYY-MM-DD HH:mm:ss') + '.jpeg';
        vm.uploadData.img = imageData;
      }, function (err) {
        $ionicPopup.alert({
          title: '照片获取失败，请重新拍照!'
        });
      });
    }


    function uploadProblemFeedbackData() {
      vm.uploadData.id = vm.problemDetails.id;
      vm.uploadData.planId = vm.problemDetails.planId;
      vm.uploadData.feedbackUser = $rootScope.userName;
      if (vm.uploadData.id == '' || vm.uploadData.planId == '' || vm.uploadData.feedbackUser == '') {
        $ionicPopup.alert({
          title: '提示信息',
          template: '数据不全无法上传数据！'
        })
      } else if (vm.uploadData.feedbackDescription == '' || vm.uploadData.img == '') {
        $ionicPopup.confirm({
          title: '提示信息',
          template: '整改情况未填或者没有拍照，确认要上传么？'
        }).then(function (res) {
          if (res) {
            ProblemFeedbackDetailsService.uploadProblemFeedbackData(vm.uploadData, function (res) {
              $ionicHistory.goBack();
            });
          } else {
            return;
          }
        });
      }
    }

    //长按删除某张图片
    function deletePic() {

      $ionicPopup.confirm({
        title: '提示信息',
        template: '确认要删除这张照片么？'
      }).then(function (res) {
        if (res) {
          vm.uploadData.img = '';
          var image = document.getElementById('problemFeedbackDetailsImg');
          image.src = '';
        } else {
          return;
        }
      });


    }
  }
})();
