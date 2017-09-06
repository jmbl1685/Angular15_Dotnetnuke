'use strict';

angular.module('myApp.List', ['ngRoute', 'angular-loading-bar'])

.config(['$routeProvider', function ($routeProvider) {
    //mapping route
    $routeProvider.when('/Activacion', {
        templateUrl: '/DesktopModules/Kitchensink.Sample/Partials/List.html',
        controller: 'ListCtrl'
    });

}])
.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.latencyThreshold = 100;
    cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar-spinner"><div class="spinner-icon"></div></div><div class="modal-backdrop fade in"></div>';
}])

.filter('urlEncode', [function () {
    var encode = function (a) {
        if (typeof a === "string") {
            return window.encodeURIComponent(a);
        } else if (typeof a === "object") {
            return window.encodeURIComponent(JSON.stringify(a));
        }
    }
    return encode;
}])


//inicializar ListController
.controller('ListCtrl', ['$scope', 'localizedString', '$mdDialog', function ($scope, localizedString, $mdDialog) {

    $scope.isValid = true;
    $scope.localizedString = localizedString;
    $scope.filteredTableClass = 'col-md-12';

    $scope.filtros = {
        Nombre: null,
        Identificacion: null,
        TipoIdentificacion: null
    }

    $scope.lstTipoIdentificacion = [];
    
    //Method redirect
    $scope.redirect = function (location) {
        window.location.href = location;
    }

    $scope.selected = [];

    $scope.query = {
        order: 'name',
        limit: 10,
        page: 1
    };

    //Muestra los filtros
    $scope.ShowFilter = function (filter) {
        $scope.filteredTableClass = filter ? 'col-md-8 col-md-pull-4 col-lg-9 col-lg-pull-3 col-sm-12 col-xs-12' : 'col-md-12';
        $scope.showFilter = filter;
    };

    //Limpia los filtros 
    $scope.LimpiarFiltros = function () {
        $scope.filtros.Nombre = null
        $scope.filtros.Identificacion = null
        $scope.filtros.TipoIdentificacion = null
        $scope.Get(); 
    }

    //Mostrar la opcion para activar contrarto 
    $scope.showModal = function (ev, currentDocument, action, title) {
        $scope.action = action;
        $scope.title = title;
        $scope.currentDocument = currentDocument;
        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'));
        $mdDialog.show({
            controller: 'ActivateCtrl',
            templateUrl: '/DesktopModules/Kitchensink.Sample/Partials/Activate.html',
            parent: (angular.element(document.querySelector('body'))),
            scope: $scope,
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: useFullScreen,
            preserveScope: true
        });
        $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });
    };

    $scope.datos = null;

    //Para prueba de sin datos que mostrar
    var arrayvacio = [];
    $scope.Get = function () {
        

        var data = {
            "PageIndex": $scope.query.page,
            "PageSize": $scope.query.limit
        }

        //valida si se filtra por nombre 
        if ($scope.filtros.Nombre != null)
            data.$filter = " name eq '" + $scope.filtros.Nombre + "'";

        //valida si se filtra por identificacion 
        if($scope.filtros.Identificacion != null)
            data.$filter = ((data.$filter != null) ? data.$filter +" AND " : "") + "identification eq '" + $scope.filtros.Identificacion + "'";

        //valida si se filtra por tipo identificacion 
        if ($scope.filtros.TipoIdentificacion != null)
            data.$filter = ((data.$filter != null) ? data.$filter + " AND " : "") + "identificationType eq '" + $scope.filtros.TipoIdentificacion + "'";

        //Obtiene los contratos pendientes de activación
        $scope.promise = $scope.restService.get('PLColab.Tenants', 'Tenant/GetDisabledThirdParties', function (object) {
            $scope.contratos = {
                data: object.items,
                count: object.totalItemCount
            };
            $scope.selected = [];
        }, data
        ).$promise;
        //Valida si hay mensaje en la notificacion. 
        if ($scope.Mensaje && $scope.Mensaje.Text && $scope.Mensaje.Tipo) {
            $scope.notificationManager.notify($scope.Mensaje.Tipo, $scope.Mensaje.Text);
            $scope.Mensaje.Tipo = null;
            $scope.Mensaje.Text = null;

        }
    }

    $scope.Get();

    //Obtiene los tipos de documentos 
    $scope.restService.get('PLColab.Commons', 'IdentificationTypes/Get', function (data) {
        $scope.lstTipoIdentificacion = data;
    })

    $scope.errorCallback = function (data) {
        $scope.notificationManager.notify('error', data.error.message);
        $scope.Get();
    };

    

}]);
