---
sidebar_position: 7
title: "ROS 2 Navigation Stack Overview"
slug: /chapter-2-robotic-nervous-system/06-ros2-navigation-stack-overview
---
import ChapterTranslator from '@site/src/components/Translation/chapterTranslator';

<ChapterTranslator>

# ROS 2 Navigation Stack Overview

The ROS 2 Navigation Stack (Nav2) is a powerful framework for enabling robots to autonomously navigate complex environments. It provides a complete solution for mobile robot navigation, from sensor processing and localization to path planning and motor control.

## Key Features

Nav2 builds upon the success of its ROS 1 predecessor, offering enhanced features and performance due to the improvements in ROS 2. Some of its core capabilities include:

*   **Modular Architecture**: Nav2 is designed with a modular plugin-based architecture, allowing users to easily swap out components like planners, controllers, and behaviors to suit specific robot needs and environments.
*   **Behavior Trees**: It utilizes behavior trees for flexible and robust navigation behaviors, enabling complex decision-making processes for tasks like obstacle avoidance, recovery, and goal following.
*   **Adaptive and Dynamic Planning**: Nav2 can adapt to dynamic environments by continuously updating its understanding of the world and replanning paths as needed.
*   **Simulation Integration**: Seamless integration with simulation environments like Gazebo, allowing for testing and development in a virtual setting before deployment on physical hardware.

## Installation and Setup

To get started with Nav2, you typically install the core packages and, if using a simulation, the relevant robot simulation packages.

### Installing Nav2 Packages

For Debian-based systems (like Ubuntu), you can install the core Nav2 packages using `apt`:

```bash
sudo apt install ros-<ros2-distro>-navigation2
sudo apt install ros-<ros2-distro>-nav2-bringup
```

### Installing Turtlebot 3 Demo Packages

If you are working with the Turtlebot 3 robot in a Gazebo simulation, you'll need to install its demo packages. The command varies depending on your Gazebo version:

```bash
# For Jazzy and newer (Gazebo Modern)
sudo apt install ros-<ros2-distro>-nav2-minimal-tb*

# For Iron and older (Gazebo Classic)
sudo apt install ros-<ros2-distro>-turtlebot3-gazebo
```

### Launching the Simulation

After installation, you can launch the Nav2 stack with the Turtlebot 3 in Gazebo using a launch file. The `headless:=False` argument ensures the Gazebo client (3D view) is visible:

```bash
ros2 launch nav2_bringup tb3_simulation_launch.py headless:=False
```

This command initializes various components, including AMCL localization, robot state publishing, the Gazebo instance with Turtlebot3, and RVIZ for visualization.

</ChapterTranslator>