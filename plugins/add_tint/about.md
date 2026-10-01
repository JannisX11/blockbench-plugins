# addTint

## English

Batch-edit Tint Indices on Minecraft Java model faces, preview their colors in Blockbench's 3D view, and prepare textures for tinting.

Blockbench already supports arbitrary numeric Tint Indices in the UV Editor's **Face Properties** view. addTint complements this with convenient editing across selected faces, per-index color previews, and grayscale conversion.

### Features

- Set or remove any `tintindex` on selected faces
- Edit preview colors for each Tint Index in real time
- Preview the texture multiplied by its tint color
- Convert only selected face UV areas to tint-friendly grayscale
- Access tools from the UV Editor context menu and the Filter menu
- Undo and Redo support

Preview colors are used only inside Blockbench. Only the standard `tintindex` is written to the Minecraft model JSON.

### Usage

Open a Minecraft Java model and select a Cube and its faces in the UV Editor. Use **addTint: Tint Index** in the UV Editor context menu to assign or remove an index or edit preview colors. The **Filter** menu provides **addTint: Set Tint Index**, **addTint: Edit Preview Colors**, and **addTint: Grayscale Tint Textures**.

### Author

<a href="https://x.com/yohemal" title="Open @yohemal on X" style="display:inline-flex;align-items:center;gap:8px;padding:8px 13px;border-radius:8px;background:#000;color:#fff;text-decoration:none;font-weight:600"><span aria-hidden="true" style="font-size:20px;line-height:1">&#120143;</span><span>@yohemal</span></a>

---

## 日本語

Minecraft Javaモデルの面のTint Indexを一括編集し、Blockbenchの3Dビューで色をプレビューしたり、Tint用のテクスチャを準備したりできるプラグインです。

Blockbenchの標準機能でも、UV Editorの **Face Properties** から任意の数値のTint Indexを設定できます。addTintは、複数の選択面への一括設定、Indexごとの色プレビュー、グレースケール変換を補助します。

### 主な機能

- 選択面へ任意の `tintindex` を設定・削除
- Tint Indexごとのプレビュー色をリアルタイム編集
- テクスチャとTint色を乗算したプレビュー
- 選択面のUV領域だけをTint向けにグレースケール化
- UV Editorの右クリックメニューとFilterメニューから操作
- Undo / Redo対応

プレビュー色はBlockbench内だけで使用されます。MinecraftモデルJSONには標準の `tintindex` のみが出力されます。

### 使い方

Minecraft Javaモデルを開き、CubeとUV Editor上の面を選択します。UV Editorの右クリックメニューの **addTint: Tint Index** からIndexの設定・削除やプレビュー色の編集ができます。**Filter** メニューには **addTint: Tint Indexを設定**、**addTint: プレビュー色を編集**、**addTint: Tintテクスチャをグレースケール化** があります。

### 作者

<a href="https://x.com/yohemal" title="Xで@yohemalを開く" style="display:inline-flex;align-items:center;gap:8px;padding:8px 13px;border-radius:8px;background:#000;color:#fff;text-decoration:none;font-weight:600"><span aria-hidden="true" style="font-size:20px;line-height:1">&#120143;</span><span>@yohemal</span></a>
