---
sidebar_position: 4
title: 'Gazebo Simulation Environment'
slug: /chapter-3-digital-twin/gazebo-setup
---
import ChapterTranslator from '@site/src/components/Translation/chapterTranslator';

<ChapterTranslator>

# Gazebo Simulation Environment

## Introduction to Gazebo

Gazebo is an open-source 3D robotics simulator widely used in research and industry. It provides a robust physics engine (ODE, Bullet, DART, Simbody), high-quality rendering, and a convenient interface for generating complex outdoor and indoor environments. Gazebo is often integrated with the Robot Operating System (ROS), making it a powerful tool for developing and testing robotic applications.

## Installation and Environment Configuration

Installing Gazebo typically involves adding the Gazebo repositories and using a package manager. For Ubuntu systems, this often looks like:

```bash
sudo sh -c 'echo "deb http://packages.osrfoundation.org/gazebo/ubuntu-stable $(lsb_release -cs) main" > /etc/apt/sources.list.d/gazebo-stable.list'
wget http://packages.osrfoundation.org/gazebo.key -O - | sudo apt-key add -
sudo apt-get update
sudo apt-get install gazebo11 # Or a specific version like gazebo9
sudo apt-get install libgazebo11-dev # Development files
```

After installation, it's crucial to set up environment variables to ensure Gazebo can find its models, plugins, and media files:

```bash
export GAZEBO_MODEL_PATH=$GAZEBO_MODEL_PATH:~/my_models
export GAZEBO_RESOURCE_PATH=$GAZEBO_RESOURCE_PATH:~/my_resources
export GAZEBO_PLUGIN_PATH=$GAZEBO_PLUGIN_PATH:~/my_plugins
```

These paths tell Gazebo where to look for custom assets and compiled plugins.

## Nodes, Worlds, and Plugins

### Worlds

Gazebo simulations are defined within **world files** (``.world``). These XML-based files specify:

*   **Environment properties:** Gravity, physics engine settings, lighting.
*   **Models:** Robots, objects, terrain, and static structures.
*   **Sensors:** Cameras, LiDARs, IMUs attached to models.
*   **Plugins:** Custom code that extends Gazebo's functionality (e.g., controlling a robot, logging data).

Here's a minimal example of a world file:

```xml
<?xml version="1.0" ?>
<sdf version='1.6'>
  <world name='default'>
    <gravity>0 0 -9.8</gravity>
    <physics type='ode'>
      <max_step_size>0.001</max_step_size>
      <real_time_factor>1.0</real_time_factor>
    </physics>
    <include>
      <uri>model://sun</uri>
    </include>
    <include>
      <uri>model://ground_plane</uri>
    </include>
    <!-- Custom robot model or other objects can be included here -->
  </world>
</sdf>
```

### Models

**Models** represent physical objects in the simulation. These can be simple shapes, complex robot designs, or environmental fixtures. Models are defined using SDF (Simulation Description Format) or URDF (Unified Robot Description Format) files, which will be discussed in detail in the next section.

### Plugins

**Plugins** are shared libraries (``.so`` files) that can be loaded into Gazebo to add custom behavior. They can control robots, interact with ROS, simulate custom sensors, or modify the environment dynamically. Plugins are defined within world or model files and offer a powerful way to extend Gazebo's capabilities without modifying its core source code.

## Basic Simulation Examples

To launch a simple Gazebo world:

```bash
gazebo worlds/empty.world
```

To spawn a specific robot model:

```bash
roslaunch gazebo_ros spawn_model.launch -urdf -model my_robot -param robot_description
```

These commands initiate a simulation, allowing for visualization and interaction with the virtual environment.

</ChapterTranslator>