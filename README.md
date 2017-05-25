# npm-scripter

[![Build Status](https://travis-ci.org/thomd/npm-scripter.png)](https://travis-ci.org/thomd/npm-scripter)
[![Known Vulnerabilities](https://snyk.io/test/github/thomd/npm-scripter/badge.svg)](https://snyk.io/test/github/thomd/npm-scripter)

A simple `npm` helper for the command-line to manage npm-scripts.

> It's for the lazy programmer because editing json files is terrible.

<img src="https://raw.githubusercontent.com/thomd/npm-scripter/images/screenshot.png">

## Install

```shell
npm install -g npm-scripter
```

If you like, create a bash alias

```shell
alias nps='npm-scripter'
```

Get help & examples with

```shell
nps -h
```

## Usage

List all npm-scripts with (basically the same as `npm run`)

```shell
nps
```

List npm-script `foo` with

```shell
nps foo
```

Create a new npm-script with

```shell
nps foo 'echo "bar"'
```

This creates an entry in `package.json` like this:

```javascript
  "scripts": {
    "foo": "echo \"bar\""
  }
```

Edit an existing npm-script (only the commands part) in `$EDITOR` with

```shell
nps foo -e
```

Delete npm-script `foo` with

```shell
nps foo -d
```


Delete all npm-scripts with

```shell
nps -d
```

