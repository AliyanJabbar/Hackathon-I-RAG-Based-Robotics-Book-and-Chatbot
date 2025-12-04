---
sidebar_position: 6
title: "Robot Description: URDF and Xacro"
slug: /chapter-2-robotic-nervous-system/05-robot-description-urdf-xacro
---
import ChapterTranslator from '@site/src/components/Translation/chapterTranslator';

<ChapterTranslator>

# Robot Description: URDF and Xacro

Describing a robot's physical structure and kinematic properties is fundamental for simulation, visualization, and control in robotics. ROS 2 primarily uses URDF (Unified Robot Description Format) and its extension, Xacro, for this purpose.

## URDF: Links and Joints

The **Unified Robot Description Format (URDF)** is an XML-based file format used in ROS to describe all aspects of a robot. It defines the robot's kinematic and dynamic properties, visual appearance, and collision geometry. The two primary elements in a URDF file are:

-   **Links**: Represent the rigid bodies of the robot (e.g., a robot's torso, upper arm, forearm, hand). Each link has physical properties (mass, inertia), visual properties (geometry, color, texture), and collision properties.
-   **Joints**: Define the kinematic and dynamic connection between two links. Joints specify how links move relative to each other. Common joint types include:
    -   **Fixed**: No movement between links.
    -   **Revolute**: Rotation around a single axis (e.g., a hinge joint).
    -   **Prismatic**: Translation along a single axis (e.g., a sliding joint).

When adding multiple links, joints are necessary to specify their relative positions and movement capabilities.

## Xacro Macros

**Xacro (XML Macros)** is an XML macro language that extends URDF, making it easier to manage complex robot descriptions. URDF files can become very long and repetitive for robots with many similar components (e.g., a humanoid robot with symmetric limbs). Xacro allows developers to:

-   **Define Macros**: Create reusable blocks of XML code for common robot parts, reducing redundancy and improving readability.
-   **Use Properties and Calculations**: Define variables and perform mathematical operations within the URDF, allowing for parametric robot models.
-   **Include Files**: Break down complex robot descriptions into multiple, smaller files for better organization.

By using Xacro, URDF files become more concise, maintainable, and flexible, especially for robots with modular designs or scalable structures.

## Forward Kinematic Chains

**Forward kinematics** is the process of calculating the position and orientation of a robot's end-effector (e.g., a hand, tool) given the joint angles or positions. In URDF, the links and joints implicitly define the robot's kinematic chain. By traversing this chain from the base link to the end-effector and applying the transformations defined by each joint, the end-effector's pose can be determined. Understanding forward kinematics is crucial for robot control, path planning, and interaction with the environment.

## Humanoid Upper-Body Model

When modeling a humanoid robot, the URDF and Xacro files describe its complex articulation, including the torso, head, and multiple degrees of freedom in the arms and hands. This involves defining numerous links and joints, carefully specifying their geometric and kinematic properties to accurately represent the humanoid's structure for simulation and control.

## URDF vs SDF Comparison Table

| Feature          | URDF                             | SDF                               |
| :--------------- | :------------------------------- | :-------------------------------- |
| **Purpose**      | Robot description (ROS)          | Full simulation world description (Gazebo) |
| **Scope**        | Single robot                     | Multiple robots, environment, sensors, lights |
| **Root Element** | `<robot>`                        | `<sdf>`                           |
| **Physics**      | Limited, primarily kinematics    | Comprehensive physics engine properties |
| **Standards**    | ROS-specific XML format          | Open Robotics standard            |
| **Complexity**   | Simpler, focused on robot model  | More complex, broader scope       |


</ChapterTranslator>