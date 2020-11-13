# margara
Visual Validation CLI Tool

## Description
Margara helps engineers to quickly capture and validate the visual state of a webapp by comparing screenshots against different environments and browsers.

(It uses playwright under the hood)

## Getting Started

### Installation

```bash
npm install -g @coffeestain/margara
```

### Usage

```bash
margara shot -url https://www.google.com
```

Or you could specify the browsers to check:

```bash
-browsers chromium firefox webkit -browsers chromium firefox webkit
```

