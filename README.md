# npm-scripter

[![Build Status](https://travis-ci.org/thomd/npm-scripter.png)](https://travis-ci.org/thomd/npm-scripter)

A simple `npm` helper for the command-line to manage npm-scripts.

> It's for the lazy programmer because editing json files is terrible.

## Install

```shell
npm install -g npm-scripter
```

Create a bash alias if you like with

```shell
alias nps='npm-scripter $@'
```

Get help with

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

Create a npm-script with

```shell
nps foo 'echo "bar"'
```

The latter creates an entry in `package.json` like this:

```javascript
{
  // ...
  "scripts": {
    "foo": "echo \"bar\""
  }
  // ...
}
```

Edit a npm-script (only the code part) in `$EDITOR` with

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

