# Blockbench Plugin Repository

Create a pull request to submit or update plugins. Open an issue to report bugs within plugins and tag the author if possible.

## Installing Plugins

To install a plugin, go to File > Plugins... and switch to the available tab. Find the plugin you want to use and click Install.


## Links

* Main Blockbench repository: [JannisX11/blockbench](https://github.com/JannisX11/blockbench)
* Plugin Documentation: [documentation.blockbench.net](https://documentation.blockbench.net)
* Discord plugin development channel: [#bb-plugin-dev](https://discord.gg/xtauSmR)

## Conventions

* Plugin IDs should be snake_case and must be consistent across all properties and file names.
* Indentation for common files must be Tab character. Individual plugin files can follow own personal preferences.

## Development

* To develop a plugin, fork and clone the repository. Make sure [NodeJS](https://nodejs.org/en/) is installed and run `npm install` in the repository. This will install the Blockbench types that make it easier to use the Blockbench API.

## Bundling

* If you are writing a complex plugin and you are using a module bundler such as Webpack or Browserify, you are required to host your source code in this repository in the src/ folder.
* Check out the webpack_template and the existing source folders to see how to set it up.
