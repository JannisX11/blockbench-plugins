<div class="mtools_private">
	<style>
		.mtools_private td:nth-child(2) {
			padding-left: 20px;
		}
		.mtools_private summary {
			color: var(--color-subtle_text);
		}
		.mtools_private details[open] summary {
			color: white;
		}
		.mtools_private summary::before {
			content: 'chevron_right';
			font-family: Material Icons;
		}
		.mtools_private details[open] summary::before {
			content: 'expand_more';
		}
	</style>
	<details>
		<summary>Modeling Tools</summary>
		<table>
			<caption class='small_text subtle'>
				Accessed from the mesh menu. For applying modifications on selected vertices, edges or faces
			</caption>
			<tr>
				<td>To Sphere</td>
				<td>Casts selected vertices into a sphere based on an influence</td>
			</tr>
			<tr>
				<td>Laplacian Smooth</td>
				<td>Smoothens selected vertices by averaging the position of neighboring vertices</td>
			</tr>
			<tr></tr>
			<tr>
				<td>Poke Faces</td>
				<td> Creates a Fan out of selected faces</td>
			</tr>
			<tr>
				<td>Triangles To Quads</td>
				<td> Trys to dissolve adjacent triangles into a quad</td>
			</tr>
			<tr>
				<td>Triangulate Faces</td>
				<td> Cuts a face into triangles</td>
			</tr>
			<tr>
				<td>Project From View</td>
				<td> Creates a UV map based on the vertices' position on the screen from the camera</td>
			</tr>
			<tr>
				<td>Cubic Projection</td>
				<td> Creates a UV map based on the sides of a cube</td>
			</tr>
		</table>
	</details>
	<details>
		<summary>Modeling Operators</summary>
		<table>
			<caption class='small_text subtle'>Accessed from the mesh menu. For applying modifications on selected
				meshes</caption>
			<tr>
				<td>Subdivide</td>
				<td> Splits the faces of a mesh into smaller faces, giving it a smooth appearance</td>
			</tr>
			<tr>
				<td>Split Edges</td>
				<td> Splits and duplicates edges within a mesh, breaking 'links' between faces around those split edges
				</td>
			</tr>
			<tr>
				<td>Scatter</td>
				<td> Scatters selected meshes on the active mesh</t<d>
			</tr>
			<tr>
				<td>Array</td>
				<td> Creates an array of copies of the base object, with each copy being offset from the previous one
				</td>
			</tr>
		</table>
	</details>
	<details>
		<summary>Mesh Generators</summary>
		<table>
			<caption class='small_text subtle'>Accessed from the tool menu. For procedural mesh generation</caption>
			<tr>
				<td>Terrain</td>
				<td> Generates Terrains procedurally with fully customized settings</td>
			</tr>
			<tr>
				<td>Text Mesh</td>
				<td> Generate a mesh representation of a text with Opentype Fonts and custom settings.<br><i>An
						OpenTypeFont is a format for scalable computer fonts that are stored in JSON files, a good
						converter is <a href="http://gero3.github.io/facetype.js/">gero3.github.io/facetype.js</a></i>
				</td>
			</tr>
			<tr>
				<td>XYZ Math Surface Function</td>
				<td> Creates an xyz surface based on given inputs containing 23 already-made presets!</td>
			</tr>
			<tr>
				<td>Polyhedron Primitive</td>
				<td> Generate the basic 4 regular polyhedron with custom detail</td>
			</tr>
			<tr>
				<td>Torus Knot Primitive</td>
				<td>Generates a p-q torus knot with custom settings</td>
			</tr>
		</table>
	</details>
</div>
