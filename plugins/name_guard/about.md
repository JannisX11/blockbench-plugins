# Name Guard

Name Guard cleans folder and cube names so your models export safely.

Before:

`Right Arm`
- `Cube`
- `Cube`

After:

`right_arm`
- `right_arm`
- `right_arm`

## What It Does

- Converts names to lowercase
- Removes accents
- Replaces spaces and invalid characters with `_`
- Cleans folder names
- Renames cubes from their parent folder name
- Keeps root cubes safe by cleaning their own names

## Usage

Open your model, then run:

`Filter > Clean Names`

