**Hytale Hitbox Helper** is a dedicated plugin for Blockbench designed to streamline the creation and export of collision hitboxes for Hytale.

## Features

* **Dedicated Format:** Adds a new "Hytale Hitbox" project type.
* **Quick Add:** One-click button to add a standard 32x32x32 hitbox.
* **Multiple Hitboxes:** It supports adding multiple Hitboxes.
* **Smart Export:** * Exports strictly to Hytale's `.json` format.
    * Only exports elements named "hitbox" (case insensitive).
    * Automatic coordinate conversion (32 BB units = 1.0 Hytale unit).
* **References:** You can import other reference block mode models; they do not interfere with the hitbox.

## References Models

If you go to **File > Import** you can Import a model to use it as reference, it has to be (.blockymodel)
It wont be imported.

## How to Use

1.  Go to **File > New** and select **Hytale Hitbox**.
2.  Use the **Add Hitbox** button in the "Add Element" menu (sidebar).
3.  Resize and position your hitboxes as needed. 
    * *Note: Ensure the elements are named "hitbox" in the outliner.*
4.  Go to **File > Export > Export Hytale Hitbox (.json)**
