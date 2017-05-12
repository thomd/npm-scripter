# npm-scripter

A simple `npm` helper for the command-line to manage npm-scripts. It's for the lazy programmer because editing json
files is terrible.

## Install

    npm install -g npm-scripter
    alias npms='npm-scripter $@'

Get help with

    npm-scripter -h

or

    man npm-scripter

## Usage

List all npm-scripts with (basically the same as `npm run`)

    npms

List a npm-script with

    npms foo

Create a npm-script with

    npms foo 'echo "bar"'

The latter creates an entry in `package.json` like this:

    {
      ...
      "scripts": {
        "foo": "echo \"bar\""
      }
      ...
    }
