import numpy as np
import trimesh


def make_strut(p1, p2, radius=0.025, color=(190, 195, 200, 255)):
    """Creates a cylindrical strut connecting two 3D points."""
    p1 = np.array(p1, dtype=float)
    p2 = np.array(p2, dtype=float)
    vec = p2 - p1
    length = np.linalg.norm(vec)
    if length < 1e-6:
        return None
    cyl = trimesh.creation.cylinder(radius=radius, height=length, sections=12)
    z_axis = np.array([0.0, 0.0, 1.0])
    direction = vec / length
    rot_matrix = trimesh.geometry.align_vectors(z_axis, direction)
    cyl.apply_transform(rot_matrix)
    cyl.apply_translation((p1 + p2) / 2.0)
    cyl.visual.vertex_colors = color
    return cyl


def make_box(extents, center, rot_euler=(0, 0, 0), color=(220, 220, 220, 255)):
    """Creates a positioned and rotated box."""
    box = trimesh.creation.box(extents=extents)
    if any(rot_euler):
        mat = trimesh.transformations.euler_matrix(*rot_euler)
        box.apply_transform(mat)
    box.apply_translation(center)
    box.visual.vertex_colors = color
    return box


def build_surveyor_3():
    scene = trimesh.Scene()

    # Colors (RGBA)
    alu_silver = (195, 200, 205, 255)
    gold_foil = (218, 175, 55, 255)
    white_paint = (240, 240, 240, 255)
    solar_blue = (25, 55, 115, 255)
    pad_bronze = (160, 130, 95, 255)
    dark_metal = (60, 65, 70, 255)

    # 1. Central Triangular Spaceframe (Y-up coordinate system)
    r_inner = 0.55
    y_bot = 0.65
    y_top = 1.25
    angles = [np.deg2rad(90), np.deg2rad(210), np.deg2rad(330)]

    bot_verts = [
        np.array([r_inner * np.cos(a), y_bot, r_inner * np.sin(a)])
        for a in angles
    ]
    top_verts = [
        np.array([r_inner * 0.85 * np.cos(a), y_top, r_inner * 0.85 * np.sin(a)])
        for a in angles
    ]

    for i in range(3):
        nxt = (i + 1) % 3
        scene.add_geometry(make_strut(bot_verts[i], bot_verts[nxt], 0.025, alu_silver))
        scene.add_geometry(make_strut(top_verts[i], top_verts[nxt], 0.025, alu_silver))
        scene.add_geometry(make_strut(bot_verts[i], top_verts[i], 0.025, alu_silver))
        scene.add_geometry(make_strut(bot_verts[i], top_verts[nxt], 0.018, alu_silver))

    # 2. Three Landing Legs & Crushable Honeycomb Footpads
    for i, a in enumerate(angles):
        foot_pos = np.array([1.45 * np.cos(a), 0.06, 1.45 * np.sin(a)])
        knee_pos = np.array([1.15 * np.cos(a), 0.55, 1.15 * np.sin(a)])

        # Main leg struts & shock absorber
        scene.add_geometry(make_strut(bot_verts[i], knee_pos, 0.028, alu_silver))
        scene.add_geometry(make_strut(top_verts[i], knee_pos, 0.022, white_paint))
        scene.add_geometry(make_strut(knee_pos, foot_pos, 0.026, alu_silver))

        # Footpad (rotated cylinder so flat face is on Y=0)
        pad = trimesh.creation.cylinder(radius=0.16, height=0.08, sections=16)
        pad.apply_transform(trimesh.transformations.rotation_matrix(np.pi / 2, [1, 0, 0]))
        pad.apply_translation(foot_pos)
        pad.visual.vertex_colors = pad_bronze
        scene.add_geometry(pad)

    # 3. Thermal Compartments (Electronics & Battery Boxes)
    scene.add_geometry(
        make_box([0.38, 0.42, 0.32], [0.22, 0.92, 0.15], (0, 0.4, 0), gold_foil)
    )
    scene.add_geometry(
        make_box([0.34, 0.38, 0.30], [-0.24, 0.90, 0.12], (0, -0.5, 0), white_paint)
    )

    # Central Retro-Rocket Engine Nozzle (underneath)
    nozzle = trimesh.creation.cone(radius=0.22, height=0.35, sections=20)
    nozzle.apply_transform(trimesh.transformations.rotation_matrix(-np.pi / 2, [1, 0, 0]))
    nozzle.apply_translation([0, 0.48, 0])
    nozzle.visual.vertex_colors = dark_metal
    scene.add_geometry(nozzle)

    # 4. Central Vertical Mast, Solar Panel & High-Gain Antenna
    mast_base = np.array([0.0, y_top, 0.0])
    mast_top = np.array([0.0, 2.55, 0.0])
    scene.add_geometry(make_strut(mast_base, mast_top, 0.035, alu_silver))

    # Top Solar Panel
    scene.add_geometry(
        make_box([0.85, 0.03, 0.55], [0.0, 2.62, 0.0], (0.25, 0.2, 0.15), solar_blue)
    )

    # Planar High-Gain Antenna Array
    scene.add_geometry(
        make_box([0.65, 0.65, 0.04], [0.0, 2.05, 0.22], (-0.35, 0.0, 0.0), white_paint)
    )

    # Two Omnidirectional Antenna Booms
    scene.add_geometry(make_strut([0, 1.5, 0], [1.1, 2.1, -0.5], 0.012, alu_silver))
    scene.add_geometry(make_strut([0, 1.5, 0], [-1.1, 2.1, -0.5], 0.012, alu_silver))

    # 5. Survey Television Camera Turret
    cam_body = trimesh.creation.cylinder(radius=0.09, height=0.55, sections=16)
    cam_body.apply_transform(trimesh.transformations.rotation_matrix(np.pi / 2, [1, 0, 0]))
    cam_body.apply_translation([-0.15, 1.48, -0.22])
    cam_body.visual.vertex_colors = white_paint
    scene.add_geometry(cam_body)

    # Camera Mirror Hood
    scene.add_geometry(
        make_box([0.18, 0.18, 0.18], [-0.15, 1.80, -0.22], (0.2, 0.3, 0), white_paint)
    )

    # 6. Soil Mechanics Surface Sampler (Accordion Pantograph Arm + Scoop)
    arm_origin = np.array([0.35, 0.95, -0.35])
    arm_dir = np.array([0.75, -0.35, -0.65])
    arm_dir = arm_dir / np.linalg.norm(arm_dir)

    # Accordion scissor segments
    num_links = 5
    step_len = 0.18
    for k in range(num_links):
        p_start = arm_origin + arm_dir * (k * step_len)
        p_end = arm_origin + arm_dir * ((k + 1) * step_len)
        offset = np.array([0.0, 0.07, 0.0])
        scene.add_geometry(make_strut(p_start + offset, p_end - offset, 0.01, alu_silver))
        scene.add_geometry(make_strut(p_start - offset, p_end + offset, 0.01, alu_silver))

    # Metal Soil Scoop at the tip
    tip_pos = arm_origin + arm_dir * (num_links * step_len + 0.08)
    scene.add_geometry(
        make_box([0.12, 0.08, 0.16], tip_pos, (0.3, -0.6, 0.0), dark_metal)
    )

    # Export as binary GLB
    output_file = "surveyor_3.glb"
    scene.export(output_file)
    print(f"Successfully exported {output_file}")


if __name__ == "__main__":
    build_surveyor_3()
