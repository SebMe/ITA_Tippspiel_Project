myApp.controller('soapTestViewController', function ($scope, soapService) {
$scope.testString = soapService.testFunction();
});