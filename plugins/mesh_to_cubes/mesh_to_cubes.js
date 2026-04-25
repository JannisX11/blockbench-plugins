(function ()
{

    let voxel_action;

    Plugin.register('mesh_to_cubes', {
        title: 'Mesh to Cubes',
        author: 'Eleeter',
        description: 'Converts a selected mesh into cubes that approximate its shape using voxelization.',
        version: '1.0.1',
        variant: 'desktop',
        min_version: '4.9.0',
        tags: ['Modeling', 'Minecraft: Java Edition'],

        onload()
        {

            voxel_action = new Action('convert_mesh_to_cubes', {
                name: 'Convert Mesh to Cubes',
                description: 'Voxelizes selected meshes into perfect cubes',
                icon: 'view_in_ar',
                category: 'filter',
                condition: {
                    modes: ['edit'],
                    features: ['meshes'],
                    method: () => Mesh.hasSelected()
                },
                click()
                {
                    openVoxelizerSettings();
                }
            });

            MenuBar.addAction(voxel_action, 'filter');
        },

        onunload()
        {
            if (voxel_action)
            {
                voxel_action.delete();
            }
        }
    });


    function openVoxelizerSettings()
    {
        let settings_dialog = new Dialog({
            id: 'mesh_to_cubes_dialog',
            title: 'Voxelization Settings',
            form: {
                voxel_size: {
                    label: 'Voxel Size',
                    type: 'number',
                    value: 1,
                    min: 0.1,
                    step: 0.1
                },
                surface_only: {
                    label: 'Surface Only',
                    type: 'checkbox',
                    value: false
                },
                remove_original: {
                    label: 'Remove Original Mesh',
                    type: 'checkbox',
                    value: true
                }
            },
            onConfirm(results)
            {
                performVoxelization(results);
            }
        });
        settings_dialog.show();
    }


    async function performVoxelization(options)
    {
        let selected_meshes = Mesh.selected.slice();
        if (selected_meshes.length === 0) return;

        let cube_size = options.voxel_size || 1;
        let use_surface_only = !!options.surface_only;
        let delete_source = options.remove_original !== false;

        let generated_cubes = [];
        let is_cancelled = false;

        let progress_ui = new Dialog('voxelizer_progress', {
            title: 'Converting Mesh...',
            cancel_on_click_outside: false,
            progress_bar: {},
            buttons: ['dialog.cancel'],
            onCancel()
            {
                is_cancelled = true;
                Blockbench.setProgress();
            }
        });
        progress_ui.show();

        async function updateProgress(ratio)
        {
            Blockbench.setProgress(ratio);
            if (progress_ui.progress_bar)
            {
                progress_ui.progress_bar.setProgress(ratio ?? 0);
            }
            await new Promise(resolve => setTimeout(resolve, 1));
        }

        let edit_elements = selected_meshes.slice();
        Undo.initEdit({elements: edit_elements, outliner: true, selection: true});

        for (let mesh_idx = 0; mesh_idx < selected_meshes.length; mesh_idx++)
        {
            if (is_cancelled) break;

            let mesh = selected_meshes[mesh_idx];
            let parent_group = mesh.parent;
            let pivot = mesh.origin.slice();

            let triangles = getMeshTriangles(mesh);
            if (triangles.length === 0) continue;

            let world_bounds = getTriangleBounds(triangles);

            let voxel_coords = await computeVoxelsAsync(world_bounds, cube_size, triangles, use_surface_only, async (percent) =>
            {
                await updateProgress(percent * 0.6);
                return !is_cancelled;
            });

            if (is_cancelled) break;

            await updateProgress(0.8);

            let target_texture = getMeshTexture(mesh);

            let voxel_count = voxel_coords.length;
            for (let i = 0; i < voxel_count; i++)
            {
                if (is_cancelled) break;

                let pos = voxel_coords[i];
                let cube_config = {
                    name: 'voxel',
                    from: [pos[0], pos[1], pos[2]],
                    to: [pos[0] + cube_size, pos[1] + cube_size, pos[2] + cube_size],
                    origin: pivot.slice()
                };

                if (target_texture)
                {
                    cube_config.faces = {
                        north: {texture: target_texture},
                        east: {texture: target_texture},
                        south: {texture: target_texture},
                        west: {texture: target_texture},
                        up: {texture: target_texture},
                        down: {texture: target_texture}
                    };
                }

                let cube = new Cube(cube_config).addTo(parent_group).init();
                generated_cubes.push(cube);

                if (i % 250 === 0 && i > 0)
                {
                    await updateProgress(0.8 + 0.2 * (i / voxel_count));
                }
            }

            if (!is_cancelled && delete_source)
            {
                mesh.remove();
            }
        }

        if (is_cancelled)
        {
            Undo.cancelEdit();
            progress_ui.close();
            Blockbench.setProgress();
            return;
        }

        await updateProgress(1);

        edit_elements.push(...generated_cubes);
        Undo.finishEdit('Voxelized mesh to cubes');

        if (generated_cubes.length > 0)
        {
            unselectAllElements();
            generated_cubes.forEach(cube =>
            {
                cube.selected = true;
                Project.selected_elements.safePush(cube);
            });
        }

        Canvas.updateAll();
        updateInterfacePanels();

        progress_ui.close();
        Blockbench.setProgress();

        Blockbench.showQuickMessage(`Successfully created ${generated_cubes.length} cubes`, 2000);
    }



    function getMeshTriangles(mesh)
    {
        let triangles = [];
        let vertices = mesh.vertices;
        let mesh_origin = mesh.origin;

        for (let face_id in mesh.faces)
        {
            let face = mesh.faces[face_id];
            let face_verts = face.vertices;
            if (!face_verts || face_verts.length < 3) continue;

            let points = face_verts.map(v_id =>
            {
                let v = vertices[v_id];
                return v ? [v[0] + mesh_origin[0], v[1] + mesh_origin[1], v[2] + mesh_origin[2]] : null;
            }).filter(p => p !== null);

            if (points.length < 3) continue;

            for (let i = 1; i < points.length - 1; i++)
            {
                triangles.push([
                    points[0],
                    points[i],
                    points[i + 1]
                ]);
            }
        }
        return triangles;
    }


    function getTriangleBounds(triangles)
    {
        let min_p = [Infinity, Infinity, Infinity];
        let max_p = [-Infinity, -Infinity, -Infinity];

        for (let t = 0; t < triangles.length; t++)
        {
            let tri = triangles[t];
            for (let v = 0; v < 3; v++)
            {
                let p = tri[v];
                for (let axis = 0; axis < 3; axis++)
                {
                    if (p[axis] < min_p[axis]) min_p[axis] = p[axis];
                    if (p[axis] > max_p[axis]) max_p[axis] = p[axis];
                }
            }
        }
        return {min: min_p, max: max_p};
    }



    async function computeVoxelsAsync(bounds, step_size, triangles, surface_only_mode, progress_hook)
    {
        let voxels = [];
        let precision_eps = step_size * 0.01;

        let grid_min = [
            Math.floor(bounds.min[0] / step_size) * step_size - (step_size * 2),
            Math.floor(bounds.min[1] / step_size) * step_size - (step_size * 2),
            Math.floor(bounds.min[2] / step_size) * step_size - (step_size * 2)
        ];
        let grid_max = [
            Math.ceil(bounds.max[0] / step_size) * step_size + (step_size * 2),
            Math.ceil(bounds.max[1] / step_size) * step_size + (step_size * 2),
            Math.ceil(bounds.max[2] / step_size) * step_size + (step_size * 2)
        ];

        let h_size = step_size / 2;
        let count_x = Math.round((grid_max[0] - grid_min[0]) / step_size);
        let count_y = Math.round((grid_max[1] - grid_min[1]) / step_size);
        let count_z = Math.round((grid_max[2] - grid_min[2]) / step_size);

        if (count_x * count_y * count_z > 500000)
        {
            Blockbench.showQuickMessage('Grid resolution too high. Try a larger voxel size.', 3000);
            return [];
        }

        let tri_aabbs = triangles.map(tri =>
        {
            return {
                min: [
                    Math.min(tri[0][0], tri[1][0], tri[2][0]) - precision_eps,
                    Math.min(tri[0][1], tri[1][1], tri[2][1]) - precision_eps,
                    Math.min(tri[0][2], tri[1][2], tri[2][2]) - precision_eps
                ],
                max: [
                    Math.max(tri[0][0], tri[1][0], tri[2][0]) + precision_eps,
                    Math.max(tri[0][1], tri[1][1], tri[2][1]) + precision_eps,
                    Math.max(tri[0][2], tri[1][2], tri[2][2]) + precision_eps
                ]
            };
        });

        let surface_mask = {};

        for (let gx = 0; gx < count_x; gx++)
        {
            if (gx % 5 === 0 && progress_hook)
            {
                let should_continue = await progress_hook(gx / count_x);
                if (!should_continue) return voxels;
            }

            for (let gy = 0; gy < count_y; gy++)
            {
                for (let gz = 0; gz < count_z; gz++)
                {
                    let bx = grid_min[0] + gx * step_size;
                    let by = grid_min[1] + gy * step_size;
                    let bz = grid_min[2] + gz * step_size;

                    let b_min = [bx - precision_eps, by - precision_eps, bz - precision_eps];
                    let b_max = [bx + step_size + precision_eps, by + step_size + precision_eps, bz + step_size + precision_eps];
                    let b_mid = [bx + h_size, by + h_size, bz + h_size];
                    let b_ext = [h_size + precision_eps, h_size + precision_eps, h_size + precision_eps];

                    let hit = false;
                    for (let t = 0; t < triangles.length; t++)
                    {
                        let t_bounds = tri_aabbs[t];

                        if (t_bounds.max[0] < b_min[0] || t_bounds.min[0] > b_max[0] ||
                            t_bounds.max[1] < b_min[1] || t_bounds.min[1] > b_max[1] ||
                            t_bounds.max[2] < b_min[2] || t_bounds.min[2] > b_max[2])
                        {
                            continue;
                        }

                        let tri = triangles[t];

                        if (checkPointInBox(tri[0], b_min, b_max) ||
                            checkPointInBox(tri[1], b_min, b_max) ||
                            checkPointInBox(tri[2], b_min, b_max))
                        {
                            hit = true;
                            break;
                        }

                        if (checkPointInTrianglePrism(b_mid, tri, b_ext[1]))
                        {
                            hit = true;
                            break;
                        }

                        if (testTriangleCollision(b_mid, b_ext, tri, precision_eps))
                        {
                            hit = true;
                            break;
                        }

                        if (checkEdgeIntersection(tri[0], tri[1], b_min, b_max) ||
                            checkEdgeIntersection(tri[1], tri[2], b_min, b_max) ||
                            checkEdgeIntersection(tri[2], tri[0], b_min, b_max))
                        {
                            hit = true;
                            break;
                        }
                    }

                    if (hit)
                    {
                        let cell_key = gx + ',' + gy + ',' + gz;
                        surface_mask[cell_key] = true;
                        voxels.push([bx, by, bz]);
                    }
                }
            }
        }

        if (!surface_only_mode && voxels.length > 0)
        {
            let interior_keys = findInteriorVoxels(count_x, count_y, count_z, surface_mask, grid_min, step_size, triangles);
            interior_keys.forEach(key =>
            {
                let coords = key.split(',').map(Number);
                voxels.push([
                    grid_min[0] + coords[0] * step_size,
                    grid_min[1] + coords[1] * step_size,
                    grid_min[2] + coords[2] * step_size
                ]);
            });
        }

        return voxels;
    }



    function checkPointInBox(p, b_min, b_max)
    {
        return p[0] >= b_min[0] && p[0] <= b_max[0] &&
            p[1] >= b_min[1] && p[1] <= b_max[1] &&
            p[2] >= b_min[2] && p[2] <= b_max[2];
    }


    function checkPointInTrianglePrism(pt, tri, vertical_tolerance)
    {
        let v0 = tri[0], v1 = tri[1], v2 = tri[2];

        let edge1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
        let edge2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];
        let normal = calculateCrossProduct(edge1, edge2);

        let mag = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
        if (mag < 1e-10) return false;

        normal[0] /= mag;
        normal[1] /= mag;
        normal[2] /= mag;

        let dist = (pt[0] - v0[0]) * normal[0] + (pt[1] - v0[1]) * normal[1] + (pt[2] - v0[2]) * normal[2];
        if (Math.abs(dist) > vertical_tolerance) return false;

        let projected = [pt[0] - dist * normal[0], pt[1] - dist * normal[1], pt[2] - dist * normal[2]];
        return checkPointInTriangle(projected, v0, v1, v2);
    }


    function checkPointInTriangle(p, a, b, c)
    {
        let v0 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
        let v1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
        let v2 = [p[0] - a[0], p[1] - a[1], p[2] - a[2]];

        let dot00 = v0[0] * v0[0] + v0[1] * v0[1] + v0[2] * v0[2];
        let dot01 = v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2];
        let dot02 = v0[0] * v2[0] + v0[1] * v2[1] + v0[2] * v2[2];
        let dot11 = v1[0] * v1[0] + v1[1] * v1[1] + v1[2] * v1[2];
        let dot12 = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];

        let inv_denom = 1 / (dot00 * dot11 - dot01 * dot01);
        if (!isFinite(inv_denom)) return false;

        let u = (dot11 * dot02 - dot01 * dot12) * inv_denom;
        let v = (dot00 * dot12 - dot01 * dot02) * inv_denom;

        return (u >= -0.001) && (v >= -0.001) && (u + v <= 1.001);
    }


    function checkEdgeIntersection(p0, p1, b_min, b_max)
    {
        let ray_dir = [p1[0] - p0[0], p1[1] - p0[1], p1[2] - p0[2]];
        let t_min = 0, t_max = 1;

        for (let i = 0; i < 3; i++)
        {
            if (Math.abs(ray_dir[i]) < 1e-12)
            {
                if (p0[i] < b_min[i] || p0[i] > b_max[i]) return false;
            } else
            {
                let inv_d = 1.0 / ray_dir[i];
                let t1 = (b_min[i] - p0[i]) * inv_d;
                let t2 = (b_max[i] - p0[i]) * inv_d;
                if (t1 > t2)
                {
                    let swap = t1;
                    t1 = t2;
                    t2 = swap;
                }
                t_min = Math.max(t_min, t1);
                t_max = Math.min(t_max, t2);
                if (t_min > t_max) return false;
            }
        }
        return true;
    }

    function findInteriorVoxels(nx, ny, nz, surface_mask, start_pos, v_size, triangle_set)
    {
        let exterior_map = {};
        let search_queue = [];

        for (let x = 0; x < nx; x++)
        {
            for (let y = 0; y < ny; y++)
            {
                for (let z = 0; z < nz; z++)
                {
                    if (x === 0 || x === nx - 1 || y === 0 || y === ny - 1 || z === 0 || z === nz - 1)
                    {
                        let key = x + ',' + y + ',' + z;
                        if (!surface_mask[key] && !exterior_map[key])
                        {
                            exterior_map[key] = true;
                            search_queue.push([x, y, z]);
                        }
                    }
                }
            }
        }

        let neighbors = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]];
        while (search_queue.length > 0)
        {
            let [cx, cy, cz] = search_queue.shift();
            for (let i = 0; i < 6; i++)
            {
                let nx_pos = cx + neighbors[i][0];
                let ny_pos = cy + neighbors[i][1];
                let nz_pos = cz + neighbors[i][2];

                if (nx_pos < 0 || nx_pos >= nx || ny_pos < 0 || ny_pos >= ny || nz_pos < 0 || nz_pos >= nz) continue;

                let n_key = nx_pos + ',' + ny_pos + ',' + nz_pos;
                if (!surface_mask[n_key] && !exterior_map[n_key])
                {
                    exterior_map[n_key] = true;
                    search_queue.push([nx_pos, ny_pos, nz_pos]);
                }
            }
        }

        let interior_points = [];
        let half_voxel = v_size / 2;

        for (let x = 0; x < nx; x++)
        {
            for (let y = 0; y < ny; y++)
            {
                for (let z = 0; z < nz; z++)
                {
                    let key = x + ',' + y + ',' + z;
                    if (surface_mask[key] || exterior_map[key]) continue;

                    let world_x = start_pos[0] + x * v_size + half_voxel;
                    let world_y = start_pos[1] + y * v_size + half_voxel;
                    let world_z = start_pos[2] + z * v_size + half_voxel;

                    if (isPointEnclosed(world_x, world_y, world_z, triangle_set))
                    {
                        interior_points.push(key);
                    }
                }
            }
        }

        return interior_points;
    }


    function isPointEnclosed(px, py, pz, triangles)
    {
        let total_crossings = 0;
        for (let i = 0; i < triangles.length; i++)
        {
            if (testRayIntersection(px, py, pz, triangles[i]))
            {
                total_crossings++;
            }
        }
        return (total_crossings % 2) === 1;
    }


    function testRayIntersection(px, py, pz, tri)
    {
        let v0 = tri[0], v1 = tri[1], v2 = tri[2];

        let edge1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
        let edge2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];

        let h_vec = [0, -edge2[2], edge2[1]];
        let det = edge1[0] * h_vec[0] + edge1[1] * h_vec[1] + edge1[2] * h_vec[2];

        if (det > -1e-10 && det < 1e-10) return false;

        let inv_det = 1.0 / det;
        let s_vec = [px - v0[0], py - v0[1], pz - v0[2]];
        let u_param = inv_det * (s_vec[0] * h_vec[0] + s_vec[1] * h_vec[1] + s_vec[2] * h_vec[2]);

        if (u_param < 0.0 || u_param > 1.0) return false;

        let q_vec = [
            s_vec[1] * edge1[2] - s_vec[2] * edge1[1],
            s_vec[2] * edge1[0] - s_vec[0] * edge1[2],
            s_vec[0] * edge1[1] - s_vec[1] * edge1[0]
        ];

        let v_param = inv_det * q_vec[0];
        if (v_param < 0.0 || u_param + v_param > 1.0) return false;

        let dist_t = inv_det * (edge2[0] * q_vec[0] + edge2[1] * q_vec[1] + edge2[2] * q_vec[2]);
        return dist_t > 1e-10;
    }



    function testTriangleCollision(box_mid, box_ext, tri, tolerance)
    {
        let v0 = [tri[0][0] - box_mid[0], tri[0][1] - box_mid[1], tri[0][2] - box_mid[2]];
        let v1 = [tri[1][0] - box_mid[0], tri[1][1] - box_mid[1], tri[1][2] - box_mid[2]];
        let v2 = [tri[2][0] - box_mid[0], tri[2][1] - box_mid[1], tri[2][2] - box_mid[2]];

        let edges = [
            [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]],
            [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]],
            [v0[0] - v2[0], v0[1] - v2[1], v0[2] - v2[2]]
        ];

        for (let i = 0; i < 3; i++)
        {
            for (let j = 0; j < 3; j++)
            {
                let axis = [0, 0, 0];
                if (j === 0) axis = [0, -edges[i][2], edges[i][1]];
                else if (j === 1) axis = [edges[i][2], 0, -edges[i][0]];
                else axis = [-edges[i][1], edges[i][0], 0];

                let len_sq = axis[0] * axis[0] + axis[1] * axis[1] + axis[2] * axis[2];
                if (len_sq < 1e-12) continue;

                let p0 = v0[0] * axis[0] + v0[1] * axis[1] + v0[2] * axis[2];
                let p1 = v1[0] * axis[0] + v1[1] * axis[1] + v1[2] * axis[2];
                let p2 = v2[0] * axis[0] + v2[1] * axis[1] + v2[2] * axis[2];

                let radius = box_ext[0] * Math.abs(axis[0]) + box_ext[1] * Math.abs(axis[1]) + box_ext[2] * Math.abs(axis[2]) + tolerance;
                let min_p = Math.min(p0, p1, p2);
                let max_p = Math.max(p0, p1, p2);

                if (min_p > radius || max_p < -radius) return false;
            }
        }

        for (let i = 0; i < 3; i++)
        {
            let min_v = Math.min(v0[i], v1[i], v2[i]);
            let max_v = Math.max(v0[i], v1[i], v2[i]);
            if (min_v > (box_ext[i] + tolerance) || max_v < -(box_ext[i] + tolerance)) return false;
        }

        let face_normal = calculateCrossProduct(edges[0], edges[1]);
        let plane_d = -(face_normal[0] * v0[0] + face_normal[1] * v0[1] + face_normal[2] * v0[2]);
        let plane_radius = box_ext[0] * Math.abs(face_normal[0]) + box_ext[1] * Math.abs(face_normal[1]) + box_ext[2] * Math.abs(face_normal[2]) + tolerance;

        if (Math.abs(plane_d) > plane_radius) return false;

        return true;
    }


    function calculateCrossProduct(a, b)
    {
        return [
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0]
        ];
    }


    function getMeshTexture(mesh)
    {
        for (let id in mesh.faces)
        {
            let f = mesh.faces[id];
            if (f.texture) return f.texture;
        }
        return null;
    }

})();
