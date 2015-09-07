'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ngAnimate'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/view1'});
    }])
    .controller('MainController', MainController);


MainController.$inject = ['$scope'];
function MainController($scope) {
    var vm = this;

    vm.seccion = 'seccion-01';
    vm.ypos = 0;
    vm.selectImage = function (img) {
        vm.img = img;
    };


    var mainContainer = angular.element(document.querySelector('#main-container'));


    mainContainer[0].addEventListener("mousewheel", function(e){
        var e = window.event || e;
        console.log(mainContainer[0].scrollLeft);
        console.log(e.wheelDeltaY);
        mainContainer[0].scrollLeft = mainContainer[0].scrollLeft - e.wheelDeltaY;
    });

    mainContainer[0].addEventListener("wheel", function(e){
        var e = window.event || e;
        console.log(mainContainer[0].scrollLeft);
        console.log(e.wheelDeltaY);
        mainContainer[0].scrollLeft = mainContainer[0].scrollLeft - e.wheelDeltaY;
    });

    mainContainer[0].addEventListener('scroll', function () {

        //animate();
        //requestAnimationFrame(animate);
        console.log(mainContainer[0].scrollLeft);


        vm.ypos = mainContainer[0].scrollLeft;


        if ((mainContainer[0].scrollLeft > 800 && mainContainer[0].scrollLeft < 1800) && vm.seccion != 'seccion-02') {
            //console.log('entra');
            vm.seccion = 'seccion-02';
            vm.img = 'zapa_neoprene_01.gif';

        }

        if ((mainContainer[0].scrollLeft > 1800 && mainContainer[0].scrollLeft < 2800) && vm.seccion != 'seccion-03') {
            console.log('entra');
            vm.seccion = 'seccion-03';
            vm.img = 'bota_01.gif';
            //$scope.$apply();
        }


        if ((mainContainer[0].scrollLeft > 2800 && mainContainer[0].scrollLeft < 3800) && vm.seccion != 'seccion-04') {
            //console.log('entra');
            vm.seccion = 'seccion-04';
            vm.img = 'medias_neoprene_01.gif';
            //$scope.$apply();
        }


        if ((mainContainer[0].scrollLeft > 3800 && mainContainer[0].scrollLeft < 4800) && vm.seccion != 'seccion-05') {
            //console.log('entra');
            vm.seccion = 'seccion-05';
            vm.img = 'jardinero_01.gif';
            //$scope.$apply();
        }
        if ((mainContainer[0].scrollLeft > 4800 && mainContainer[0].scrollLeft < 5800) && vm.seccion != 'seccion-06') {
            //console.log('entra');
            vm.seccion = 'seccion-06';
            vm.img = 'pantalon_neoprene_01.gif';
            //$scope.$apply();
        }
        if ((mainContainer[0].scrollLeft > 5800 && mainContainer[0].scrollLeft < 6800) && vm.seccion != 'seccion-07') {
            //console.log('entra');
            vm.seccion = 'seccion-07';
            vm.img = 'zapa_neoprene_01.gif';
            //$scope.$apply();
        }
        if ((mainContainer[0].scrollLeft > 6800 && mainContainer[0].scrollLeft < 7800) && vm.seccion != 'seccion-08') {
            //console.log('entra');
            vm.seccion = 'seccion-08';
            vm.img = 'calza_01.gif';
            //$scope.$apply();
        }
        if ((mainContainer[0].scrollLeft > 7800 && mainContainer[0].scrollLeft < 8800) && vm.seccion != 'seccion-09') {
            //console.log('entra');
            vm.seccion = 'seccion-09';
            vm.img = 'remera_lycra_01.gif';
            //$scope.$apply();
        }
        if ((mainContainer[0].scrollLeft > 8800 && mainContainer[0].scrollLeft < 9800) && vm.seccion != 'seccion-10') {
            //console.log('entra');
            vm.seccion = 'seccion-10';
            vm.img = 'remera_neoprene_01.gif';
            //$scope.$apply();
        }
        if ((mainContainer[0].scrollLeft > 9800 && mainContainer[0].scrollLeft < 10800) && vm.seccion != 'seccion-11') {
            //console.log('entra');
            vm.seccion = 'seccion-11';
            vm.img = 'barbijo.gif';
            //$scope.$apply();
        }
        if ((mainContainer[0].scrollLeft > 10800 && mainContainer[0].scrollLeft < 11800) && vm.seccion != 'seccion-12') {
            //console.log('entra');
            vm.seccion = 'seccion-12';
            vm.img = 'milton_01.gif';
            //$scope.$apply();
        }
        if ((mainContainer[0].scrollLeft > 11800 && mainContainer[0].scrollLeft < 12800) && vm.seccion != 'seccion-13') {
            //console.log('entra');
            vm.seccion = 'seccion-13';
            vm.img = 'zapa_neoprene_01.gif';
            //$scope.$apply();
        }

        //showPosition();
        //
        //function showPosition(){
        //    console.log('top: ' + window.pageYOffset);
        //    console.log('bottom: ' + (window.pageYOffset + window.innerHeight));
        //}
        $scope.$apply();
    }, false);
}
