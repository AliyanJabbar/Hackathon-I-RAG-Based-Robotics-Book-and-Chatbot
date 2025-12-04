---
sidebar_position: 8
title: "ROS 2 Navigation Configuration"
slug: /chapter-2-robotic-nervous-system/07-ros2-navigation-configuration
---
import ChapterTranslator from '@site/src/components/Translation/chapterTranslator';

<ChapterTranslator>

# ROS 2 Navigation Configuration

The ROS 2 Navigation Stack (Nav2) is highly configurable, allowing users to fine-tune its behavior to match specific robot platforms and environmental challenges. Configuration is primarily done through YAML files, which define parameters for various Nav2 components like the behavior server, planners, and controllers.

## Behavior Server Configuration

The Behavior Server is a crucial component of Nav2, responsible for executing high-level robot behaviors. Its configuration defines which behaviors are available and how they operate. Below is a comprehensive example of a YAML configuration for the Nav2 behavior server:

```yaml
behavior_server:
  ros__parameters:
    local_costmap_topic: local_costmap/costmap_raw
    local_footprint_topic: local_costmap/published_footprint
    global_costmap_topic: global_costmap/costmap_raw
    global_footprint_topic: global_costmap/published_footprint
    cycle_frequency: 10.0
    behavior_plugins: [\"spin\", \"backup\", \"drive_on_heading\", \"wait\", \"assisted_teleop\"]
    spin:
      plugin: \"nav2_behaviors::Spin\" # In Iron and older versions, \"/\" was used instead of \"::\"
    backup:
      plugin: \"nav2_behaviors::BackUp\" # In Iron and older versions, \"/\" was used instead of \"::\"
    drive_on_heading:
      plugin: \"nav2_behaviors::DriveOnHeading\" # In Iron and older versions, \"/\" was used instead of \"::\"
    wait:
      plugin: \"nav2_behaviors::Wait\" # In Iron and older versions, \"/\" was used instead of \"::\"
    assisted_teleop:
      plugin: \"nav2_behaviors::AssistedTeleop\" # In Iron and older versions, \"/\" was used instead of \"::\"
    local_frame: odom
    global_frame: map
    robot_base_frame: base_link
    transform_tolerance: 0.1
    simulate_ahead_time: 2.0
    max_rotational_vel: 1.0
    min_rotational_vel: 0.4
    rotational_acc_lim: 3.2
    enable_stamped_cmd_vel: true  # default false in Jazzy or older
```

### Key Parameters Explained

*   `local_costmap_topic`, `global_costmap_topic`: These parameters define the ROS topics where the local and global costmaps are published. Costmaps are grid maps that represent the environment, indicating obstacles and traversable areas.
*   `local_footprint_topic`, `global_footprint_topic`: Topics for the robot's footprint, used for collision checking within the costmaps.
*   `cycle_frequency`: The rate at which the behavior server processes and updates behaviors.
*   `behavior_plugins`: A list of available behavior plugins (e.g., `spin`, `backup`, `drive_on_heading`, `wait`, `assisted_teleop`). Each plugin corresponds to a specific robot action or recovery behavior.
*   `spin`, `backup`, etc. (sub-parameters): For each listed behavior plugin, you can specify its exact plugin type. Note the change in namespace separator from `/` (Iron and older) to `::` (Jazzy and newer).
*   `local_frame`, `global_frame`, `robot_base_frame`: These define the coordinate frames used for localization and navigation, typically `odom` (odometry frame), `map` (global map frame), and `base_link` (robot's base frame).
*   `transform_tolerance`: The maximum time difference allowed for transforms (tf2) to be considered valid.
*   `simulate_ahead_time`: Time in seconds to simulate the robot's movement ahead for collision checking.
*   `max_rotational_vel`, `min_rotational_vel`, `rotational_acc_lim`: Parameters controlling the robot's rotational velocity and acceleration limits during behaviors like spinning.
*   `enable_stamped_cmd_vel`: A boolean flag to enable or disable the use of stamped command velocities, which include a timestamp. This is `true` by default in Jazzy or newer versions of ROS 2.

</ChapterTranslator>