---
sidebar_position: 9
title: "ROS 2 Navigation Advanced Topics"
slug: /chapter-2-robotic-nervous-system/08-ros2-navigation-advanced-topics
---
import ChapterTranslator from '@site/src/components/Translation/chapterTranslator';

<ChapterTranslator>

# ROS 2 Navigation Advanced Topics

This section delves into more advanced aspects of the ROS 2 Navigation Stack, covering topics such as deploying Nav2 within Docker containers and interacting with its action servers for complex tasks like route computation.

## Docker Deployment for Nav2

Deploying Nav2 in Docker containers provides a consistent and isolated environment, simplifying development and deployment across different systems. You can set up Nav2 either by installing binaries or building from source within a Dockerfile.

### Binary Install (Dockerfile Example)

This Dockerfile snippet demonstrates how to install Nav2 and related packages from binaries for a specific ROS distribution (e.g., Rolling) by commenting out source build steps:

```dockerfile
# For all else, comment the above Rolling lines and replace with below
# RUN rosdep init \\
#     && apt update && apt upgrade -y \\
#     && rosdep update \\
#     && apt install -y \\
#         ros-${ROS_DISTRO}-nav2-bringup \\
#         ros-${ROS_DISTRO}-navigation2 \\
#         ros-${ROS_DISTRO}-turtlebot3-gazebo
```

### Source Build (Dockerfile Example)

For more control or to work with a specific branch/fork of Nav2, you can build it from source within a Docker container. This involves cloning the repository, installing dependencies, and then building with `colcon`:

```dockerfile
ARG ROS_DISTRO=rolling
FROM ros:${ROS_DISTRO}-ros-core

RUN apt update \\
    && DEBIAN_FRONTEND=noninteractive apt install -y --no-install-recommends --no-install-suggests \\
  ros-dev-tools \\
  wget

# For Rolling or want to build from source a particular branch / fork
WORKDIR /root/nav2_ws
RUN mkdir -p ~/nav2_ws/src
RUN git clone https://github.com/ros-navigation/navigation2.git --branch main ./src/navigation2
RUN rosdep init
RUN apt update && apt upgrade -y \\
    && rosdep update \\
    && rosdep install -y --ignore-src --from-paths src -r
RUN . /opt/ros/${ROS_DISTRO}/setup.sh \\
    && colcon build --symlink-install
```

## Route Computation with Nav2 Actions

Nav2 utilizes ROS 2 actions for asynchronous, long-running tasks such as computing a global route. The `ComputeRoute` action server, for example, can be invoked with various parameters to plan a path between a start and goal pose.

### ComputeRoute Action XML Example

This XML snippet illustrates how to configure and invoke the `ComputeRoute` ROS 2 action server, passing essential input parameters:

```xml
<ComputeRoute start=\"{start}\" goal=\"{goal}\" use_poses=\"{true}\" use_start=\"{true}\" path=\"{path}\" server_name=\"ComputeRoute\" server_timeout=\"10\"\n                    error_code_id=\"{compute_route_error_code}\" error_msg=\"{compute_route_error_msg}\"/>
```

**Parameters:**

*   `start`, `goal`: The starting and ending poses for the route computation. These can be defined using specific coordinates or other pose representations.
*   `use_poses`, `use_start`: Boolean flags to indicate whether the start and goal poses should be used directly.
*   `path`: (Output) The resulting computed path.
*   `server_name`: The name of the `ComputeRoute` action server.
*   `server_timeout`: The maximum time (in seconds) to wait for the action server to respond.
*   `error_code_id`, `error_msg`: (Output) Variables to capture any error codes or messages from the action server.

By leveraging these advanced configuration and deployment techniques, you can build more robust and scalable robotic applications with the ROS 2 Navigation Stack.

</ChapterTranslator>