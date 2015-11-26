'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ngAnimate',
    'ngCookies',
    'acUtils',
    'angular-storage',
    'angular-jwt',
    'login.login'
]).
    config(['$routeProvider', 'jwtInterceptorProvider', '$httpProvider',
        function ($routeProvider, jwtInterceptorProvider, $httpProvider) {
            //$routeProvider.otherwise({redirectTo: '/view1'});

            jwtInterceptorProvider.tokenGetter = function (store) {
                return store.get('jwt');
            };
            $httpProvider.interceptors.push('jwtInterceptor');
        }])

    .controller('MainController', MainController);


MainController.$inject = ['$scope', '$timeout', '$http', 'store', 'LoginService', 'AcUtilsService', '$location', 'jwtHelper'];
function MainController($scope, $timeout, $http, store, LoginService, AcUtilsService, $location, jwtHelper) {
    var vm = this;

    vm.seccion = 'seccion-01';
    vm.ypos = 0;
    vm.openMobile = false;
    vm.openThumbs = false;
    vm.openContact = false;
    vm.hideText = false;
    vm.scrollTo = scrollTo;
    vm.scrollToMobile = scrollToMobile;
    vm.sendMail = sendMail;
    vm.thumbs = [];

    var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
    // Opera 8.0+ (UA detection to detect Blink/v8-powered Opera)
    vm.isFirefox = typeof InstallTrigger !== 'undefined';   // Firefox 1.0+
    vm.isSafari = Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
    // At least Safari 3+: "[object HTMLElementConstructor]"
    vm.isChrome = !!window.chrome && !isOpera;              // Chrome 1+
    vm.isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6


    vm.img02 = 'zapa_neoprene_01.gif';
    vm.img03 = 'bota_01.gif';
    vm.img04 = 'medias_neoprene_01.gif';
    vm.img05 = 'jardinero_04.gif';
    vm.img06 = 'pantalon_neoprene_04.gif';
    vm.img07 = 'calza_04.gif';
    vm.img08 = 'remera_neoprene_02.gif';
    vm.img09 = 'remera_lycra_04.gif';
    vm.img10 = 'barbijo.gif';
    vm.img11 = 'milton_01.gif';

    vm.contactoNombre = '';
    vm.contactoTelefono = '';
    vm.contactoMail = '';
    vm.contactoMensaje = '';
    vm.enviado = false;
    vm.contactoError = false;

    vm.fotoDownload = '';
    vm.fotosDownload = [];


    vm.descargaDownload = '';
    vm.descargasDownload = [];


    vm.usuario = {
        nombre: '',
        mail: '',
        password: ''
    };

    vm.saveUsuario = saveUsuario;
    vm.login = login;
    vm.nuevoUsuario = nuevoUsuario;
    vm.recuperarPassword = recuperarPassword;
    vm.mail = '';
    vm.password = '';
    vm.loginPrev = loginPrev;
    vm.activarUsuario = activarUsuario;
    vm.logout = logout;
    vm.downloadURI = downloadURI;
    vm.updateUsuario = updateUsuario;
    vm.goToAdmin = goToAdmin;
    vm.getDescargas = getDescargas;
    vm.adelante = adelante;
    vm.atras = atras;
    vm.usuarios = [];
    vm.logged = undefined;
    vm.admin = 'contacto';


    function adelante() {
        scrollTo(mainContainer[0].scrollLeft + mainWidth);
    }

    function atras() {

        scrollTo(mainContainer[0].scrollLeft - mainWidth);
    }

    function getDescargas() {
        return $http.get('cliente.php?function=getDescargas')
            .success(function (data) {

                var array = Object.keys(data).map(function (val) {
                    return data[val]
                });

                for (var i = 0; i < array.length; i++) {
                    vm.descargasDownload.push({
                        texto: array[i].split('.')[0].replace('_', ' ').toUpperCase(),
                        link: array[i]
                    })
                }
            })
            .error(function (data) {
                console.log(data);
            })
    }


    function goToAdmin(screen) {
        scrollToMobile(11);
        vm.admin = screen;
    }

    function downloadURI(origen) {
        var name = '';
        var uri = '';
        uri = './descargas/' + vm.fotoDownload.link;
        name = vm.fotoDownload.link;

        var link = document.createElement("a");
        link.download = name;
        link.href = uri;
        //console.log(link);
        link.click();
    }

    if (store.get('jwt')) {
        vm.logged = jwtHelper.decodeToken(store.get('jwt'));

        vm.usuario.nombre = vm.logged.data.nombre;
        vm.usuario.mail = vm.logged.data.userName;
        vm.usuario.cliente_id = vm.logged.data.userId;
        getDescargas();

        if (jwtHelper.decodeToken(store.get('jwt')).data.rol == 1) {
            LoginService.getClientes(function (data) {
                vm.usuarios = data;
            })
        }
    }


    function logout() {
        store.remove('jwt');
        vm.isLogin = true;
        vm.logged = undefined;
        vm.admin == 'admin';
    }


    function activarUsuario(cliente) {
        console.log(cliente);

        cliente.status = (cliente.status == 0) ? 1 : 0;

        LoginService.updateCliente(cliente, function (data) {
            console.log(data);
        })
    }

    function updateUsuario() {
        var conErrores = false;

        if (vm.usuario.cliente_id == -1) {
            AcUtilsService.validations('nombre', 'Esta opci�n es solo para modificaci�n, debe seleccionar un usuario');
            conErrores = true;
            return;
        }

        if (vm.usuario.nombre.trim().length == 0) {
            AcUtilsService.validations('nombre', 'El nombre es obligatorio');
            conErrores = true;
        }


        if (!AcUtilsService.validateEmail(vm.usuario.mail)) {
            AcUtilsService.validations('mail', 'El mail es incorrecto');
            conErrores = true;
        }

        if (conErrores) {
            return;
        }

        LoginService.updateCliente(vm.usuario, function (data) {

        });
    }


    function saveUsuario() {

        var conErrores = false;


        if (vm.usuario.nombre.trim().length == 0) {
            AcUtilsService.validations('nombre', 'El nombre es obligatorio');
            conErrores = true;
        }

        if (vm.usuario.password.trim().length == 0) {
            AcUtilsService.validations('password', 'El password es obligatorio');
            conErrores = true;
        }

        if (!AcUtilsService.validateEmail(vm.usuario.mail)) {
            AcUtilsService.validations('email', 'El mail es incorrecto');
            conErrores = true;
        }


        vm.usuario.telefono = vm.usuario.mail;
        vm.usuario.apellido = vm.usuario.mail;
        vm.usuario.direccion = vm.usuario.mail;
        if (conErrores) {
            return;
        }
        LoginService.existeCliente(vm.usuario.mail, function (data) {

            if (data == 'true') {
                AcUtilsService.validations('email', 'El usuario ya existe');
            } else {
                LoginService.create(vm.usuario, function (data) {
                    if (data == 'true') {
                        LoginService.login(vm.usuario.mail, vm.usuario.password, function (data) {
                            if (data != -1) {
                                store.set('jwt', data);
                                $location.path('/');
                            } else {
                            }
                        });

                    }
                });
            }
        });


    }


    function loginPrev(event) {
        if (event.keyCode == 13) {
            login();
        }
    }

    if (store.get('jwt')) {
        $location.path('/administracion');
    }


    function recuperarPassword() {
        if (!AcUtilsService.validateEmail(vm.mail)) {
            AcUtilsService.validations('mail', 'El mail es incorrecto');
            return;
        }
        LoginService.forgotPassword(vm.mail, function (data) {
            console.log(data);
        });
    }

    function nuevoUsuario() {
        vm.isLogin = false;
        vm.isNuevoUsuario = true;
        vm.admin = 'nuevo';
    }

    function login() {
        var conErrores = false;


        if (vm.password.trim().length == 0) {
            AcUtilsService.validations('password', 'El password es obligatorio');
            conErrores = true;
        }

        if (!AcUtilsService.validateEmail(vm.mail)) {
            AcUtilsService.validations('mail', 'El mail es incorrecto');
            conErrores = true;
        }

        if (conErrores) {
            return;
        }

        LoginService.login(vm.mail, vm.password, function (data) {
            console.log(data);
            if (data != -1) {
                //LoginState.isLogged = true;
                store.set('jwt', data);
                if (jwtHelper.decodeToken(store.get('jwt')).data.rol == 1) {
                    LoginService.getClientes(function (data) {
                        vm.usuarios = data;
                    })
                } else {
                    vm.usuarios = [];
                }

                vm.logged = jwtHelper.decodeToken(store.get('jwt'));
                vm.admin = 'admin';

                getFotos();
                getDescargas();
            } else {
                //LoginState.isLogged = false;
                AcUtilsService.validations('password', 'Mail o password incorrectos');
            }
        });
    }


    function sendMail() {

        //console.log(vm.mail);
        return $http.post('./contact.php',
            {
                'email': vm.contactoMail,
                'nombre': vm.contactoNombre,
                'mensaje': vm.contactoMensaje,
                'asunto': vm.contactoTelefono
            })
            .success(
            function (data) {
                vm.enviado = true;
                $timeout(hideMessage, 3000);
                function hideMessage() {
                    vm.enviado = false;
                }

                vm.contactoNombre = '';
                vm.contactoTelefono = '';
                vm.contactoMail = '';
                vm.contactoMensaje = '';
            })
            .error(function (data) {

                vm.contactoError = true;
                $timeout(hideMessage, 3000);
                function hideMessage() {
                    vm.contactoError = false;
                }
            });
    }


    vm.selectImage = function (big, img) {
        switch (img) {
            case 'img02':
                vm.img02 = big;
                break;
            case 'img03':
                vm.img03 = big;
                break;
            case 'img04':
                vm.img04 = big;
                break;
            case 'img05':
                vm.img05 = big;
                break;
            case 'img06':
                vm.img06 = big;
                break;
            case 'img07':
                vm.img07 = big;
                break;
            case 'img08':
                vm.img08 = big;
                break;
            case 'img09':
                vm.img09 = big;
                break;
            case 'img10':
                vm.img10 = big;
                break;
            case 'img11':
                vm.img11 = big;
                break;
        }
    };


    /* @description: Funci�n que verifica si es celu o no.
     */
    window.mobilecheck = function () {
        var check = false;
        (function (a) {
            //console.log(a);
            if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))check = true
        })(navigator.userAgent || navigator.vendor || window.opera);

        //(function (a) {
        //    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))check = true
        //})(navigator.userAgent || navigator.vendor || window.opera);
        return check;
    };




    // Si es if(vm.isMobile), significa que despu�s de ah� vienen cosas para celu.
    vm.isMobile = window.mobilecheck();
    //console.log(vm.isMobile);


    // Contenedor Principal
    var mainContainer = angular.element(document.querySelector('#main-container'));

    // Ancho de la pantalla del cliente - No es la resoluci�n es al ancho interno del explorador
    var mainWidth = mainContainer[0].clientWidth;

    // Alto de la pantalla del cliente - Es el alto interno del explorador
    var mainHeight = mainContainer[0].clientHeight;

    // Listado de todos los divs que tengan las class = seccion
    var seccionPrincipal = angular.element(document.querySelector('#secciones'));

    // Grupo que contiene todas las capas pero no es el contenedor principal, sirve para parallax
    var group1 = angular.element(document.querySelector('#group1'));

    // Secci�n del fondo, la que tiene la imagen de los poligonos
    var backgroundLayer = angular.element(document.querySelector('#background-layer'));

    // Secci�n del que est� adelante de los productos - fore
    var fore = angular.element(document.querySelector('#layer-fore'));

    // Secci�n del que est� mas adelante de todo - fore2
    var fore2 = angular.element(document.querySelector('#layer-fore2'));

    // Div final, el que tiene el formulario de contacto y todo lo dem�s.
    var form = angular.element(document.querySelector('#form'));

    // Todas las secciones - seccion-01, seccion-02, etc
    var secciones = angular.element(document.querySelectorAll('.seccion'));

    // Contenedores de imagen y texto
    var containers = angular.element(document.querySelectorAll('.left-container'));
    var containersRight = angular.element(document.querySelectorAll('.right-container'));

    // Margen que se agrega para que las secciones ocupen un poco mas de espacio, en especial en celu
    var margen = 200;

    drawScreen();
    //window.addEventListener('load', drawScreen);
    window.addEventListener('resize', drawScreen);

    function drawScreen() {


        if (vm.isMobile) {
            margen = 250;
        }

        var multiplicador = (mainWidth * 13) + margen;
        // Son 12 secciones - 10 de fotos - 1 presentaci�n - 1 contacto
        // Las hago de 1.5 de ancho cada secci�n para tener espacio para recorrer cuando est�n fijos productos
        seccionPrincipal[0].style.maxWidth = multiplicador + 'px';
        seccionPrincipal[0].style.width = multiplicador + 'px';

        // Hace que el formulario sea del alto de la pantalla.
        if (form[0] != undefined) {
            form[0].style.height = mainHeight + 'px';
            form[0].style.height = mainHeight + 'px';
        }


        // Tama�o del grupo parallax
        group1[0].style.minWidth = multiplicador + 'px';

        // tama�o del layer mas al fondo
        if (vm.isMobile) {
            backgroundLayer[0].style.minWidth = ((mainWidth * 12) + (margen * 14)) + 'px';
        } else {
            backgroundLayer[0].style.minWidth = (mainWidth * 12) + 'px';
        }

        // agrego marge a las capas de adelante
        fore[0].style.marginLeft = (mainWidth * -11) + 'px';
        fore2[0].style.marginLeft = (mainWidth * -14) + 'px';


        // Doy el estilo a las secciones
        for (var i = 0; i < secciones.length; i++) {

            if (vm.isMobile) {
                if (i != 0) {
                    secciones[i].style.width = (mainWidth + margen) + 'px';
                    secciones[i].style.maxWidth = (mainWidth + margen) + 'px';
                    secciones[i].style.minWidth = (mainWidth + margen) + 'px';
                } else {
                    secciones[i].style.width = (mainWidth) + 'px';
                    secciones[i].style.maxWidth = (mainWidth) + 'px';
                    secciones[i].style.minWidth = (mainWidth) + 'px';
                    secciones[i].style.marginRight = (mainWidth + margen) + 'px';
                }
            } else {
                secciones[i].style.width = (mainWidth) + 'px';
                secciones[i].style.maxWidth = (mainWidth) + 'px';
                secciones[i].style.minWidth = (mainWidth) + 'px';
            }

            if (vm.isMobile) {
                // Ac� adentro las cosas para celu
                secciones[i].style.position = 'relative';
                if (i != 0) {
                    secciones[i].style.marginTop = (-1 * (mainWidth / 1.2)) + 'px';
                }

                // Deja fija a la secci�n de contacto.
                if (i == secciones.length - 1) {
                    secciones[i].style.marginTop = '0px';
                }
            } else {

                // Fija a las secciones para que se puedan mostrar en la pantalla, pero solo cuando no es movil
                secciones[i].style.position = 'fixed';

                // Agrega margen a todo menos al formulario final
                if (i < secciones.length - 1) {
                    secciones[i].style.marginTop = (mainWidth / 8) + 'px';
                } else {
                    // Todo lo que est� ac� solo aplica al formulario final
                }


                // Solo para firefox
                if (vm.isFirefox) {
                    if (i != 0 && i != secciones.length - 1) {
                        secciones[i].style.marginLeft = (-mainWidth / 2) + 'px';
                    }
                }
            }
        }


        // Estilo al contenedor de imagen y de texto
        for (var i = 0; i < containers.length; i++) {

            if (mainHeight > mainWidth) {
                containers[i].style.height = (mainWidth / 1.1) + 'px';
                containers[i].style.maxHeight = (mainWidth / 1.1) + 'px';
                containers[i].style.maxWidth = (mainWidth / 1.1) + 'px';
                containers[i].style.width = (mainWidth / 1.1) + 'px';
                containersRight[i].style.marginLeft = (-1 * (mainWidth)) + 'px';

            } else {
                containers[i].style.height = (mainWidth / 2.2) + 'px';
                containers[i].style.maxHeight = (mainWidth / 2.2) + 'px';
                containers[i].style.maxWidth = (mainWidth / 2.2) + 'px';
                containers[i].style.width = (mainWidth / 2.2) + 'px';
            }


        }

    }


    var pos_origin = 0;

    function scrollToMobile(id) {

        var pos = (id) * mainWidth;

        if (vm.isMobile) {

            console.log((mainWidth + margen) * (id + 1));
            scrollTo(((mainWidth + margen) * (id)) + ((mainWidth + margen) / 1.9));


        } else {

            vm.openMobile = false;

            scrollTo(pos);
        }

    }

    function scrollTo(pos) {

        //var cantidad = pos;
        var timer = 0;
        var speed = 70;
        vm.header = false;

        var is_end = false;
        var pos_actual = document.getElementById('main-container').scrollLeft;
        var pos_next = Math.round(pos_actual + (pos / speed));


        if (pos_origin == 0) {
            pos_origin = pos_actual;
        }

        if ((pos_actual < pos && pos_next > pos) ||
            (pos_actual > pos && pos_next < pos)) {

            //console.log('pos ' + pos_actual);
            //console.log('pos ' + pos);


            is_end = true;
            pos_origin = 0;
        }

        //console.log(is_end);

        //for(var i = 0; i<cantidad/8; i++){
        if (document.getElementById('main-container').scrollLeft != pos) {
            setTimeout(function () {
                //console.log(document.getElementById('parallax').scrollTop);

                if (is_end) {
                    document.getElementById('main-container').scrollLeft = pos;
                } else {
                    if (pos < document.getElementById('main-container').scrollLeft) {

                        document.getElementById('main-container').scrollLeft -= Math.round(pos_origin / speed);

                    } else {
                        document.getElementById('main-container').scrollLeft += Math.round(pos / speed);

                    }
                }

                //console.log(document.getElementById('parallax').scrollTop);
                //timer += 1;
                if (!is_end) {
                    vm.scrollTo(pos);
                } else {
                    console.log(pos);
                }
            }, 1);

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
        //console.log(mainContainer[0].scrollLeft);


        vm.ypos = mainContainer[0].scrollLeft;

        if (mainContainer[0].scrollLeft > ((mainWidth * 1) - 200)) {

            vm.header = true;
        } else {
            vm.seccion = '';
            vm.header = false;
        }


        if (vm.isMobile) {
            if ((mainContainer[0].scrollLeft > ((mainWidth * 1) + (-240) + (250 * 2)) && mainContainer[0].scrollLeft < ((mainWidth * 2) + (-240) + (250 * 2))) && vm.seccion != 'seccion-02') {
                selectScreen(2);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 2) + (-240) + (250 * 2)) && mainContainer[0].scrollLeft < ((mainWidth * 3) + (-240) + (250 * 3))) && vm.seccion != 'seccion-03') {
                selectScreen(3);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 3) + (-240) + (250 * 3)) && mainContainer[0].scrollLeft < ((mainWidth * 4) + (-240) + (250 * 4))) && vm.seccion != 'seccion-04') {
                selectScreen(4);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 4) + (-240) + (250 * 4)) && mainContainer[0].scrollLeft < ((mainWidth * 5) + (-240) + (250 * 5))) && vm.seccion != 'seccion-05') {
                selectScreen(5);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 5) + (-240) + (250 * 5)) && mainContainer[0].scrollLeft < ((mainWidth * 6) + (-240) + (250 * 6))) && vm.seccion != 'seccion-06') {
                selectScreen(6);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 6) + (-240) + (250 * 6)) && mainContainer[0].scrollLeft < ((mainWidth * 7) + (-240) + (250 * 7))) && vm.seccion != 'seccion-07') {
                selectScreen(7);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 7) + (-240) + (250 * 7)) && mainContainer[0].scrollLeft < ((mainWidth * 8) + (-240) + (250 * 8))) && vm.seccion != 'seccion-08') {
                selectScreen(8);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 8) + (-240) + (250 * 8)) && mainContainer[0].scrollLeft < ((mainWidth * 9) + (-240) + (250 * 9))) && vm.seccion != 'seccion-09') {
                selectScreen(9);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 9) + (-240) + (250 * 9)) && mainContainer[0].scrollLeft < ((mainWidth * 10) + (-240) + (250 * 10))) && vm.seccion != 'seccion-10') {
                selectScreen(10);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 10) + (-240) + (250 * 10)) && mainContainer[0].scrollLeft < ((mainWidth * 11) + (-240) + (250 * 11))) && vm.seccion != 'seccion-11') {
                selectScreen(11);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 11) + (-240) + (250 * 11)) && mainContainer[0].scrollLeft < ((mainWidth * 12) + (-240) + (250 * 12))) && vm.seccion != 'seccion-12') {
                console.log('entr');
                selectScreen(12);
            }
        } else {

            for (var i = 1; i < secciones.length; i++) {
                if (i < secciones.length - 1) {
                    secciones[i].style.left = (mainContainer[0].scrollLeft + (mainWidth * 0.1)) + 'px';
                } else {
                    secciones[i].style.left = (mainContainer[0].scrollLeft) + 'px';
                }
            }

            $scope.$apply();

            if ((mainContainer[0].scrollLeft > ((mainWidth * 1) - 200) && mainContainer[0].scrollLeft < ((mainWidth * 2) - 200)) && vm.seccion != 'seccion-02') {
                selectScreen(2);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 2) - 200) && mainContainer[0].scrollLeft < ((mainWidth * 3) - 200)) && vm.seccion != 'seccion-03') {
                selectScreen(3);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 3) - 200) && mainContainer[0].scrollLeft < ((mainWidth * 4) - 200)) && vm.seccion != 'seccion-04') {
                selectScreen(4);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 4) - 200) && mainContainer[0].scrollLeft < ((mainWidth * 5) - 200)) && vm.seccion != 'seccion-05') {
                selectScreen(5);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 5) - 200) && mainContainer[0].scrollLeft < ((mainWidth * 6) - 200)) && vm.seccion != 'seccion-06') {
                selectScreen(6);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 6) - 200) && mainContainer[0].scrollLeft < ((mainWidth * 7) - 200)) && vm.seccion != 'seccion-07') {
                selectScreen(7);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 7) - 200) && mainContainer[0].scrollLeft < ((mainWidth * 8) - 200)) && vm.seccion != 'seccion-08') {
                selectScreen(8);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 8) - 200) && mainContainer[0].scrollLeft < ((mainWidth * 9) - 200)) && vm.seccion != 'seccion-09') {
                selectScreen(9);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 9) - 200) && mainContainer[0].scrollLeft < ((mainWidth * 10) - 200)) && vm.seccion != 'seccion-10') {
                selectScreen(10);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 10) - 200) && mainContainer[0].scrollLeft < ((mainWidth * 11) - 200)) && vm.seccion != 'seccion-11') {
                selectScreen(11);
            }
            if ((mainContainer[0].scrollLeft > ((mainWidth * 11) - 200) && mainContainer[0].scrollLeft < ((mainWidth * 12) - 200)) && vm.seccion != 'seccion-12') {
                selectScreen(12);
            }
        }


        function selectScreen(id) {
            switch (id) {
                case 1:

                    break;
                case 2:
                    vm.hideText = false;
                    vm.openThumbs = false;
                    vm.seccion = 'seccion-02';
                    vm.img = 'zapa_neoprene_01.gif';
                    vm.thumbs = [
                        {big: 'zapa_neoprene_01.gif', small: 'zapa_neoprene_01t.png', img: 'img02'},
                        {big: 'Zapa_neoprene_02.gif', small: 'Zapa_neoprene_02t.png', img: 'img02'},
                        {big: 'bota_02.gif', small: 'bota_02t.png', img: 'img02'}
                    ];
                    break;
                case 3:
                    vm.openThumbs = false;
                    vm.hideText = false;
                    vm.seccion = 'seccion-03';
                    vm.img = 'bota_01.gif';
                    //$scope.$apply();
                    vm.thumbs = [
                        {big: 'bota_01.gif', small: 'bota_01t.png', img: 'img03'},
                        {big: 'bota_02.gif', small: 'bota_02t.png', img: 'img03'},
                        {big: 'bota_03.gif', small: 'bota_03t.png', img: 'img03'}
                    ];
                    break;
                case 4:
                    vm.openThumbs = false;
                    vm.hideText = false;
                    //console.log('entra');
                    vm.seccion = 'seccion-04';
                    vm.img = 'medias_neoprene_01.gif';
                    vm.thumbs = [
                        {big: 'medias_neoprene_01.gif', small: 'medias_neoprene_01t.png', img: 'img04'},
                        {big: 'medias_neoprene_02.gif', small: 'medias_neoprene_02t.png', img: 'img04'}
                    ];
                    break;
                case 5:
                    vm.openThumbs = false;
                    vm.hideText = false;
                    //console.log('entra');
                    vm.seccion = 'seccion-05';
                    vm.img = 'jardinero_04.gif';
                    vm.thumbs = [
                        {big: 'jardinero_01.gif', small: 'jardinero_01t.png', img: 'img05'},
                        {big: 'jardinero_02.gif', small: 'jardinero_02t.png', img: 'img05'},
                        {big: 'jardinero_03.gif', small: 'jardinero_03t.png', img: 'img05'},
                        {big: 'jardinero_04.gif', small: 'jardinero_04t.png', img: 'img05'}
                    ];
                    break;
                case 6:
                    vm.openThumbs = false;
                    vm.hideText = false;
                    //console.log('entra');
                    vm.seccion = 'seccion-06';
                    vm.img = 'pantalon_neoprene_04.gif';
                    vm.thumbs = [
                        {big: 'pantalon_neoprene_01.gif', small: 'pantalon_neoprene_01t.png', img: 'img06'},
                        {big: 'pantalon_neoprene_02.gif', small: 'pantalon_neoprene_02t.png', img: 'img06'},
                        {big: 'pantalon_neoprene_03.gif', small: 'pantalon_neoprene_03t.png', img: 'img06'},
                        {big: 'pantalon_neoprene_04.gif', small: 'pantalon_neoprene_04t.png', img: 'img06'},
                        {big: 'pantalon_neoprene_05.gif', small: 'pantalon_neoprene_05t.png', img: 'img06'}
                    ];
                    break;
                case 7:
                    vm.openThumbs = false;
                    vm.hideText = false;
                    //console.log('entra');
                    vm.seccion = 'seccion-07';
                    vm.img = 'calza_04.gif';
                    vm.thumbs = [
                        {big: 'calza_01.gif', small: 'calza_01t.png', img: 'img07'},
                        {big: 'calza_02.gif', small: 'calza_02t.png', img: 'img07'},
                        {big: 'calza_03.gif', small: 'calza_03t.png', img: 'img07'},
                        {big: 'calza_04.gif', small: 'calza_04t.png', img: 'img07'}
                    ];
                    break;
                case 8:
                    vm.openThumbs = false;
                    vm.hideText = false;
                    //console.log('entra');
                    vm.seccion = 'seccion-08';
                    vm.img = 'remera_neoprene_02.gif';
                    vm.thumbs = [
                        {big: 'remera_neoprene_01.gif', small: 'remera_neoprene_01t.png', img: 'img08'},
                        {big: 'remera_neoprene_02.gif', small: 'remera_neoprene_02t.png', img: 'img08'}
                    ];
                    break;
                case 9:
                    vm.openThumbs = false;
                    vm.hideText = false;
                    //console.log('entra');
                    vm.seccion = 'seccion-09';
                    vm.img = 'remera_lycra_04.gif';
                    vm.thumbs = [
                        {big: 'remera_lycra_01.gif', small: 'remera_lycra_01t.png', img: 'img09'},
                        {big: 'remera_lycra_02.gif', small: 'remera_lycra_02t.png', img: 'img09'},
                        {big: 'remera_lycra_03.gif', small: 'remera_lycra_03t.png', img: 'img09'},
                        {big: 'remera_lycra_04.gif', small: 'remera_lycra_04t.png', img: 'img09'},
                        {big: 'remera_lycra_05.gif', small: 'remera_lycra_05t.png', img: 'img09'}
                    ];
                    break;
                case 10:
                    vm.openThumbs = false;
                    vm.hideText = false;
                    //console.log('entra');
                    vm.seccion = 'seccion-10';
                    vm.img = 'barbijo.gif';
                    vm.thumbs = [];
                    break;
                case 11:
                    vm.openThumbs = false;
                    vm.hideText = false;
                    //console.log('entra');
                    vm.seccion = 'seccion-11';
                    vm.img = 'milton_01.gif';
                    vm.thumbs = [
                        {big: 'milton_01t.gif', small: 'milton_01t.png', img: 'img11'},
                        {big: 'milton_02t.gif', small: 'milton_02t.png', img: 'img11'}
                    ];
                    break;
                case 12:
                    vm.openThumbs = false;
                    vm.hideText = false;
                    vm.thumbs = [];
                    vm.seccion = 'seccion-12';

                    if (!store.get('jwt')) {
                        vm.isDescargas = false;
                        vm.isLogin = true;
                    }
                    break;
                case 13:
                    break;
            }

        }


        $scope.$apply();
    }, false);
}
