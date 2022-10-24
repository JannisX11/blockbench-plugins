# Blockbench Plugin Repository

Create a pull request to submit or update plugins. Open an issue to report bugs within plugins and tag the author if possible.

## Installing Plugins

To install a plugin, go to File > Plugins... and switch to the available tab. Find the plugin you want to use and click Install.


## Links

* Discover plugins: [blockbench.net/plugins](https://blockbench.net/plugins)
* Main Blockbench repository: [JannisX11/blockbench](https://github.com/JannisX11/blockbench)
* Plugin Documentation: [blockbench.net/wiki/api/plugin](https://www.blockbench.net/wiki/api/plugin)
* Discord plugin development forum: [#bb-plugin-dev](https://discord.gg/2Df3h6ge9f)

## Conventions

* Plugin IDs should be snake_case and must be consistent across all properties and file names.
* Indentation for common files must be Tab character. Individual plugin files can follow own personal preferences.

## Development

* To develop a plugin, fork and clone the repository. Make sure [NodeJS](https://nodejs.org/en/) is installed and run `npm install` in the repository. This will install the Blockbench types that make it easier to use the Blockbench API.

## Bundling

* If you are writing a complex plugin and you are using a module bundler such as Webpack or Browserify, you are required to host your source code in this repository in the src/ folder.
* Check out the webpack_template and the existing source folders to see how to set it up.

## Submission

In order to submit your plugin, you need to meet a few requirements:

* If your plugin is created by a bundler, you need to upload the source as well. See **Bundling**
* If your plugin is designed for anything related to Minecraft, add one of the tags `Minecraft: Java Edition`, `Minecraft: Bedrock Edition` (or `Minecraft`). The same applies if it's designed for another specific game.
	(Keep in mind that artists from many different areas use Blockbench, so provide some context in the meta data)
* In total, you can provide up to three plugin tags
* The plugin meta data needs to be the same in the plugin file itself and in the file `plugins.json`.
* This list of plugins is curated to some extends. Plugins will be reviewed and may not be accepted if they don't meet quality standards. Already published plugins may also be taken down if they no longer meet the requirements.
* While it is the goal to keep the plugin API compatible across different Blockbench version, it can happen that a feature is changed or deprecated and your plugin must be updated in order to keep working.

Once you are ready to submit your plugin, create a pull request.
