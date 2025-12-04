---
sidebar_position: 5
title: 'Robot Description Formats: URDF & SDF'
slug: /chapter-3-digital-twin/robot-description-formats
---
import ChapterTranslator from '@site/src/components/Translation/chapterTranslator';

<ChapterTranslator>

# Robot Description Formats: URDF & SDF

## Introduction

To simulate robots effectively, physics engines and visualization tools need a precise description of the robot's physical properties, kinematic structure, and visual appearance. Two primary XML-based formats are widely used for this purpose in robotics: **URDF** (Unified Robot Description Format) and **SDF** (Simulation Description Format).

## URDF (Unified Robot Description Format)

URDF is an XML format used in ROS to describe all aspects of a robot. It defines:

*   **Links:** The rigid parts of the robot (e.g., body segments, wheels, arms).
*   **Joints:** The connections between links, defining their degrees of freedom (e.g., revolute, prismatic, fixed).
*   **Kinematics:** The tree-like structure of links and joints.
*   **Visual properties:** Colors, textures, meshes for rendering.
*   **Collision properties:** Simplified geometries for collision detection.
*   **Inertial properties:** Mass, center of mass, and inertia tensor for physics simulation.

### URDF Structure Example

```xml
<robot name="my_robot">
  <link name="base_link">
    <visual>
      <geometry>
        <cylinder length="0.6" radius="0.2"/>
      </geometry>
    </visual>
    <collision>
      <geometry>
        <cylinder length="0.6" radius="0.2"/>
      </geometry>
    </collision>
    <inertial>
      <mass value="10"/>
      <inertia ixx="1.0" ixy="0.0" ixz="0.0" iyy="1.0" iyz="0.0" izz="1.0"/>
    </inertial>
  </link>

  <link name="caster_link">
    <!-- ... -->
  </link>

  <joint name="base_to_caster" type="fixed">
    <parent link="base_link"/>
    <child link="caster_link"/>
    <origin xyz="-0.15 0 -0.2" rpy="0 0 0"/>
  </joint>
</robot>
```

## SDF (Simulation Description Format)

SDF is a more comprehensive XML format specifically designed for robot and environment descriptions in Gazebo. It extends URDF's capabilities by allowing:

*   **Nested models:** Hierarchical grouping of links and joints.
*   **Environmental elements:** Terrain, static objects, lights, and sensors that are not part of the robot.
*   **Physics properties:** More detailed specification of friction, damping, and other physical parameters.
*   **Plugins:** Direct integration of Gazebo plugins within the model or world file.

SDF is generally preferred for full Gazebo simulations as it can describe entire scenes, not just individual robots.

### SDF Structure Example

```xml
<?xml version='1.0'?>
<sdf version='1.6'>
  <model name='my_robot'>
    <link name='base_link'>
      <inertial>
        <mass>10.0</mass>
        <inertia>
          <ixx>1.0</ixx><ixy>0.0</ixy><ixz>0.0</ixz>
          <iyy>1.0</iyy><iyz>0.0</iyz>
          <izz>1.0</izz>
        </inertia>
      </inertial>
      <visual name='visual'>
        <geometry><cylinder radius='0.2' length='0.6'/></geometry>
      </visual>
      <collision name='collision'>
        <geometry><cylinder radius='0.2' length='0.6'/></geometry>
      </collision>
    </link>
    <joint name='revolute_joint' type='revolute'>
      <parent>base_link</parent>
      <child>link2</child>
      <axis>
        <xyz>0 0 1</xyz>
      </axis>
    </joint>
    <link name='link2'>
      <!-- ... -->
    </link>
  </model>
</sdf>
```

## Comparison of URDF and SDF

The choice between URDF and SDF often depends on the specific use case and integration with other tools. Here's a comparison of their key features:

| Feature           | URDF                                               | SDF                                                        |
| :---------------- | :------------------------------------------------- | :--------------------------------------------------------- |
| **Primary Use**   | Robot description within ROS                       | Comprehensive simulation environment description in Gazebo |
| **Scope**         | Single robot                                       | Robots and entire environments (lights, terrain, static objects) |
| **Nesting**       | Not directly supported (flat hierarchy)            | Supports nested models and links                           |
| **Physics**       | Basic inertial properties, collisions              | Detailed physics properties (friction, damping), advanced collisions |
| **Sensors**       | Indirectly via ROS sensor plugins                  | Direct sensor definition within the model/world            |
| **Plugins**       | Integrated through ROS nodes                       | Direct plugin integration within SDF files                 |
| **Extensibility** | Limited to XML schema, often combined with Xacro | More flexible and powerful for complex simulations         |

In summary, URDF is excellent for describing individual robots within the ROS ecosystem, while SDF offers a more complete solution for describing entire simulation worlds and advanced physics interactions in Gazebo.

</ChapterTranslator>