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
* Use simple semver for plugin versioning: MAJOR.MINOR.PATCH, e. g. "1.2.11". You need to increase the version number for each update that is published.

## File Structure
Blockbench supports two file structure systems.

### Legacy structure
The legacy format, where plugin Javascript files are saved directly in the plugins directory, was used by Blockbench 4.7 and older, and will continue to be supported for already existing plugins.

### Current structure
The new structure utilizes a separate directory per plugin in the plugins directory, which contains the plugin Javascript file, as well as other optional files.
The new structure will be used by Blockbench if A: the `"min_version"` is set to 4.8.0 or higher, or B: if the field `"new_repository_format"` in plugins.json is set to `true`.
The new structure is recommended for new plugins.

These are the files that can be added to the plugin directory
* `plugins/plugin_id/plugin_id.js`- The plugin Javascript file itself
* `plugins/plugin_id/about.md`: Markdown file containing the plugin about + instructions.
* `plugins/plugin_id/icon.png` or `icon.svg`: The plugin icon. Icons can be either PNG files with a resolution of 48x48, or they can be SVG files. To register an icon, set the icon field in the plugin meta data to the file name of the icon.
* `plugins/plugin_id/members.yml`: This file allows you to list Github users who have your permission to do changes to your model, without me having to check back with you. You can add two types of members: `maintainers` Can do anything with the plugin, including removing it entirely or modifying the members list. `developers` can contribute new versions of the plugin.
* `plugins/plugin_id/LICENSE.MD`: Add a license if you want to license your plugin as open source. You can choose your license here: [choosealicense.com](https://choosealicense.com)
* `plugins/plugin_id/changelog.json`: Add a changelog file for your plugin. Set `has_changelog` to `true` in the meta data to enable this. If you use VS Code (which I recommend), you'll automatically have autocomplete and validation for this file. Make sure to add new versions to the bottom of the file!
* `plugins/plugin_id/src/**`: Use this directory to store the plugin source, if using a bundler.

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
* **The plugin meta data needs to be the same** in the plugin file itself and in the file `plugins.json`.
* Plugins should not be larger than 2 MB
* Make sure to not bundle dependencies that are already included in Blockbench. Blockbench comes with a number of libraries already included that can be used by plugins, such as ThreeJS, Vue 2, JSZip, Marked, and MolangJS.
* This list of plugins is curated to some extends. Plugins will be reviewed and may not be accepted if they don't meet quality standards. Already published plugins may also be taken down if they no longer meet the requirements.
* While it is the goal to keep the plugin API compatible across different Blockbench version, it can happen that a feature is changed or deprecated and your plugin must be updated in order to keep working.

Once you are ready to submit your plugin, create a pull request.


## Third party contributions

As explained above, you can add approved contributors in the `members.yml` file.

For contributions from third parties, the original creator or maintainer of the plugin will be pinged in the respective Pull Request for permission.

If you have a preference, you can specify in `membery.yml` under `abandoned` what you would like to happen if you no longer contribute to the plugin and no longer approval third party contributions.
If unspecified, if you haven't replied within 4 weeks and are no longer active on Github, or if you haven't replied in 8 weeks despite being active, we may test and merge the contribution.

Some small changes like fixes for changed Blockbench APIs may be merged without asking for permission of the original creator.
