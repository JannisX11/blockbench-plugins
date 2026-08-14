'use strict';
const fs = require('fs');
const path = require('path');
const root = __dirname;
const files = ['core.js', 'materials.js', 'engine.js', 'persistence.js', 'ui.js', 'plugin.js'];
const body = files.map(file => fs.readFileSync(path.join(root, 'src', file), 'utf8').trim()).join('\n\n');
const banner = `/** Render Studio 1.0.0 - Made by shady - Blockbench 5.1+ - MIT License */`;
fs.writeFileSync(path.join(root, 'render_studio.js'), `${banner}\n(function() {\n'use strict';\nconst RenderStudio = {};\n${body}\n})();\n`);
console.log('Built render_studio.js');
