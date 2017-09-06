'use strict';

angular.module('myApp.Activate', ['ngRoute'])

.config(['$routeProvider', function ($routeProvider) {

    $routeProvider.when('/Asociar/:seleccionado', {
        templateUrl: '/DesktopModules/Kitchensink.Sample/Partials/Activate.html',
        controller: 'ActivateCtrl'
    });
}])
.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
    cfpLoadingBarProvider.latencyThreshold = 100;
    cfpLoadingBarProvider.spinnerTemplate = '<div id="loading-bar-spinner"><div class="spinner-icon"></div></div><div class="modal-backdrop fade in"></div>';
}])

.controller('ActivateCtrl', ['$scope', 'localizedString', '$modal', '$mdDialog', '$mdMedia', '$routeParams', function ($scope, localizedString, $modal, $mdDialog, $mdMedia, $routeParams) {
    $scope.motivo = '';
    $scope.notValid = false;
    $scope.lstContratoPadre = [];
    $scope.localizedString = localizedString;
    $scope.IsDisabled = false;
    $scope.isValid = true;
    $scope.selected = JSON.parse($routeParams.seleccionado);
    $scope.headers = [{ id: 'header1' }];
    $scope.keys = [];
    $scope.values = [];
    $scope.conexionOk = false;
    $scope.featuresArray = [];
    $scope.lstDocumentosEmitibles = [];
    $scope.selected.aditionalTenantSettings = {}
    $scope.selected.typePlan = false; 
    $scope.obj = { SelectPlan: false, SelectReceptor: false };
    //$scope.feature.Tipo=false;

    $scope.feature = {
        OFE: false,
        Emisor: false,
        Receptor: false,
        ERP: false,
        Options: {
            isPush: false,
            isStamper: false,
            isArchivoPlano: false
        },
        Tipo:false
    };
    
    $scope.emisor = {
        timeStamper : {
            host: '',
            port:'',
            user: '',
            pass: ''
        },
        emisorPorArchivo: []
    }

    $scope.ContratosPadreDataSource = {};

    $scope.lstExtensions = []
    $scope.lstSeparator = []
    //Inicialización de parámetros adicionales de la petición PUSH 
    $scope.aditionalParameters = {
        usuario: null,
        password: null,
        timelimit: null,
        stacklimit: null,
        host: null,
        port: null,
        AuthResource: null,
        peticionAutenticacion: null,
        UpdateResource: null,
        updateMethod: null,
        metodoAutenticacion: null,
        Scheduling: null,
        headersArray: null //Aquí se guardan los headers para el JSON
    };

    //Inicialización de parámetros adicionales de la petición OFE
    $scope.OFEParameters = {
        usuario: null,
        password: null,
        DireccionServidor: null,
        port: null,
        WebService: null,
        AccountId: null,
        SecretAccessKey: null
    };

    //Valida que esten completas las cabeceras de la petición para la prueba de conexión y activación
    $scope.validarCabeceras = function () {
        var error = false
        //Validar tamaño de las key
        if ($scope.keys.length != 0 || $scope.values.length != 0) {
            $.each($scope.keys, function (index, element) {
                if (element === undefined) {
                    error = true;
                }
            })

            $.each($scope.values, function (index, element) {
                if (element === undefined) {
                    error = true;
                }
            })
        } else {
            error = true
        }

        if (error) {
            return false
        } else {
            return true;
        }       
    }

    $scope.cancel = function () {
        $mdDialog.cancel();
    };

    //Method show error
    $scope.errorCallback = function (data) {
        //Valdiar mensajes de error
        var error = "";
        if (data != null && typeof data.error != "undefined")
            error = $scope.MessageMap(data.error.message);
        else if (data != null && typeof data.Message != "undefined")
            error = $scope.MessageMap(data.Message);
        else if (data != null && typeof data == 'string')
            error = data;
        else if (data != null && data.eventItems[0].shortDescription != '')
            error = data.eventItems[0].shortDescription;

        $scope.notificationManager.notify('error', error);
    };

    //Busca en mensaje en el archivo localizedString  
    $scope.MessageMap = function (messge) {
        messge = messge.trim();
        if (typeof $scope.localizedString[messge] != "undefined")
            return $scope.localizedString[messge];
        else {
            return messge;
        }
    }

    //Redirecciona la pagina
    $scope.redirect = function (location) {
        window.location.href = location;
    }

    //Obtiene los Switches activados y construye un Array para la petición
    $scope.buildFeatureArray = function () {
        //Limpiar Array antes de armarlo
        $scope.featuresArray = [];
        //Conjunto de condiciones para añadir al array si el switch correspondiente esta marcado o encendido
        if ($scope.feature.Emisor) {
            $scope.featuresArray.push('Issuer');
        }
        if ($scope.feature.Receptor) {
            $scope.featuresArray.push('Receiver');
        }
        if ($scope.feature.OFE) {
            $scope.featuresArray.push('OFE');
        }
        if ($scope.feature.ERP) {
            $scope.featuresArray.push('Retailer');
        }
        if ($scope.feature.Cartera) {
            $scope.featuresArray.push('Accounting');
        }
        if ($scope.feature.Cartera) {
            $scope.featuresArray.push('Accounting');
        }
        if ($scope.feature.Tipo) {
            $scope.featuresArray.push('PLColab20');
        }
    }

    $scope.buildAditionalTenantSettingsArray = function () {
        if ($scope.feature.Options.isStamper && $scope.myForm.timeStamper_host.$valid && $scope.emisor.timeStamper.host.length > 0) {
            $scope.selected.aditionalTenantSettings["TimeStamper"] = JSON.stringify($scope.emisor.timeStamper);
        }
        if ($scope.emisor.emisorPorArchivo.length>0) {
            angular.forEach($scope.emisor.emisorPorArchivo, function (value,key) {
                $scope.selected.aditionalTenantSettings["Documento.CsvMapping." + value.type] = JSON.stringify(value);
            });
        }

    }
    //Desactiva el Switch de OFE si cualquier otro sitch se activa
    $scope.toggleOFE = function (OFE,ev) {
        $scope.OFE = false;
        $scope.feature.Options.isPush = false;
        if (OFE == true) {
            var confirm = $mdDialog.confirm()
                    .title(localizedString.ConfirmTitle)
                    .textContent(localizedString.ConfirmarDescarteOFE)
                    .targetEvent(ev)
                    .clickOutsideToClose(false)
                    .parent(angular.element(document.body))
                    .ok(localizedString.Ok)
                    .cancel(localizedString.Cancel);

            $mdDialog.show(confirm).then(function () {
                $scope.feature.OFE = false;
                $scope.OFEParameters = null;
            },
            function () {
                $scope.feature.OFE = true;
                $scope.feature.Emisor = false;                
                $scope.feature.Receptor = false;
                $scope.feature.ERP = false;
                $scope.feature.Options.isPush = false;
                $scope.feature.Options.isStamper = false;
                $scope.feature.Tipo = false;
            });
        }

    }

    //Desactiva el Switch de Emision si d otro sitch se activa
    $scope.toggleEmisor = function (ev) {

        if ($scope.feature.Options.isStamper == true || $scope.feature.Options.isArchivoPlano == true) {

            var message = localizedString.ConfirmarDesctivarEmisor;
            //Selecciona el mensaje adecuado segun la configuracion seleccionada
            if ($scope.feature.Options.isStamper && $scope.feature.Options.isArchivoPlano) {
                message = $scope.format(message, localizedString.ArchivoPlano + " y " + localizedString.Estampadora);
            }
            else if ($scope.feature.Options.isStamper && $scope.feature.Options.isArchivoPlano == false) {
                message = $scope.format(message, localizedString.Estampadora);
            } else if ($scope.feature.Options.isStamper == false && $scope.feature.Options.isArchivoPlano) {
                message = $scope.format(message, localizedString.ArchivoPlano);
            }


            var confirm = $mdDialog.confirm()
                    .title(localizedString.ConfirmTitle)
                    .textContent(message)
                    .targetEvent(ev)
                    .clickOutsideToClose(false)
                    .parent(angular.element(document.body))
                    .ok(localizedString.Ok)
                    .cancel(localizedString.Cancel);

            $mdDialog.show(confirm).then(function () {
                $scope.feature.Options.isStamper = false;
                $scope.feature.Options.isArchivoPlano = false;
                $scope.emisor.emisorPorArchivo = [];
                $scope.emisor.timeStamper = {
                    host: '',
                    port: '',
                    user: '',
                    pass: ''
                };
                $scope.feature.Receptor = false;
            }, function () {
                $scope.feature.Emisor = true;
                $scope.feature.Receptor = true;
            });
        } else {
            $scope.feature.Receptor = !$scope.feature.Emisor;
        }

        $scope.feature.Tipo = false;
        
    }

    $scope.format = function (string) {
        var args = arguments;
        return string.replace(/\{(\d+)\}/g, function (match, capture) {
            return args[1*capture + 1];
        });
      }

    //Desactiva el Switch de Emision si d otro sitch se activa
    $scope.toggleStampa = function () {
        $scope.emisor.timeStamper = {
            host: '',
            port: '',
            user: '',
            pass: ''
        };
    }

    //Desactiva el Switch de archivo plano
    $scope.toggleArchivoPlano = function () {
        $scope.emisor.emisorPorArchivo = [];
    }

    //Desactiva los demas Switches si OFE se activa
    $scope.toggleFalse = function (emisor,receptor,erp,ev) {
        //Preguntar si desea descartar configuracion de las otras pestañas
        if (emisor==true || receptor == true || erp==true) {
            var confirm = $mdDialog.confirm()
                    .title(localizedString.ConfirmTitle)
                    .textContent(localizedString.ConfirmarDescartePentañas)
                    .targetEvent(ev)
                    .clickOutsideToClose(false)
                    .parent(angular.element(document.body))
                    .ok(localizedString.Ok)
                    .cancel(localizedString.Cancel);

            $mdDialog.show(confirm).then(function () {
                $scope.feature.OFE = true
                $scope.feature.Emisor = false;
                $scope.feature.Receptor = false;
                $scope.feature.ERP = false;
                $scope.feature.Options.isPush = false;
                $scope.feature.Options.isStamper = false;
                $scope.aditionalParameters = null;
                $scope.feature.Tipo = false;
            },
            function () {
                $scope.feature.OFE = false
            });
        }
    }

    //Convierte los headers ingresados en un JSON para la petición, los guarda en headersArray
    $scope.convertHeadersToJSON = function () {
        //Arma el objeto JSON directamente para las cabeceras
        var result = {};
        for (var index = 0; index < $scope.keys.length; index++)
            result[$scope.keys[index]] = $scope.values[index];

        return result;
    }

    //Resetea los campos de usuario y contraseña al quitar Basic Auth como método de autenticación
    $scope.clearFields = function () {
        $scope.aditionalParameters.usuario = null;
        $scope.aditionalParameters.password = null;
    }

    //Resetea los campos de usuario y contraseña al quitar Basic Auth como método de autenticación
    $scope.clearFieldsScheduling = function () {
        //Aplica valores por defecto solo para el caso de BATCH
        if ($scope.aditionalParameters.Scheduling != 'BATCH') {
            $scope.aditionalParameters.timelimit = null;
            $scope.aditionalParameters.stacklimit = null;
        } else {
            $scope.aditionalParameters.timelimit = 70;//Valor por defecto sugerido por Javier García
            $scope.aditionalParameters.stacklimit = 100;//Valor por defecto sugerido por Javier García
        }

    }

    //Intercambia el valor de isPush para ocultar y mostrar el formulario push
    $scope.togglePush = function (push) {
        $scope.feature.OFE = false;
        if (!$scope.feature.Options.isPush) {
            $scope.aditionalParameters = {
                usuario: null,
                password: null,
                timelimit: null,
                stacklimit: null,
                host: null,
                port: null,
                AuthResource: null,
                peticionAutenticacion: null,
                UpdateResource: null,
                updateMethod: null,
                metodoAutenticacion: null,
                Scheduling: null,
                headersArray: null //Aquí se guardan los headers para el JSON
            };
        }
        return !push;
    }

    //Adiciona nuevo control de entrada para cacebera
    $scope.addNewheader = function () {
        var newItemNo = $scope.headers.length + 1;
        $scope.headers.push({ 'id': 'header' + newItemNo });
        $scope.keys.push(undefined)
        $scope.values.push(undefined)
    };

    //Elimina un control de entrada para cacebera y sus valores del array de cabeceras
    $scope.removeheader = function () {
        var lastItem = $scope.headers.length - 1;
        $scope.headers.splice(lastItem);
        
        //Verifica que sean iguales las cabeceras +1 (No cuenta la existente) y los datos ingresados para eliminar el último dato de cabecera correctamente
        if (($scope.headers.length+1 == ($scope.keys.length)) || ($scope.headers.length+1 == ($scope.values.length))) {
            var lastItemKey = $scope.keys.length - 1;
            $scope.keys.splice(lastItemKey);
            var lastItemValue = $scope.values.length - 1;
            $scope.values.splice(lastItemValue);
        }
    };

    //Prueba el estado de la conexion del servicio push
    $scope.probarConexion = function () {

        //Obtenemos toda la información del formulario y armamos la petición
        $scope.buildFeatureArray();
        $scope.aditionalParameters.headersArray = $scope.convertHeadersToJSON();
        $scope.selected.features = $scope.featuresArray;
        $scope.selected.additionalParameters = [];
        if ($scope.feature.Options.isPush == true) {
            $scope.selected.additionalParameters[0] = {
                Name: 'Push',
                value: {
                    "Host": $scope.aditionalParameters.host,
                    "Port": $scope.aditionalParameters.port,
                    "Update.resource": $scope.aditionalParameters.UpdateResource,
                    "Update.Method": $scope.aditionalParameters.updateMethod,
                    "Auth.Resource": $scope.aditionalParameters.AuthResource,
                    "Auth.Method": $scope.aditionalParameters.peticionAutenticacion,
                    "Headers": $scope.aditionalParameters.headersArray,
                    "User": $scope.aditionalParameters.usuario,
                    "Password": $scope.aditionalParameters.password,
                    "$Bulk.TimeLimit": $scope.aditionalParameters.timelimit,
                    "$Bulk.StackLimit": $scope.aditionalParameters.stacklimit,
                    "Scheduling": $scope.aditionalParameters.Scheduling,
                    "metodoAutenticacion": $scope.aditionalParameters.metodoAutenticacion
                }
            }
        }

        //Valida si hay campos pendientes 
        if ($scope.ValidarCamposPeticion()) {
            //Simulación dummy hasta construcción de API para prueba de conexión
            $scope.restService.post('PLColab.Profile', 'Activate/TestConnection', $scope.selected,
                    function (data) {
                        $scope.conexionOk = true;
                        $scope.notificationManager.notify('success', localizedString.conexionDone);
                    },
                    $scope.errorCallback);
        } else {
            $scope.isValid = false;
            $scope.notificationManager.notify('error', localizedString.Required);
        }       
    }
 
    //Valida las peticiones
    $scope.ValidarCamposPeticion = function () {
        return ($scope.feature.Options.isPush == true
                    && $scope.validarCabeceras()
                    && $scope.aditionalParameters.peticionAutenticacion
                    && $scope.aditionalParameters.AuthResource
                    && $scope.aditionalParameters.updateMethod
                    && $scope.aditionalParameters.UpdateResource
                    && $scope.aditionalParameters.port
                    && $scope.aditionalParameters.host

                       && (($scope.aditionalParameters.metodoAutenticacion != 'Basic'
                        && $scope.aditionalParameters.Scheduling != 'BATCH')

                        || ($scope.aditionalParameters.metodoAutenticacion == 'Basic'
                        && $scope.aditionalParameters.Scheduling == 'BATCH'
                        && $scope.aditionalParameters.stacklimit
                        && $scope.aditionalParameters.timelimit
                        && $scope.aditionalParameters.usuario
                        && $scope.aditionalParameters.password)

                        || ($scope.aditionalParameters.metodoAutenticacion != 'Basic'
                        && $scope.aditionalParameters.Scheduling == 'BATCH'
                        && $scope.aditionalParameters.stacklimit
                        && $scope.aditionalParameters.timelimit)

                        || ($scope.aditionalParameters.metodoAutenticacion == 'Basic'
                        && $scope.aditionalParameters.Scheduling != 'BATCH'
                        && $scope.aditionalParameters.usuario
                        && $scope.aditionalParameters.password)
                        )
                    );
    }

 
    //Obtiene los contratos padre
    $scope.GetContratosPadre = function () {
       
        $scope.promise = $scope.restService.get('PLColab.Tenants', 'Tenant/Feature/Retailer?pageIndex=1&pageSize=100', function (data) {
            $scope.ContratosPadreDataSource = {
                data: data.items,
            };
        }).$promise;
    }

    //Obtiene los tipos de documentos emitibles
    $scope.GetDocumentosEmitibles = function () {
       
        $scope.promise = $scope.restService.get('PLColab.Documents', 'DocumentTypes/WithType/Featured', function (data) {
            $scope.lstDocumentosEmitibles = data.items;
        }).$promise;
    }

    //Obtiene las Extensiones 
    $scope.GetExtensions = function () {
        $scope.promise = $scope.restService.get('PLColab.Commons', 'Extensions/Get', function (data) {
            $scope.lstExtensions = data;
        }).$promise;
    }

    //Obtiene las Extensiones 
    $scope.GetSeparators = function () {
        $scope.promise = $scope.restService.get('PLColab.Commons', 'Separators/Get', function (data) {
            $scope.lstSeparator = data;
        }).$promise;
    }
    //Configura el contrato seleccionado
    $scope.ActivarContrato = function () {

        $scope.buildFeatureArray();
        $scope.buildAditionalTenantSettingsArray();
        $scope.selected.features = $scope.featuresArray;

        //
        if ($scope.feature.Options.isPush == false) {
            $scope.selected.additionalParameters = []
        }

        //
        if ($scope.feature.Options.isArchivoPlano == false && $scope.feature.Options.isStamper ==false) {
            $scope.selected.aditionalTenantSettings = null
        }

        //Verifica que por lo menos configure una característica
        if ($scope.selected.features.length == 0) {
            $scope.isValid = false;
            $scope.notificationManager.notify('error', localizedString.confRequired);
        }
        else if ($scope.feature.Options.isArchivoPlano && $scope.emisor.emisorPorArchivo.length == 0) {
            $scope.isValid = false;
            $scope.notificationManager.notify('error', localizedString.confRequiredFlatFle);
        }
        else if ($scope.feature.Options.isStamper
                    && (typeof $scope.emisor.timeStamper === "undefined"
                        || !$scope.myForm.timeStamper_host.$valid
                        || $scope.emisor.timeStamper.host.length == 0
                        || $scope.emisor.timeStamper.user.length == 0
                        || $scope.emisor.timeStamper.pass.length == 0)) {
            $scope.isValid = false;
            $scope.notificationManager.notify('error', localizedString.Required);
        }
        else {

            //Controla la petición si el contrato es push o no, en caso de serlo controla que toda la configuración requerida sea enviada correctamente
            if (($scope.selected.parentTenantId != null && $scope.selected.plan != null && $scope.feature.Options.isPush == false) || $scope.ValidarCamposPeticion()) {

                $scope.restService.post('PLColab.Profile', 'Activate/' + $scope.selected.user, $scope.selected,
                function (data) {
                    $scope.Mensaje.Text = localizedString.Success;
                    $scope.Mensaje.Tipo = 'success';
                    $scope.redirect('#Activacion')
                },
                $scope.errorCallback);
            } else {
                //Verifica si se realizó conexión antes de la activación
                if ((!$scope.conexionOk && !$scope.feature.Options.isPush)
                    || ($scope.conexionOk && $scope.feature.Options.isPush)
                    || ($scope.conexionOk && !$scope.feature.Options.isPush)) {
                    $scope.isValid = false;
                    $scope.notificationManager.notify('error', localizedString.Required);
                } else {
                    $scope.isValid = false;
                    $scope.notificationManager.notify('error', localizedString.conexionNoOk);
                }
            }
        }
    }

    //valida la existencia de un elemento dentro de un array
    $scope.existInarray = function(array,valor){
        var exist = false; 
        angular.forEach(array,function(value,key){
            if (value.type == valor)
                exist = true;
        });
        return exist; 
    }

    //Agrega configuracion de un archivo plano
    $scope.addNewConfig = function () {
        //valida si se ha seleccionado un nuevo tipo de archivo plano.
        if ($scope.selected.DocumentType.length > 0 && !$scope.existInarray($scope.emisor.emisorPorArchivo, $scope.selected.DocumentType)) {
            $scope.emisor.emisorPorArchivo.push(
            {
                type: $scope.selected.DocumentType,
                detail: {
                    columnMapping:[],
                    "rowKey": "{{LineaPosicion." + $scope.getType($scope.selected.DocumentType) + "}}"
                },
                header: {
                    columnMapping: [],
                    "rowKey": "{{FacturaEmitida.DatosCabecera.Numero" + $scope.getType($scope.selected.DocumentType) + "}}"
                }
            });
            $scope.selected.DocumentType = '';

        } else {
            $scope.errorCallback(localizedString.Exist);
        }

    }

    $scope.removeConfig = function (index) {
        $scope.emisor.emisorPorArchivo.splice(index,1);
    }
    //mapea el tipo de datos segun lo que necesita el rowkey 
    $scope.getType = function (type) {
        var val = ""; 
        switch (type) {
            case "FACTURA-UBL": val = "Factura";
                break;
            case "NC-UBL": val = "NotaCredito";
                break; 
        };
        return val; 
    }

    //agregar una columna al objeto detail
    $scope.addNewColum = function (index) {
        var length = $scope.emisor.emisorPorArchivo[index].detail.columnMapping.length
        $scope.emisor.emisorPorArchivo[index].detail.columnMapping.push({
            "type": "string",
            "valueResolver": {
                "type": "index",
                "value": length
            }
        }); 
    }

    //Elimina una columna del objeto detail
    $scope.removeColum = function (indexPadre, index) {
        $scope.emisor.emisorPorArchivo[indexPadre].detail.columnMapping.splice(index, 1);
    };

    //Adicioan una columna al header 
    $scope.addNewheaders = function (index) {
        var length = $scope.emisor.emisorPorArchivo[index].header.columnMapping.length
        $scope.emisor.emisorPorArchivo[index].header.columnMapping.push({
            "type": "string",
            "valueResolver": {
                "type": "index",
                "value": length
            }
        });
    };

    //Elimina una columna del objeto header
    $scope.removeheaders = function (indexPadre, index) {
        $scope.emisor.emisorPorArchivo[indexPadre].header.columnMapping.splice(index,1);
    };

    //selecciona el tap de planes
    $scope.SelectPlan = function () {

        if (!$scope.obj.SelectReceptor) {
            $scope.obj.SelectReceptor = true;            
            return;
        }

        if ($scope.obj.SelectReceptor) {
            $scope.obj.SelectPlan = true;
            return;
        }
         //   $scope.obj.SelectPlan = true;
    }

    //selecciona el tap de planes
    $scope.SelectReceptor = function () {
        $scope.obj.SelectReceptor = true;
    }

    //Ejecutar elementos al iniciar 
    $scope.GetContratosPadre();
    $scope.GetDocumentosEmitibles();
    $scope.GetExtensions();
    $scope.GetSeparators();

}])
  .config(function ($mdThemingProvider, $mdDateLocaleProvider) {

      var $locale = window.$provide.$get();

      // Configure a dark theme with primary foreground yellow
      $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('yellow')
        .dark();

      $mdDateLocaleProvider.formatDate = function (date) {
          return date == null ? '' : moment(date).format($locale.DATETIME_FORMATS.shortDate.toUpperCase());
      };
  });