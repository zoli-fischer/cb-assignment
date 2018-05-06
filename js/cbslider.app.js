"use strict";

angular.module("cbSliderApp", []).
value("skyfishAuthToken", ''); // Global skyfish auth token

/**
 * Litle easter egg :)
 * CLick on the 'Keep me updated' button and toggle between 2 skyfish folders 
 */
angular.module("cbSliderApp").controller('cbSliderApp', function($scope){
	// Folder id to use for slider
	$scope.folderId = 935575;

	// Change slider folder
	$scope.click = function() {
		$scope.folderId = $scope.folderId == 935575 ? 936177 : 935575;		
	};
});

/**
 * Load slider component to the slider app
 */
angular.module("cbSliderApp").component('cbslider', cbSliderComponent);