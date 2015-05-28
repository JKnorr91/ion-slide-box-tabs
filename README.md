# ion-slide-box-tabs
This Directive adds Tabs for the Ionic Slidebox with moving indicator at the bottom.

## Preview & Demo

![alt tag](/example/img/slideTabs.gif)

[Demo1](http://knorr.ruhr/ionicSlideBoxTabs/example/example1.html)

[Demo2](http://knorr.ruhr/ionicSlideBoxTabs/example/example2.html)

## Installation

1. Add the *slidingTabsDirective.js* to your Ionic Project and include it in your *index.html*.

  Example:
  If you put the *slidingTabsDirective.js* to your *js* folder, you should paste the following line into your *index.html* anywhere after the ionic inclusion.

  ```html
  <script src="js/slidingTabsDirective.js"></script>
  ```

2. Add the SCSS or the CSS code from *slidingTabs.scss* or *slidingTabs.css* to your project Styles.

## Usage

In order to use the Tabs with an existing SlideBox, add the *ion-slide-tabs* Attribute to the *ion-slide-box* Element.
To name the Tabs you should add the Attribute *ion-slide-tab-label="yourLabel"* to the slides of the Slidebox. You can paste in any HTML for the labels.

Example:
```html
<ion-content scroll="false">
    <ion-slide-box show-pager="false" ion-slide-tabs>
        <ion-slide ion-slide-tab-label="test"><h1>Tab 1</h1></ion-slide>
        <ion-slide ion-slide-tab-label="secondTest"><h1>Tab 2</h1></ion-slide>
        <ion-slide ion-slide-tab-label="<b>boldTest</b>"><h1>Tab 3</h1></ion-slide>
    </ion-slide-box>
</ion-content>
```

## API
Currently there ist only one attribute to change the behaviour of the tabs:


|Attribute|Type|Default|Description
|-----------|------|-------------|---------|
| slide-tabs-scrollable | boolean | *true* | Wheter the tabs should be scrollable (*true*) or fill up the viewport width (*false*). In case of *false*, every tab will have the same size.


## Styling
I gave my best to give the tabs the look & feel of the Android Tabs, described in Google's [Material Design specification](http://www.google.com/design/spec/components/tabs.html).
If you want to give the tabs your own look, feel free to edit the styles in *slidingTabs.scss* or *slidingTabs.css*.

## Donate

If you like my work and want to say thanks, [you can buy me a beer or a cup of coffe.](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=62CTVYDHF5LM8)

