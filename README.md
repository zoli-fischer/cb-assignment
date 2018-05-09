# cb-assignment
Skyfish API / Slider assignment


## About the task:
Thank you. It is a nice task to work on it, I enjoyed it. I would preferred a Photo-shop file or something with layers, but was ok to work with a jpg.

I had some problems with some of the resources, but I tried to handle.

I assumed the font is 'open sans'. On the image for tablet version provided by you the header image is not provided, it's not the same image_big.jpg in the Design Elements folder, but I used image_big.jpg also on tablet version. The instagram svg has a transparent white overlay look, at leas on my PC, I replaced with an image.


## Solving the problem:
I was focusing to make the layout as much as possible look alike to the layout from the images on that resolutions: width 1440px and 768px. It is fully responsive so I used my idea to fit on other resolutions not mentioned in the task (example: width 360px).

I used AngularJs to create the web app. The web app has 1 controller and 1 component, the slider itself. Auth token to Skyfish API shoud be placed in js/index.js as app value 'skyfishAuthToken'. 

The slider component has an attribute 'skyfish-folder-id' which is the id of the folder that is loaded in the slider from Skyfish. 

I wanted to use Bootstrap with customized grid, but I was thinking you can see my CSS/LESS skills better if I write a small grid system (not fully made only parts that I was needing for this task).

I added Hammer.js for touch event handling. The slider works with touch pan and mouse drag.

By clicking on the “Keep me updated” button in the footer the slider reloads with another folder.   By clicking more the slider toggles between folders 936177 and 935575.


## Test:


### Computer:

Windows 10 – Edge 14 and 16

Windows 10 – Chrome 58 and 65

Windows 7 – Firefox 58 and 59

Windows 7 – MSIE 9, 10 and 11 (The layout looks good in all, but 9 can't connect to API)

Mac - Safari 6, 9.1, 10.2, 11


### Mobiel Device:

iPhone X – iOS/Safari 11

iPhone 7 – iOS/Safari 10

iPhone 5S – iOS/Safari 7

iPhone Pro – iOS/Safari 11

iPhone Air – iOS/Safari 7

iPhone Mini 3 – iOS/Safari 8

Google Pixel 2 – Android 8 / Chrome

Samsung Galaxy S8 – Android 7 / Samsung browser

Samsung Galaxy S4 – Android 4.4 / Chrome
