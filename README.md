# margara
Visual Validation CLI Tool

## Description
Margara helps engineers to quickly capture and validate the visual state of a webapp by comparing screenshots against different environments and browsers.

(It uses playwright under the hood)

# Getting Started

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
