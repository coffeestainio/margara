# margara

<div align="center">
<p>
    Visual Validation CLI Tool for Manual Testers
</p>
<p> 
![Test](https://github.com/coffeestainio/margara/workflows/Node.js%20Package/badge.svg?event=pull_request)
</p>




## Description

Margara helps engineers quickly capture and validate the visual state of a webapp by comparing screenshots against different environments and browsers.

### Pre-requisites

Margara _uses playwright under the hood_ which means that you will require several tools to make it work:

* NodeJs v12.19.0 or up
* In order to capture screenshots for specific browsers you have to have them installed:
  * Chrome _chromium_
  * Firefox _firefox_
  * Safari _webkit_

## Getting Started

## Installation

```bash
npm install -g @coffeestain/margara
```

## Usage

### Take Screenshot

You can take screenshots of a single page in a browser

```bash
margara shot -url https://www.google.com
```

Or you could specify the browsers to check:

```bash
margara shot -browsers chromium firefox webkit -browsers chromium firefox webkit
```

### Compare Website

You can compare the state of a website against a baseline and a target .png.

If you don't have a baseline it is recorded on the first execution.

```bash
margara shot -t https://www.google.com
```

If you have a baseline it uses it to compare with the screenshot.

```bash
margara shot -t https://www.google.com
```

Or you can specify the baseline url and target url and compare them on a single execution.

```bash
margara shot -t https://www.google.com -B https://www.google.com?q=hola
```

You can always specify which browsers to run this

```bash
margara compare -t https://www.google.com -B https://www.google.com\?q\=hola -b firefox
```

## Notes

Make sure you have installed the browsers in which you want to compare.

Firefox: firefox
Chrome: chromium
Safari: webkit
