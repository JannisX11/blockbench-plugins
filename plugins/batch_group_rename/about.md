Batch rename child groups under a selected group with an Aseprite-style naming template.

Instead of only applying one fixed numbering pattern, this plugin lets you build names from tokens such as `{base}`, `{old}`, `{parent}`, `{index}`, and `{tree}`. This keeps the original quick hierarchy renaming workflow while allowing much more custom naming rules.

## How to Use

1. Select a group in the **Outliner**.
2. Go to **Tools > Batch Rename Child Groups**, or right-click the group and select **Batch Rename Child Groups**.
3. Pick a naming preset, or choose **Custom Template**.
4. Adjust targeting, numbering, text processing, animation syncing, and safety options as needed.
5. Review the live preview in the same dialog.
6. Uncheck any preview rows that should keep their current group name, then apply the rename.

## Template Naming

The default template is:

```text
{base}{tree}
```

With base name `arm`, this keeps the original behavior:

```text
arm1
arm2
arm2_1
arm2_2
arm2_2_1
```

This approach is inspired by Aseprite's filename-format style, where the final name is composed from a format string and tokens. For group names, the useful tokens are about hierarchy, old names, parent names, and sibling indexes.

## Tokens

| Token | Meaning | Example |
|---|---|---|
| `{base}` | The Base Name field | `arm` |
| `{old}` | The group's current name before renaming | `left_upper` |
| `{parent}` | The parent group's new name when available | `arm2` |
| `{parent_old}` | The parent group's original name | `group_b` |
| `{index}` | Sibling index using Index Start and Index Padding | `1`, `01`, `002` |
| `{raw_index}` | Sibling index without padding | `1` |
| `{zero_index}` | Zero-based sibling index using padding | `0`, `01` |
| `{tree}` | Full hierarchical index path | `2_1`, `02_01` |
| `{depth}` | Depth below the selected root group | `1`, `2`, `3` |
| `{path}` | Original path below the selected root group | `group_b/inner` |
| `{count}` | Number of sibling groups at the same level | `3` |
| `{root}` | The selected root group's original name | `body` |

Unknown tokens are left unchanged, so a typo is easy to spot in the preview.

## Useful Templates

| Goal | Template | Result Example |
|---|---|---|
| Original hierarchy numbering | `{base}{tree}` | `body1`, `body2_1` |
| Parent-based hierarchy naming | `{parent}_{index}` | `body_1`, `body_1_1` |
| Preserve old names with a prefix | `{base}_{old}` | `armor_left_arm` |
| Add depth to every group | `{base}_d{depth}_{index}` | `body_d2_1` |
| Use original path as a name source | `{base}_{path}` | `body_group_b/inner` |
| Simple copy suffix | `{old}_copy` | `left_arm_copy` |

## Dialog Layout

The rename dialog is organized into several sections:

- **Naming rule** - Choose a preset or custom token template.
- **Targeting** - Decide which groups inside the selected root should be renamed.
- **Numbering** - Control index order, starting number, padding, and tree separators.
- **Text processing** - Apply find/replace and final case conversion.
- **Safety** - Handle duplicates, empty results, unchanged names, and root-group renaming.
- **Animation references** - Choose whether matching animation animator names should be updated when a group is renamed.
- **Live preview** - Shows the current rule summary, affected count, skipped count, conflicts, and exact generated names in a selectable tree.

Every control includes a short description in the dialog, so you can see what each option changes without opening this page.

## Presets

| Preset | Template Used | Best For |
|---|---|---|
| Hierarchy Numbering | `{base}{tree}` | Original numbered hierarchy names |
| Parent Name + Index | `{parent}_{index}` | Names that follow the generated parent name |
| Base Name + Old Name | `{base}_{old}` | Keeping recognizable old names with a shared prefix |
| Old Name + Base Name | `{old}_{base}` | Adding a shared suffix/category |
| Find/Replace Existing Names | `{old}` | Cleaning up current names without rebuilding them |
| Custom Template | user-defined | Advanced token-based naming |

## Options

- **Base Name** - Main text used by `{base}`. Defaults to the selected group's current name.
- **Name Template** - A token-based pattern used to generate every renamed child group.
- **Rename Scope** - Rename all descendant groups recursively, or only direct children.
- **Target Groups** - Rename all scoped groups, only groups matching a filter, leaf groups only, or parent groups only.
- **Target Filter** - Matches each group's original name and path. It can be plain text or a regular expression.
- **Max Depth** - Limits how deep below the selected root the rename can apply. `0` means no limit.
- **Index Order** - Assign indexes in Outliner order, reverse order, name A-Z, or name Z-A. This does not reorder the model.
- **Index Start** - First number used for sibling indexes. Use `0` for zero-based numbering.
- **Index Padding** - Adds leading zeroes to `{index}`, `{zero_index}`, and `{tree}`. For example, padding `2` creates `01`, `02`, `01_01`.
- **Tree Separator** - Separator used inside `{tree}`. The default is `_`.
- **Name Transform** - Optionally convert the generated result to lowercase, uppercase, `snake_case`, or `kebab-case`.
- **Find Text / Replace With** - Optional replacement applied after the template is rendered.
- **Find Text Is RegExp** - Treat Find Text as a JavaScript regular expression. Capture groups can be used in Replace With.
- **Case Sensitive Find** - Controls whether find/replace respects letter case.
- **Duplicate Name Handling** - Warn before applying, auto-append a numeric suffix, or skip duplicates.
- **Duplicate Suffix Separator** - Separator used when auto-appending duplicate suffixes, for example `name_2`.
- **Empty Result Handling** - Keep the old name, use Base + Index, or skip the group if a rule produces an empty name.
- **Skip Unchanged Names** - Avoid touching groups whose generated name is identical to the current name.
- **Also Rename Root Group** - Renames the selected root group to the Base Name after the same transform/replacement rules.
- **Also Update Animation Names** - Updates animation animators that refer to renamed groups by UUID or by the old group name. Keep it enabled when animations should continue following the renamed groups; turn it off for model-only cleanup.
- **Require Extra Apply Confirmation** - Shows a final confirmation dialog even when the live preview has no warnings. Duplicate conflicts always request confirmation.

## Live Preview

The preview area updates whenever you change a field. It shows:

- How many groups will be renamed.
- How many groups will be skipped.
- Whether duplicate sibling names would be created.
- The active preset, template, scope, and target mode.
- A tree-style list of the selected group's descendants.
- Each row shows whether that group will be renamed, skipped, or left unchanged.
- Renamed rows show the exact `current_name -> generated_name` result before you apply.
- Every renameable row has a checkbox. Uncheck a row to keep that group unchanged while still allowing other checked groups to rename.
- If a parent group is unchecked, child previews recalculate with the parent's actual kept name, so `{parent}` results stay accurate.
- Large hierarchies are shortened at first and include a **Show more groups** button in the preview.

If the rule creates duplicate sibling names, the preview marks the conflict. You can then switch **Duplicate Name Handling** to auto-append suffixes or skip duplicates before applying.

## Animation Syncing

When **Also Update Animation Names** is enabled, the plugin checks project animations during the same undo step. It updates matching animator names when an animator is tied to the renamed group UUID, the group object, or the old group name.

This is useful when exports or animation tools still read the animator's stored name. The model group rename and animation-name update are committed together, so **Ctrl+Z** reverts both at once.

## Example

Given this group hierarchy:

```text
body
|-- group_a
|   |-- some_group
|   `-- another_group
|-- group_b
`-- group_c
    `-- inner
```

Using base name `body` and template `{base}{tree}`:

```text
body
|-- body1
|   |-- body1_1
|   `-- body1_2
|-- body2
`-- body3
    `-- body3_1
```

Using base name `part`, template `{parent}_{index}`, Index Padding `2`, and recursive scope:

```text
body
|-- body_01
|   |-- body_01_01
|   `-- body_01_02
|-- body_02
`-- body_03
    `-- body_03_01
```

All rename operations are registered as a single undo step, so you can revert the whole batch rename with **Ctrl+Z**.
