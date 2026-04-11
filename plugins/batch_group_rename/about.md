Batch rename all child groups under a selected group using a clear, hierarchical numbering system.

## How to Use

1. Select a group in the **Outliner**
2. Go to **Tools > Batch Rename Child Groups**, or right-click the group and select **Batch Rename Child Groups**
3. Configure the options in the dialog, then click **Confirm**

## Naming Convention

The plugin names child groups based on their depth relative to the selected root group:

| Depth | Naming Pattern | Example |
|---|---|---|
| 1st level | `base` + number | `arm1`, `arm2`, `arm3` |
| 2nd level | parent name + `_` + number | `arm2_1`, `arm2_2` |
| 3rd level | parent name + `_` + number | `arm2_2_1`, `arm2_2_2` |
| ... | continues recursively | ... |

## Options

- **Base Name** — The prefix used for naming. Defaults to the selected group's current name.
- **Rename Scope** — Choose between renaming all descendant groups recursively, or only the direct children of the selected group.
- **Also Rename Root Group** — When enabled, the selected root group itself will also be renamed to the base name you entered.

## Example

Given this group hierarchy:

```
body
├── group_a
│   ├── some_group
│   └── another_group
├── group_b
└── group_c
    └── inner
```

After running the plugin on `body` with base name `body`:

```
body
├── body1
│   ├── body1_1
│   └── body1_2
├── body2
└── body3
    └── body3_1
```

All rename operations are registered as a single undo step, so you can revert with **Ctrl+Z**.