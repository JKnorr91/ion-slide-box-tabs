# ion-slide-box-tabs
This Directive adds Tabs for the Ionic Slidebox with moving indicator at the bottom.

## Preview

![alt tag](/example/img/slideTabs.gif)

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

In order to user custom HTML template in tab label, add the *<ion-slide-tab-label>* tab. You can also use AngularJS varible inside, like *{{...}}*:

Example:
```html
<ion-slide-box slide-tabs-scrollable="true"  show-pager="false" ion-slide-tabs>
    <ion-slide ion-slide-tab-label="tab"><h1>Tab 1</h1></ion-slide>
    <ion-slide ion-slide-tab-label="another tab"><h1>Tab 2</h1></ion-slide>
    <ion-slide>
        <ion-slide-tab-label>
            <span>{{compiled}}</span>
        </ion-slide-tab-label>
        <h1>Tab 3</h1>
    </ion-slide>
</ion-slide-box>
```


## API
Currently there ist only one attribute to change the behaviour of the tabs:


|Attribute|Type|Default|Description
|-----------|------|-------------|---------|
| slide-tabs-scrollable | boolean | *true* | Wheter the tabs should be scrollable (*true*) or fill up the viewport width (*false*). In case of *false*, every tab will have the same size.
| slide-tabs-bottom | boolean | *false* | Wheter the tabs should positioned at bottom (*true*) or top (*false*) of the *<ion-content>*/*<div>*.
| slide-tabs-icon-top | boolean | *false* | Wheter the tabs has icon at top and title at bottom of tab's label (*true*) or simple tab (*false*).


On `ion-slide-tab-label` tag can use the following attributes:


|Attribute|Type|Default|Description
|-----------|------|-------------|---------|
| disable-slide | boolean | *true* | Wheter the slide should be disabled from slide (*true*) or normal status (*false*).


## Styling
I gave my best to give the tabs the look & feel of the Android Tabs, described in Google's [Material Design specification](http://www.google.com/design/spec/components/tabs.html).
If you want to give the tabs your own look, feel free to edit the styles in *slidingTabs.scss* or *slidingTabs.css*.
