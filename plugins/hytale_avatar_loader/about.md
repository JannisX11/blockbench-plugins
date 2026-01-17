# Hytale Avatar Loader for Blockbench

A Blockbench plugin for **Hytale** that loads complete avatar models with automatic texture processing and gradient map application.

## Features

- **Automatic Avatar Loading**: Load complete avatars from Hytale skin JSON files
- **Gradient Map Processing**: Automatically applies gradient maps to greyscale textures based on color selections
- **Smart Color Preservation**: Preserves existing colors (like gold accents) while applying gradient maps only to greyscale areas
- **Batch Processing**: Processes all avatar components (skin, hair, eyes, clothing, accessories) in one operation
- **Temporary File Management**: Creates timestamped folders to prevent overwriting when loading multiple avatars

## Requirements

- Blockbench Desktop version
- **Hytale** game assets (extracted Assets folder)
- **Hytale** avatar JSON file from `%appdata%\Hytale\UserData\CachedPlayerSkins`

## Permissions

When you first use the plugin, Blockbench will request permissions to access the file system. **We recommend accepting these permissions**, as the plugin requires file system access to read avatar JSON files, load assets, and process textures. Without these permissions, the plugin will not function properly.

## Usage

1. Open Blockbench and ensure you're using the Hytale Character format
2. Go to **File → Import → Load Avatar from JSON**
3. Select your avatar JSON file from the CachedPlayerSkins folder
4. Select the extracted Assets folder when prompted
5. The plugin will automatically:
   - Process all textures with appropriate gradient maps
   - Load all models and attachments
   - Apply colors based on your avatar configuration

## How It Works

The plugin reads your avatar JSON configuration and:
- Identifies which gradient set to use for each component (Skin, Hair, Eyes, Fabric types, etc.)
- Applies gradient maps to greyscale textures based on selected colors
- Preserves colored elements (like gold details) while tinting greyscale areas
- Creates processed textures in a temporary folder with timestamp
- Loads all models and textures into Blockbench

## Supported Components

- Body characteristics (skin tones)
- Haircuts and eyebrows
- Eyes and facial features
- Clothing (tops, pants, shoes, etc.)
- Accessories (gloves, capes, head/face/ear accessories)
- All cosmetic items with gradient map support

## Notes

- Processed textures are saved in `temp_avatar_loader/[timestamp]/` to avoid overwriting
- The plugin automatically detects material types and applies appropriate gradient sets
- Textures without colors (like faces) use the body characteristic skin color
