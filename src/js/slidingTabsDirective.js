
var slidingTabsDirective = angular.module("ionic").directive('ionSlideTabs', [
    '$timeout', '$compile', '$interval', '$ionicSlideBoxDelegate', '$ionicScrollDelegate',
    function($timeout, $compile, $interval, $ionicSlideBoxDelegate, $ionicScrollDelegate) {

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
                    "slideTabsScrollable": true,
                    "slideTabsBottom" : false,
                    "slideTabsIconTop" : false
                };

                var init = function () {

                    if(angular.isDefined( attrs.slideTabsScrollable ) && attrs.slideTabsScrollable === "false" ) {
                        options.slideTabsScrollable = false;
                    }

                    if(angular.isDefined( attrs.slideTabsBottom ) && attrs.slideTabsBottom === "true" ) {
                        options.slideTabsBottom = true;
                    }

                    if(angular.isDefined( attrs.slideTabsIconTop ) && attrs.slideTabsIconTop === "true" ) {
                        options.slideTabsIconTop = true;
                    }

                    var tabItems = '<li ng-repeat="(key, value) in tabs" ng-click="onTabTabbed($event, {{key}})" class="slider-slide-tab" tab-compile="value"></li>';

                    var indicatorHtml = '<div class="tab-indicator-wrapper"><div class="tab-indicator"></div></div>';

                    var tabIconTopClass = "";
                    if(options.slideTabsIconTop){
                        tabIconTopClass = "tabs-icon-top";
                    }

                    if(options.slideTabsScrollable) {
                        ionicScrollDelegateID = "ion-slide-tabs-handle-" + scope.delegateID;
                        if(options.slideTabsBottom) {
                            tabsBar = angular.element('<ion-scroll delegate-handle="' + ionicScrollDelegateID + '" class="slidingTabs ' + tabIconTopClass+ ' tabs-bottom" direction="x" scrollbar-x="false"> ' + indicatorHtml + ' <ul class="tabs">' + tabItems + '</ul></ion-scroll>');
                        }
                        else {
                            tabsBar = angular.element('<ion-scroll delegate-handle="' + ionicScrollDelegateID + '" class="slidingTabs ' + tabIconTopClass+ '" direction="x" scrollbar-x="false"><ul class="tabs">' + tabItems + '</ul> ' + indicatorHtml + ' </ion-scroll>');
                        }
                    }
                    else {
                        if(options.slideTabsBottom) {
                            tabsBar = angular.element('<div class="slidingTabs ' + tabIconTopClass+ ' tabs-bottom"> ' + indicatorHtml + ' <ul class="tabs">' + tabItems + '</ul></div>');
                        }
                        else {
                            tabsBar = angular.element('<div class="slidingTabs ' + tabIconTopClass+ '"><ul>' + tabItems + '</ul class="tabs"> ' + indicatorHtml + ' </div>');
                        }
                    }

                    slider = angular.element(element);

                    if(options.slideTabsBottom){
                        slider.parent().append(tabsBar);
                        slider.addClass("tabs-bottom");
                    }
                    else{
                        slider.parent().prepend(tabsBar);
                    }

                    var compiled = $compile(tabsBar);

                    if(options.slideTabsBottom){
                        slider.parent().append(tabsBar);
                        slider.addClass("tabs-bottom");
                    }
                    else{
                        slider.parent().prepend(tabsBar);
                    }
                    compiled(scope);

                    //get Tabs DOM Elements
                    indicator = angular.element(tabsBar[0].querySelector(".tab-indicator"));

                    //get the slideBoxHandle
                    var slideHandle = slider.attr('delegate-handle');
                    var scrollHandle = tabsBar.attr('delegate-handle');

                    ionicSlideBoxDelegate = $ionicSlideBoxDelegate;
                    if (slideHandle) {
                        ionicSlideBoxDelegate = ionicSlideBoxDelegate.$getByHandle(slideHandle);
                    }

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
                };

                var setTabBarWidth = function() {

                    if( !angular.isDefined(slideTabs) || slideTabs.length == 0 ) {
                        return false;
                    }

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

                    if(!ink.offsetHeight && !ink.offsetWidth){
                        d = Math.max(currentElement[0].offsetWidth, currentElement[0].offsetHeight);
                        ink.css("height", d + "px");
                        ink.css("width", d + "px");
                    }

                    x = event.offsetX - ink[0].offsetWidth / 2;
                    y = event.offsetY - ink[0].offsetHeight / 2;

                    ink.css("top", y +'px');
                    ink.css("left", x +'px');
                    ink.addClass("animate");

                    $timeout(function(){
                        ink.removeClass("animate");
                    }, 700);
                };

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
                };

                var setIndicatorPosition = function (currentSlideIndex, targetSlideIndex, position, slideDirection) {

                    var targetTab = angular.element(slideTabs[targetSlideIndex]);

                    var currentTab = angular.element(slideTabs[currentSlideIndex]);
                    var targetLeftOffset = targetTab.prop("offsetLeft");

                    var currentLeftOffset = currentTab.prop("offsetLeft");
                    var offsetLeftDiff = Math.abs(targetLeftOffset - currentLeftOffset);

                    if( currentSlideIndex == 0 && targetSlideIndex == ionicSlideBoxDelegate.slidesCount() - 1 && slideDirection == "right" ||
                        targetSlideIndex == 0 && currentSlideIndex == ionicSlideBoxDelegate.slidesCount() - 1 && slideDirection == "left" ) {
                        return;
                    }

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
                };

                scope.onTabTabbed = function(event, index) {
                    addTabTouchAnimation(event, angular.element(event.currentTarget) );
                    ionicSlideBoxDelegate.slide(index);
                    slideToCurrentPosition();
                };

                scope.compileTab = function(index){
                    var tabHTML = scope.tabs[index];
                    //var tabCompiled = $compile(tabHTML)(scope.$parent);
                    //var li = document.querySelector("li#delegate-"+scope.delegateID+"-"+index);
                    //li.textContent(tabCompiled);

                    document.querySelector("li#delegate-"+scope.delegateID+"-"+index).appendChild($compile(tabHTML)(scope.$parent)[0]);
                };

                scope.tabs = [];

                scope.addTabContent = function ($content) {

                    scope.tabs.push($content);
                    scope.$apply();

                    $timeout(function() {
                        slideTabs = angular.element(tabsBar[0].querySelector("ul").querySelectorAll(".slider-slide-tab"));
                        slideToCurrentPosition();
                        setTabBarWidth()
                    });
                };

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

                    var position = currentSlideLeftOffset / slider[0].offsetWidth;
                    var slideDirection = position > 0 ? "right":"left";
                    position = Math.abs(position);

                    setIndicatorPosition(currentSlideIndex, targetSlideIndex, position, slideDirection);
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
        restrict: "A",
        require: "^ionSlideTabs",
        link: function ($scope, $element, $attrs, $parent) {
            $parent.addTab($attrs.ionSlideTabLabel);
        }
    }
}]);

slidingTabsDirective.directive('tabCompile', function ($compile) {
    return {
        restrict: 'A',
        replace: false,
        link: function (scope, ele, attrs) {
            scope.$watch(attrs.tabCompile, function(html) {
                ele.html(html);
                $compile(ele.contents())(scope);
            });
        }
    };
});

slidingTabsDirective.directive('ionSlideTabLabel', [ function($timeout) {
    return {
        restrict: "E",
        require: "^ionSlideTabs",
        link: function ($scope, $element, $attrs, $parent) {
            $parent.addTab($element[0].innerHTML);
            $element.remove();
        }
    }
}]);