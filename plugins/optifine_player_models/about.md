This plugin adds a new format that allows you to make you own custom OptiFine player models.

## Setup
1. Open your launcher and go to the **Installations** tab.
2. Find your installation, click the triple dot, and slect **Edit**.\
3. Select **More Options**.
4. Inside the **JVM ARGUMENTS** field, add:
`-Dplayer.models.local=true -Dplayer.models.reload=true`
Note:\t**player.models.reload** reloads the model every 5 seconds in game, and can be disabled after you finish making the model.
5. Make a folder named <code>playermodels</code> inside your **.minecraft** folder.
6. Inside that folder, make 2 more folders named <code>items</code> and <code>users</code>.

## Usage
- You need a config file for every player with a player model. This config file must be the players username, and needs to go in the **users** folder.
**Example**: `.minecraft/playermodels/users/ewanhowell5195.cfg`
- You can create a user config by going to **File > Export > Create OptiFine Player Model Config**.
- Exported player models should go in a folder named what the player model is, inside the **items** folder, and be named `model.cfg`.
**Example**: `.minecraft/playermodels/items/horns/model.cfg`
- If not using **Use Player Texture**, textures must go inside a folder named `users` located next to the model file, and be named the players username.
**Example**: `.minecraft/playermodels/items/horns/users/ewanhowell5195.png`

## Limitations
- They are client side only.
- They are not part of resource packs.
- They require OptiFine, and JVM args set in the launcher.
- Animations are not supported.
- You can only target specific players, not all players.

## Important
Enabling the player model JVM arguments **will disable any online player models**, usually being seasonal cosmetics like the Santa and Witch hats.