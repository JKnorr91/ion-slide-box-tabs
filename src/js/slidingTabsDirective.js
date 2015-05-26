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


                slider = $(element);

                var compiled = $compile(tabsBar);
                slider.before(tabsBar);
                compiled(scope);

                //get Tabs DOM Elements
                slideTabs = tabsBar.find("li");
                indicator = tabsBar.find(".tab-indicator");

                //get the slideBoxHandle
                var slideHandle = slider.attr('delegate-handle');
                var scrollHandle = tabsBar.attr('delegate-handle');

                ionicSlideBoxDelegate = $ionicSlideBoxDelegate;
                if (slideHandle) {
                    ionicSlideBoxDelegate = ionicSlideBoxDelegate.$getByHandle(slideHandle);
                }

                setIndicatorPosition(ionicSlideBoxDelegate.currentIndex(), ionicSlideBoxDelegate.currentIndex(), 1);

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
                //set correct Width for TabBar
                tabsList = tabsBar.find("ul");
                var tabsWidth = 0;

                tabsList.find("li").each(function (index) {

                    var currentLi = $(this);
                    tabsWidth += currentLi.outerWidth();

                    ionic.on("click", function (e) {

                        addTabTouchAnimation(e, currentLi);
                        ionicSlideBoxDelegate.slide(index);
                        slideToCurrentPosition();

                    },this);

                });

                if(options.slideTabsScrollable) {

                    tabsList.closest(".scroll").css("width", tabsWidth + 1);

                }
                else {

                    tabsList.find("li").css("width",tabsList.width() / tabsList.find("li").size());
                }

                slideToCurrentPosition();

            };

            var addTabTouchAnimation = function(event,element) {

                //create .ink element if it doesn't exist
                if(element.find(".ink").length == 0) {
                    element.prepend("<span class='ink'></span>");
                }

                ink = element.find(".ink");
                //incase of quick double clicks stop the previous animation
                ink.removeClass("animate");

                //set size of .ink
                if(!ink.height() && !ink.width())
                {
                    //use parent's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
                    d = Math.max(element.outerWidth(), element.outerHeight());
                    ink.css({height: d, width: d});
                }

                //get click coordinates
                //logic = click coordinates relative to page - parent's position relative to page - half of self height/width to make it controllable from the center;
                x = event.pageX - element.offset().left - ink.width()/2;
                y = event.pageY - element.offset().top - ink.height()/2;

                //set the position and add class .animate
                ink.css({top: y+'px', left: x+'px'}).addClass("animate");
            }

            var slideToCurrentPosition = function() {

                var targetSlideIndex = ionicSlideBoxDelegate.currentIndex();

                var targetTab = $(slideTabs[targetSlideIndex]);
                var targetLeftOffset = targetTab.prop("offsetLeft");
                var targetWidth = targetTab.outerWidth();



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

                var targetTab = $(slideTabs[targetSlideIndex]);
                var currentTab = $(slideTabs[currentSlideIndex]);

                var targetLeftOffset = targetTab.prop("offsetLeft");
                var currentLeftOffset = currentTab.prop("offsetLeft");
                var offsetLeftDiff = Math.abs(targetLeftOffset - currentLeftOffset);


                var targetWidth = targetTab.outerWidth();
                var currentWidth = currentTab.outerWidth();
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

            scope.addTabContent = function ($content) {
                var newItem = $("<li></li>").html($content);
                tabsBar.find("ul").append(newItem);
                slideTabs = tabsBar.find("li");
                slideToCurrentPosition();
                setTabBarWidth()
            }

            scope.onSlideChange = function (slideIndex) {
                slideToCurrentPosition();
            };

            scope.onSlideMove = function () {
                var scrollDiv = slider.find(".slider-slide");


                var currentSlideIndex = ionicSlideBoxDelegate.currentIndex();
                var currentSlide = $(scrollDiv[currentSlideIndex]);

                var targetSlideIndex = (currentSlideIndex + 1) % scrollDiv.size();
                if (currentSlide.offset().left > currentSlide.closest(".slider").offset().left) {
                    targetSlideIndex = currentSlideIndex - 1;
                    if (targetSlideIndex < 0) {
                        targetSlideIndex = scrollDiv.size() - 1;
                    }
                }
                var targetSlide = $(scrollDiv[targetSlideIndex]);

                var position = Math.abs(currentSlide.offset().left / targetSlide.closest(".slider").width());

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