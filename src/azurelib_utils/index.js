Plugin.register('azurelib_utils', {
    title: 'AzureLib Animator',
    author: 'AzureDoom, Eliot Lash, Gecko, McHorse',
    icon: 'azureicon.png',
    description: 'Create models, textures, and animations for AzureLib-powered mods using Bedrock-style tools.',
    tags: ['Minecraft: Java Edition'],
    version: '2.3.0',
    variant: 'both',
    min_version: '4.8.0',
    website: 'https://wiki.azuredoom.com/',
    await_loading: true,
    creation_date: '2023-04-04',
    new_repository_format: true,
    contributes: {
      formats: ['azure_model']
    },
    has_changelog: true,
  
    onload() {
      const { loadAzureLib } = require('./runtime.js');
      loadAzureLib();
    },
  
    onunload() {
      const { unloadAzureLib } = require('./runtime.js');
      unloadAzureLib();
    }
  });