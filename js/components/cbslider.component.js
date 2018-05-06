"use strict";

/**
 * Slider component
 */
var cbSliderComponent = {
	templateUrl: './js/components/cbslider.component.html',
	bindings: {
	    skyfishFolderId: '<'
	},
	controller: function( $http, $scope, $element, $q, skyfishAuthToken ) { 
		var ctrl = this;
		
		// List of skyfish media
		ctrl.medias = [];

		// Nr. of media per slide - updated on resize 
		ctrl.mediaPerSlide = 0;

		// Nr. of most left media - let start with 1
		ctrl.currentPosition = 0;

		/**
		 * On current position change the current position can't be bigger than total medias or smaller than 1
		 * @param int current Media index to set as current
		 * @param boolean useTransition Flag for using animation to slider to the new current page
		 */
		ctrl.setCurrentPosition = function( current, useTransition ){
			if ( current >= ctrl.medias.length )
				current = ctrl.medias.length - 1;

			if ( current < 0 ) 
				current = 0;
			
			ctrl.useTransition = useTransition;
			ctrl.currentPosition = current;
		};

		/**
		 * Check if there is a next slide
		 */
		ctrl.isNextSlide = function() {
			return ctrl.currentPosition < ctrl.medias.length - 1 && ctrl.medias.length > ctrl.mediaPerSlide;
		};
		
		/**
		 * Check if there is a previous slide
		 */
		ctrl.isPreviousSlide = function() {
			return ctrl.currentPosition > 0;
		};

		/**
		 * Show next slide
		 */
		ctrl.nextSlide = function(){
			if ( ctrl.isNextSlide() )
				ctrl.setCurrentPosition( ctrl.currentPosition + ctrl.mediaPerSlide, true );			
		};

		/**
		 * Show previous slide
		 */
		ctrl.previousSlide = function(){
			if ( ctrl.isPreviousSlide() )
				ctrl.setCurrentPosition( ctrl.currentPosition - ctrl.mediaPerSlide, true );					
		};

		// Stored element width 
		ctrl.elementWidth = false;

		/**
		 * On element resize
		 * @param object event Iframe resize event
		 */
		ctrl.onResize = function( event ) {			
			ctrl.elementWidth = $element.find('iframe')[0].offsetWidth;
				
			// No transition on resize
			ctrl.useTransition = false;
			
			// Set media per slide based on element width
			if ( ctrl.elementWidth > 1199 ) {
				ctrl.mediaPerSlide = 5;
			} else if ( ctrl.elementWidth > 961 ) {
				ctrl.mediaPerSlide = 4;
			} else if ( ctrl.elementWidth > 460 ) {
				ctrl.mediaPerSlide = 2;
			} else {
				ctrl.mediaPerSlide = 1;	
			}			
		};
			
		// Flag for CSS transition on slide change
		ctrl.useTransition = false;

		/**
		 * Generate style for carousel. -webkit prefix for transform and transition improves compatibility with older webkit based browsers 
		 * @return string
		 */
		ctrl.styleCarousel = function() {
			return { 
				'transform': 'translateX('+ctrl.cssTranslate()+'%)', 
				'-webkit-transform': 'translateX('+ctrl.cssTranslate()+'%)', 
				'transition': !ctrl.useTransition ? 'none' : 'transform .6s ease-in-out', 
				'-webkit-transition': !ctrl.useTransition ? 'none' : '-webkit-transform .6s ease-in-out' 
			};
		};
			
		/**
		 * Calculate carusel's horizontal position in percentage
		 * @return Float Percent
		 */
		ctrl.cssTranslate = function() {
			return ( -ctrl.currentPosition * ( 100 / ctrl.mediaPerSlide ) ) + ( 100 / ctrl.elementWidth * ctrl.panDelta );
		};

		// Pan object
		ctrl.panDelta = 0;	

		// Set up hammer for touch event handling if hummer.js included
		ctrl.isHammertime = typeof Hammer === 'function';
		if ( ctrl.isHammertime ) {
			ctrl.hammertime = new Hammer($element.find('div')[1], {});
			ctrl.hammertime.get('pan').set({ threshold: 3 });
		};

		/**
		 * Load medias from skyfish folder with id skyfishFolderId 
		 */
		ctrl.loadMedias = function() {
			// Clear medias array, we will load new data
			ctrl.medias = [];

			// Reset current position 
			ctrl.setCurrentPosition( 0, false );


			// On folder change we need to cancel the old $http opertaion if still pending  
			if ( ctrl.canceller )
				ctrl.canceller.resolve("New folder requested");
			ctrl.canceller = $q.defer();		

			// Load skyfish medias from folder
			if ( isNaN(parseInt(ctrl.skyfishFolderId)) ) {
				throw new Error("Skyfish folder id is missing or not valid. Use skyfish-folder-id on element");
			} else {
				$http.get( "https://api.colourbox.com/search?folder_ids="+parseInt(ctrl.skyfishFolderId)+"&return_values=description+filename+thumbnail_url_ssl", {
		        	timeout: ctrl.canceller.promise,
		        	headers: {
						"Authorization": "CBX-SIMPLE-TOKEN Token="+skyfishAuthToken
					}	
		        } ).then(function(response){

					// Update media array with the media array from the response and preload thumbnail images
					ctrl.medias = response.data.response.media.map(function(media){					
						media.loaded = false;
						
						var img = new Image();
						img.onload = function() { 
							media.loaded = true;
							$scope.$digest();
						};
						img.src = media.thumbnail_url_ssl;

						return media;
					});

		        },function(response){
		        	throw new Error("skyfish API: "+response.statusText);
		        });	    
		    };	
		};

		/**
		 * Initialize slider
		 */
		ctrl.$onInit = function() { 

			/**
			 * We need only to check the size change of the element, not the whole window.
			 * The dummy iframe is used to trigger the resize event only for the element size change.
			 */
			angular.element($element.find('iframe')[0].contentWindow).on("resize",function(){ 
				ctrl.onResize(); 				
				$scope.$digest();
			});			

			// Initialize touch events if hammer.js included	
			if ( ctrl.isHammertime ) {
				ctrl.hammertime.on('pan', function(ev) {

					// No transition on move
					ctrl.useTransition = false;
					
					// Store the delta
					ctrl.panDelta = ev.deltaX;
					
					$scope.$digest();
				}).on('panend pancancel', function(ev) {
					// Show transition on move
					ctrl.useTransition = true;
						
					// Check for left or right swipe
					if ( ctrl.panDelta > 0 ) {
						ctrl.panDelta = 0;
						ctrl.previousSlide();	
					} else {
						ctrl.panDelta = 0;
						ctrl.nextSlide();
					};

					$scope.$digest();	
				});  
			};

			// Calculate nr. of media per slide 
			ctrl.onResize();
		};

		/**
		 * Detect changes on bindings values
		 */
		ctrl.$onChanges = function(changes) {
			if ( typeof changes.skyfishFolderId !== 'undefined' )
				ctrl.loadMedias()			
		};

		/**
		 * Remove all external events			
		 */
		ctrl.$onDestroy = function() {
			angular.element($element.find('iframe')[0].contentWindow).off("resize");
			if ( ctrl.isHammertime )
				ctrl.hammertime.on('off');
		};
	}
};