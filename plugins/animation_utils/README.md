# GeckoLib Animation Utils Developer Readme

This readme is intended for developers wishing to work on the GeckoLib plugin.

# Environment setup
## Windows
Inspect the contents of [.nvmrc](./src/.nvmrc) - this specifies the recommended version of Node.JS to use for plugin development. You can [download the corresponding version of Node.JS here](https://nodejs.org/en/download/releases).


## macOS and Unix
It's recommended, though not required, to install the correct version of Node.JS using the Node Version Manager script (nvm). [Follow the install guide here](https://github.com/nvm-sh/nvm/blob/master/README.md).

A brief summary of how to use `nvm` once it's installed is to `cd` into the [src](./src) folder of the plugin and then run:
```
nvm install `cat .nvmrc`
```
followed by: 
```
nvm use
```
If you have multiple versions of node installed on your system, it may be convenient to [change the default version to the version of node you just installed](https://github.com/nvm-sh/nvm/blob/master/README.md#set-default-node-version). Otherwise you may need to run `nvm use` every time you start a new terminal session. If you are using `nvm` for other projects with other versions of node, you can also use a [shell hook script to automatically run nvm use when changing directories](https://stackoverflow.com/questions/23556330/run-nvm-use-automatically-every-time-theres-a-nvmrc-file-on-the-directory).

You can confirm the active node version by running 
```
node --version
```

## All Platforms
After Node.JS has been installed, run:
```
npm install
```

Inside the `src` folder.

You should run this command any time there has been a change to `package.json`. You might see a diff on `package-lock.json`. This is usually OK and indicates an update to transient dependenices, and should be OK to commit. If you see a LOT of changes to this file it might be an indication you are using the wrong version of node/npm.

# Developing the plugin

## Working on the plugin
First, start the development webpack bundler:
```
npm start
```
The development bundler will watch the filesystem for changes and automatically re-build the plugin to [animation_utils.js](./animation_utils.js).

Then, you can load the plugin in Blockbench from `File` -> `Plugins` and selecting the `Load Plugin from File` button. Every time you make a change to the plugin source code, the bundler will automatically rebuild the plugin, but you still need to reload it in Blockbench in order for the changes to take effect. You can do this by selecting `Help` -> `Developer` -> `Reload Plugins`. In some cases if the global state has been messed up, you may need to reload the entire application using `Help` -> `Developer` -> `Reload Blockbench`. It's also recommended to select `Open Dev Tools` from this menu as it can be very helpful to explore the Blockbench API using the console and inspect error logs and debug breakpoints.

As every time you load the plugin, it's considered by the JS interpreter to be a different source file, any breakpoints set on the previously loaded file will be lost. You can work around this by adding a `debugger;` statement inside the source code where you want to set a breakpoint, which will force the JS interpreter to break on that line.

If a TypeScript compiler error is encountered, it will be logged to the terminal window, but the JS bundle will still be generated.

To check for errors, you can run:
```
npm run test
```
This will run all pretest scripts (eslint and TypeScript type check) as well as unit tests. It's also possible to run pretest separately, or the individual checks by themselves. To see all available npm scripts, run:
```
npm run
```

## Building a release of the plugin
First, inspect [package.json](./src/package.json) to make sure all the properties are correct. If you are making a release of the plugin, you should bump the `version` property to be one minor version up for a bugfix, minor version for new features, or major version for backwards-incompatible breaking changes.
Then, check the `blockbenchConfig`. `min_version` should be the lowest version of Blockbench the plugin is known to work with and `max_version` should be the first version the plugin is expected to not work with that's higher than the versions it was tested on. When the metadata is ready, run:
```
npm run build
```
This will first run prebuild/pretest/test scripts, then build the plugin and automatically update the [plugins.json](../../plugins.json) manifest with your settings.

Then, update the [CHANGELOG](./CHANGELOG.md) to add patch notes for the new version.

Double-check everything looks right, then commit and make a PR to [JannisX11/blockbench-plugins](https://github.com/JannisX11/blockbench-plugins) to release the plugin.

Note that it is possible to skip pre-build scripts by running:
```
npm run build:only
```
This is dangerous and shouldn't be done to make a full release, it's better to fix any errors from tests, lint, and compiler before publishing changes.

## Using TypeScript
The plugin is now written using a loose version of [TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html). Blockbench types are supplied by the [blockbench-types](https://github.com/JannisX11/blockbench-types) package. Note that these types are hand-written and may contain errors or be missing certain APIs. So just because you see an error message in your IDE or the bundler output doesn't neccessarily mean your code is wrong, it's possible it could be an issue with the type definitions. TypeScript errors won't prevent the plugin from being built so you can always test your code manually and/or inspect the [Blockbench source code](https://github.com/JannisX11/blockbench) to confirm the code is correct. If there's an error in the types, there are a few ways of fixing it:
1. Make a PR to `blockbench-types`. This is the best, although possibly the slowest method of fixing type errors, and will help all other plugin authors.
    * These changes can be tested locally first using `npm link`. To do so, clone the repo and ensure the same node version is being used as the one for the plugin. Then run `npm link` inside `blockbench-types`. Finally, run `npm link blockbench-types` inside the plugin `src` folder. This will create a symbolic link inside `node_modules` so that the types are resolved from your local copy of `blockbench-types`. You need to run `npm link blockbench-types` after every time you run `npm install` because an install overwrites the symlink.
1. Massage the types inside the plugin. There are a number of ways you can do this, such as:
   * Use [type assertions (aka casting)](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions). Performing an `as` cast directly into the target type is the safest method. If neccessary, casting via `as unknown as <Target Type>` will cause the compiler to ignore insufficient overlap between types. It's also possible to attempt to change the type of a function parameter or inferred variable type  by adding a type annotation, such as:
   ```typescript
   (kf: GeckolibKeyframe) => { } // Otherwise kf would be a Keyframe
   ```
   or
   ```typescript
    let easingBar: HTMLElement = document.createElement('div'); // Otherwise this would be an HTMLDivElement
   ```
   * Subclassing a blockbench type (for an example of this see usage of the `GeckolibBoneAnimator` in [codec.ts](./src/codec.ts)).
   * Performing [type narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).
   * There are other options, such as [declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#handbook-content).
1. The nuclear option when all else fails: slap a `// @ts-ignore` comment above the problematic line(s). This is a bit dangerous as it shuts off ALL type checking on on that line, but sometimes this is necessary if you need to just force the compiler to ignore a problematic area of the code.

Some places that are good to look for help with TypeScript are the [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html), [TypeScript Discord](https://discord.com/invite/typescript), or you can ping Eliot on the GeckoLib Discord.

# Working with ESLint
[ESLint](https://eslint.org) is a tool for checking the code for common errors or problematic coding styles. It can be integrated into IDEs via plugins, and can be run from the terminal like so:
```
npm run lint
```

Some lint errors can be fixed automatically by running:
```
npm run lint:fix
```

It's best to fix errors by changing the source code when possible. There are some cases in which certain lint rules might get in the way of particular things we might need to do in the plugin. In this case, [the rules can be disabled for different scopes](https://eslint.org/docs/latest/use/configure/rules). It's best to keep the scope as small as possible, so disabling individual rules per-line is the best way to start, or if it's needed in a larger area, disabling individual rules for a block of code, then lastly a whole file. You can search the code for `eslint-disable` to find examples. In some cases it may be necessary to disable a rule for the entire codebase, this can be done in the `rules` block of the [.eslintrc.cjs](./src/.eslintrc.cjs) file.
