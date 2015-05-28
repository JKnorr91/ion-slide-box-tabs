var slidingTabsDirective = angular.module("ionic").directive('ionSlideTabs', ['$timeout', '$compile', '$interval', '$ionicSlideBoxDelegate', '$ionicScrollDelegate', '$ionicGesture', function($timeout, $compile, $interval, $ionicSlideBoxDelegate, $ionicScrollDelegate, $ionicGesture) {
    return {
        require: "^ionSlideBox",
        restrict: 'A',
        link: function(scope, element, attrs, parent) {

            var ionicSlideBoxDelegate;
            var ionicScrollDelegate;
            var ionicScrollDelegateID;

            var slideTabs;
            var indicator;

            var slider;
            var tabsBar;

            var options = {
                "slideTabsScrollable": true
            }


            var init = function () {

                if(angular.isDefined( attrs.slideTabsScrollable ) && attrs.slideTabsScrollable === "false" ) {
                    options.slideTabsScrollable = false;
                }

                if(options.slideTabsScrollable) {

                    ionicScrollDelegateID = "ion-slide-tabs-handle-" + Math.floor((Math.random() * 10000) + 1);
                    tabsBar = angular.element('<ion-scroll delegate-handle="' + ionicScrollDelegateID + '" class="slidingTabs" direction="x" scrollbar-x="false"><ul> </ul> <div class="tab-indicator-wrapper"><div class="tab-indicator"></div></div> </ion-scroll>');

                }
                else {

                    tabsBar = angular.element('<div class="slidingTabs"><ul> </ul> <div class="tab-indicator-wrapper"><div class="tab-indicator"></div></div> </div>');

                }


                slider = angular.element(element);

                var compiled = $compile(tabsBar);
                slider.parent().prepend(tabsBar);
                compiled(scope);

                //get Tabs DOM Elements
                //slideTabs = angular.element(tabsBar[0].querySelector("ul").querySelector(".slider-slide-tab"));
                indicator = angular.element(tabsBar[0].querySelector(".tab-indicator"));

                //get the slideBoxHandle
                var slideHandle = slider.attr('delegate-handle');
                var scrollHandle = tabsBar.attr('delegate-handle');

                ionicSlideBoxDelegate = $ionicSlideBoxDelegate;
                if (slideHandle) {
                    ionicSlideBoxDelegate = ionicSlideBoxDelegate.$getByHandle(slideHandle);
                }

                //setIndicatorPosition(ionicSlideBoxDelegate.currentIndex(), ionicSlideBoxDelegate.currentIndex(), 1);

                if(options.slideTabsScrollable) {

                    ionicScrollDelegate = $ionicScrollDelegate;
                    if (scrollHandle) {
                        ionicScrollDelegate = ionicScrollDelegate.$getByHandle(scrollHandle);
                    }

                }



                addEvents();
                setTabBarWidth();
                slideToCurrentPosition();
            };

            var addEvents = function() {

                ionic.onGesture("dragleft", scope.onSlideMove ,slider[0]);
                ionic.onGesture("dragright", scope.onSlideMove ,slider[0]);
                ionic.onGesture("release", scope.onSlideChange ,slider[0]);

            }

            var setTabBarWidth = function() {

                if( !angular.isDefined(slideTabs) || slideTabs.length == 0 ) {
                    return false;
                }

                //set correct Width for TabBar
                tabsList = tabsBar.find("ul");
                var tabsWidth = 0;

                angular.forEach(slideTabs, function (currentElement,index) {

                    var currentLi = angular.element(currentElement);
                    tabsWidth += currentLi[0].offsetWidth;
                });

                if(options.slideTabsScrollable) {

                    angular.element(tabsBar[0].querySelector(".scroll")).css("width", tabsWidth + 1 + "px");

                }
                else {

                    slideTabs.css("width",tabsList[0].offsetWidth / slideTabs.length + "px");
                }

                slideToCurrentPosition();

            };

            var addTabTouchAnimation = function(event,currentElement) {

                var ink = angular.element(currentElement[0].querySelector(".ink"));

                if( !angular.isDefined(ink) || ink.length == 0 ) {
                    ink = angular.element("<span class='ink'></span>");
                    currentElement.prepend(ink);
                }


                ink.removeClass("animate");

                if(!ink.offsetHeight && !ink.offsetWidth)
                {

                    d = Math.max(currentElement[0].offsetWidth, currentElement[0].offsetHeight);
                    ink.css("height", d + "px");
                    ink.css("width", d + "px");
                }

                //get click coordinates
                //logic = click coordinates relative to page - parent's position relative to page - half of self height/width to make it controllable from the center;
                x = event.offsetX - ink[0].offsetWidth / 2;
                y = event.offsetY - ink[0].offsetHeight / 2;

                //set the position and add class .animate
                ink.css("top", y +'px');
                ink.css("left", x +'px');
                ink.addClass("animate");
            }

            var slideToCurrentPosition = function() {

                if( !angular.isDefined(slideTabs) || slideTabs.length == 0 ) {
                    return false;
                }

                var targetSlideIndex = ionicSlideBoxDelegate.currentIndex();

                var targetTab = angular.element(slideTabs[targetSlideIndex]);
                var targetLeftOffset = targetTab.prop("offsetLeft");
                var targetWidth = targetTab[0].offsetWidth;



                indicator.css({
                    "-webkit-transition-duration": "300ms",
                    "-webkit-transform":"translate(" + targetLeftOffset + "px,0px)",
                    "width": targetWidth + "px"
                });

                if (options.slideTabsScrollable && ionicScrollDelegate) {
                    var scrollOffset = 40;
                    ionicScrollDelegate.scrollTo(targetLeftOffset - scrollOffset,0,true);
                }

                slideTabs.removeClass("tab-active");
                targetTab.addClass("tab-active");

            }


            var setIndicatorPosition = function (currentSlideIndex, targetSlideIndex, position) {

                if( currentSlideIndex == 0 && targetSlideIndex == ionicSlideBoxDelegate.slidesCount() - 1 ||
                    targetSlideIndex == 0 && currentSlideIndex == ionicSlideBoxDelegate.slidesCount() - 1 ) {
                    return;
                }

                var targetTab = angular.element(slideTabs[targetSlideIndex]);
                var currentTab = angular.element(slideTabs[currentSlideIndex]);

                var targetLeftOffset = targetTab.prop("offsetLeft");
                var currentLeftOffset = currentTab.prop("offsetLeft");
                var offsetLeftDiff = Math.abs(targetLeftOffset - currentLeftOffset);



                var targetWidth = targetTab[0].offsetWidth;
                var currentWidth = currentTab[0].offsetWidth;
                var widthDiff = targetWidth - currentWidth;

                var indicatorPos = 0;
                var indicatorWidth = 0;

                if (currentSlideIndex > targetSlideIndex) {

                    indicatorPos = targetLeftOffset - (offsetLeftDiff * (position - 1));
                    indicatorWidth = targetWidth - ((widthDiff * (1 - position)));

                }
                else if (targetSlideIndex > currentSlideIndex) {

                    indicatorPos = targetLeftOffset + (offsetLeftDiff * (position - 1));
                    indicatorWidth = targetWidth + ((widthDiff * (position - 1)));

                }


                indicator.css({
                    "-webkit-transition-duration":"0ms",
                    "-webkit-transform":"translate(" + indicatorPos + "px,0px)",
                    "width": indicatorWidth + "px"
                });


                if (options.slideTabsScrollable && ionicScrollDelegate) {
                    var scrollOffset = 40;
                    ionicScrollDelegate.scrollTo(indicatorPos - scrollOffset,0,false);
                }

            }

            scope.onTabTabbed = function(event, index) {
                addTabTouchAnimation(event, angular.element(event.currentTarget) );
                ionicSlideBoxDelegate.slide(index);
                slideToCurrentPosition();
            }

            scope.addTabContent = function ($content) {
                var tabIndex = angular.isDefined(slideTabs)?slideTabs.length:0;
                var newItem = angular.element('<li ng-click="onTabTabbed($event, '+ tabIndex +')" class="slider-slide-tab"></li>').html($content);

                var compiled = $compile(newItem);
                compiled(scope);
                tabsBar.find("ul").append(newItem);

                slideTabs = angular.element(tabsBar[0].querySelector("ul").querySelectorAll(".slider-slide-tab"));

                slideToCurrentPosition();
                setTabBarWidth()
            }

            scope.onSlideChange = function (slideIndex) {
                slideToCurrentPosition();
            };

            scope.onSlideMove = function () {
                var scrollDiv = slider[0].getElementsByClassName("slider-slide");

                var currentSlideIndex = ionicSlideBoxDelegate.currentIndex();
                var currentSlide = angular.element(scrollDiv[currentSlideIndex]);
                var currentSlideLeftOffset = currentSlide.css('-webkit-transform').replace(/[^0-9\-.,]/g, '').split(',')[0];

                var targetSlideIndex = (currentSlideIndex + 1) % scrollDiv.length;
                if (currentSlideLeftOffset > slider.prop("offsetLeft")) {
                    targetSlideIndex = currentSlideIndex - 1;
                    if (targetSlideIndex < 0) {
                        targetSlideIndex = scrollDiv.length - 1;
                    }
                }
                var targetSlide = angular.element(scrollDiv[targetSlideIndex]);

                var position = Math.abs(currentSlideLeftOffset / slider[0].offsetWidth);

                setIndicatorPosition(currentSlideIndex, targetSlideIndex, position);
            };

            init();
        },
        controller: ['$scope',function($scope) {
            this.addTab = function($content) {
                $timeout(function() {
                    if($scope.addTabContent) {
                        $scope.addTabContent($content);
                    }
                });
            }
        }]
    };
}]);

slidingTabsDirective.directive('ionSlideTabLabel', [ function() {
    return {
        require: "^ionSlideTabs",
        link: function ($scope, $element, $attrs, $parent) {
            $parent.addTab($attrs.ionSlideTabLabel);
        }
    }
}]);