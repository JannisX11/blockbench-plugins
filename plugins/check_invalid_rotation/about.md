# Minecraft Rotation Checker

Protect your models from Minecraft compatibility issues by detecting non-standard rotations before export.

## 🎯 Key Features
• **Smart Detection**: Identifies rotations that don't follow Minecraft Bedrock's 22.5° increment standard
• **Export Protection**: Shows warning dialog before exporting JSON or BBModel files
• **Detailed Information**: Lists all problematic rotations with suggested corrections
• **User Choice**: Continue export or cancel to fix rotations first
• **Zero Interference**: Only activates during export, doesn't affect normal workflow

## 📐 Minecraft Bedrock Standards
Minecraft Bedrock supports rotations in 22.5° increments:
**-45°, -22.5°, 0°, 22.5°, 45°**

Non-standard rotations may cause visual glitches or incorrect model orientation in-game.

## 💡 How It Works
1. When you export a model as JSON or BBModel, the plugin automatically scans all rotation values
2. If non-standard rotations are found, a beautiful warning dialog appears
3. The dialog shows exactly which elements have problematic rotations and suggests corrections
4. You can choose to continue export (at your own risk) or cancel to fix the rotations first
5. Models with only standard rotations export normally without any interruption

## 🚀 Benefits
• **Prevent Export Errors**: Catch rotation issues before they cause problems in Minecraft
• **Save Time**: No more trial-and-error with model exports
• **Professional Results**: Ensure your models display correctly in-game
• **Educational**: Learn about Minecraft's rotation standards
• **Non-Intrusive**: Only activates when needed, doesn't slow down your workflow

## 🌍 Multi-Language Support
The plugin automatically detects Blockbench's language setting and adapts the UI accordingly:
- **English**: Full support with detailed messages
- **French**: Complete translation with localized interface
- **Other languages**: Falls back to English

## 🔧 Technical Details
- Compatible with Blockbench 4.12.6+
- Uses only built-in Blockbench APIs
- No external dependencies
- Lightweight and efficient
- Automatic rotation normalization
- Smart duplicate detection

*Version 1.0.0 - Compatible with Blockbench 4.12.6+*
