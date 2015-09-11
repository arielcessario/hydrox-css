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
    vm.openMobile = false;
    vm.openThumbs = false;
    vm.scrollTo = scrollTo;
    vm.scrollToMobile = scrollToMobile;
    vm.thumbs = [];
    vm.selectImage = function (img) {
        vm.img = img;
    };


    var mainContainer = angular.element(document.querySelector('#main-container'));


    var pos_origin = 0;

    function scrollToMobile(pos) {


        vm.openMobile = false;
        scrollTo(pos + (500 - (window.innerWidth / 2)));

    }

    function scrollTo(pos) {

        //var cantidad = pos;
        var timer = 0;
        var speed = 20;
        vm.header = false;

        var is_end = false;
        var pos_actual = document.getElementById('main-container').scrollLeft;
        var pos_next = pos_actual + (pos / 25);


        if (pos_origin == 0) {
            pos_origin = pos_actual;
        }

        if ((pos_actual < pos && pos_next > pos) ||
            (pos_actual > pos && pos_next < pos)) {

            is_end = true;
            pos_origin = 0;
        }


        //for(var i = 0; i<cantidad/8; i++){
        if (document.getElementById('main-container').scrollLeft != pos) {
            setTimeout(function () {
                //console.log(document.getElementById('parallax').scrollTop);

                if (pos < document.getElementById('main-container').scrollLeft) {

                    document.getElementById('main-container').scrollLeft -= pos_origin / 25;

                } else {
                    document.getElementById('main-container').scrollLeft += pos / 25;

                }
                //console.log(document.getElementById('parallax').scrollTop);
                //timer += 1;
                if (!is_end) {
                    vm.scrollTo(pos);
                }
            }, 10);

        }
    }


    mainContainer[0].addEventListener("DOMMouseScroll", function (e) {
        var e = window.event || e;

        mainContainer[0].scrollLeft = mainContainer[0].scrollLeft + ((e.detail / 3) * 132);
    });

    mainContainer[0].addEventListener("mousewheel", function (e) {
        var e = window.event || e;
        //console.log(mainContainer[0].scrollLeft);
        //console.log(e.wheelDeltaY);
        mainContainer[0].scrollLeft = mainContainer[0].scrollLeft - e.wheelDeltaY;
    });

    mainContainer[0].addEventListener('scroll', function () {

        //animate();
        //requestAnimationFrame(animate);
        console.log(mainContainer[0].scrollLeft);


        vm.ypos = mainContainer[0].scrollLeft;

        if (mainContainer[0].scrollLeft > 800) {
            vm.header = true;
        }else{
            vm.header = false;
        }


        if ((mainContainer[0].scrollLeft > 800 && mainContainer[0].scrollLeft < 1800) && vm.seccion != 'seccion-02') {
            //console.log('entra');

            vm.openThumbs = false;
            vm.seccion = 'seccion-02';
            vm.img = 'zapa_neoprene_01.gif';
            vm.thumbs = [
                {big:'zapa_neoprene_01.gif', small:'zapa_neoprene_01t.png'},
                {big:'Zapa_neoprene_02.gif', small:'Zapa_neoprene_02t.png'}
            ];
            if ((mainContainer[0].scrollLeft > 1000) && (mainContainer[0].scrollLeft< 1600)){

            }

        }

        if ((mainContainer[0].scrollLeft > 1800 && mainContainer[0].scrollLeft < 2800) && vm.seccion != 'seccion-03') {
            vm.openThumbs = false;
            vm.seccion = 'seccion-03';
            vm.img = 'bota_01.gif';
            //$scope.$apply();
            vm.thumbs = [
                {big:'bota_01.gif', small:'bota_01t.png'},
                {big:'bota_02.gif', small:'bota_02t.png'},
                {big:'bota_03.gif', small:'bota_03t.png'}
            ];
        }


        if ((mainContainer[0].scrollLeft > 2800 && mainContainer[0].scrollLeft < 3800) && vm.seccion != 'seccion-04') {
            vm.openThumbs = false;
            //console.log('entra');
            vm.seccion = 'seccion-04';
            vm.img = 'medias_neoprene_01.gif';
            vm.thumbs = [
                {big:'medias_neoprene_01.gif', small:'medias_neoprene_01t.png'},
                {big:'medias_neoprene_02.gif', small:'medias_neoprene_02t.png'}
            ];
            //$scope.$apply();
        }


        if ((mainContainer[0].scrollLeft > 3800 && mainContainer[0].scrollLeft < 4800) && vm.seccion != 'seccion-05') {
            vm.openThumbs = false;
            //console.log('entra');
            vm.seccion = 'seccion-05';
            vm.img = 'jardinero_01.gif';
            vm.thumbs = [
                {big:'jardinero_01.gif', small:'jardinero_01t.png'},
                {big:'jardinero_02.gif', small:'jardinero_02t.png'},
                {big:'jardinero_03.gif', small:'jardinero_03t.png'},
                {big:'jardinero_04.gif', small:'jardinero_04t.png'}
            ];
            //$scope.$apply();
        }
        if ((mainContainer[0].scrollLeft > 4800 && mainContainer[0].scrollLeft < 5800) && vm.seccion != 'seccion-06') {
            vm.openThumbs = false;
            //console.log('entra');
            vm.seccion = 'seccion-06';
            vm.img = 'pantalon_neoprene_01.gif';
            vm.thumbs = [
                {big:'pantalon_neoprene_01.gif', small:'pantalon_neoprene_01t.png'},
                {big:'pantalon_neoprene_02.gif', small:'pantalon_neoprene_02t.png'},
                {big:'pantalon_neoprene_03.gif', small:'pantalon_neoprene_03t.png'},
                {big:'pantalon_neoprene_04.gif', small:'pantalon_neoprene_04t.png'},
                {big:'pantalon_neoprene_05.gif', small:'pantalon_neoprene_05t.png'}
            ];
            //$scope.$apply();
        }
        if ((mainContainer[0].scrollLeft > 5800 && mainContainer[0].scrollLeft < 6800) && vm.seccion != 'seccion-07') {
            vm.openThumbs = false;
            //console.log('entra');
            vm.seccion = 'seccion-07';
            vm.img = 'calza_04.gif';
            vm.thumbs = [
                {big:'calza_01.gif', small:'calza_01t.png'},
                {big:'calza_02.gif', small:'calza_02t.png'},
                {big:'calza_03.gif', small:'calza_03t.png'},
                {big:'calza_04.gif', small:'calza_04t.png'}
            ];
            //$scope.$apply();
        }
        if ((mainContainer[0].scrollLeft > 6800 && mainContainer[0].scrollLeft < 7800) && vm.seccion != 'seccion-08') {
            vm.openThumbs = false;
            //console.log('entra');
            vm.seccion = 'seccion-08';
            vm.img = 'remera_neoprene_02.gif';
            vm.thumbs = [
                {big:'remera_neoprene_01.gif', small:'remera_neoprene_01t.png'},
                {big:'remera_neoprene_02.gif', small:'remera_neoprene_02t.png'}
            ];
            //$scope.$apply();
        }
        if ((mainContainer[0].scrollLeft > 7800 && mainContainer[0].scrollLeft < 8800) && vm.seccion != 'seccion-09') {
            vm.openThumbs = false;
            //console.log('entra');
            vm.seccion = 'seccion-09';
            vm.img = 'remera_lycra_01.gif';
            vm.thumbs = [
                {big:'remera_lycra_01.gif', small:'remera_lycra_01t.png'},
                {big:'remera_lycra_02.gif', small:'remera_lycra_02t.png'},
                {big:'remera_lycra_03.gif', small:'remera_lycra_03t.png'},
                {big:'remera_lycra_04.gif', small:'remera_lycra_04t.png'},
                {big:'remera_lycra_05.gif', small:'remera_lycra_05t.png'}
            ];
            //$scope.$apply();
        }
        if ((mainContainer[0].scrollLeft > 8800 && mainContainer[0].scrollLeft < 9800) && vm.seccion != 'seccion-10') {
            vm.openThumbs = false;
            //console.log('entra');
            vm.seccion = 'seccion-10';
            vm.img = 'barbijo.gif';
            vm.thumbs = [];
            //$scope.$apply();
        }
        if ((mainContainer[0].scrollLeft > 9800 && mainContainer[0].scrollLeft < 10800) && vm.seccion != 'seccion-11') {
            vm.openThumbs = false;
            //console.log('entra');
            vm.seccion = 'seccion-11';
            vm.img = 'milton_01.gif';
            vm.thumbs = [
                {big:'milton_01t.gif', small:'milton_01t.png'},
                {big:'milton_02t.gif', small:'milton_02t.png'}
            ];
            //$scope.$apply();
        }
        if ((mainContainer[0].scrollLeft > 10800 && mainContainer[0].scrollLeft < 11800) && vm.seccion != 'seccion-12') {
            vm.openThumbs = false;
            //console.log('entra');
            vm.seccion = 'seccion-12';
            vm.img = 'milton_01t.gif';
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
