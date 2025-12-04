---
sidebar_position: 4
title: "Workspaces, Packages, and Launching"
slug: /chapter-2-robotic-nervous-system/03-workspaces-packages-and-launching
---
import ChapterTranslator from '@site/src/components/Translation/chapterTranslator';

<ChapterTranslator>

# Workspaces, Packages, and Launching

Effective development in ROS 2 relies on understanding how to organize your code into workspaces and packages, and how to orchestrate the execution of multiple nodes using launch files and parameters.

## Colcon Workspace Structure

A **colcon workspace** is a directory where you organize your ROS 2 packages for development. `colcon` is the build tool used in ROS 2, and it allows you to build multiple packages simultaneously. A typical workspace has a `src` directory where your source packages reside. When you build the workspace using `colcon build`, it creates `build`, `install`, and `log` directories. The `install` directory contains the compiled executables, libraries, and other installable artifacts. For faster iteration during development, especially for non-compiled resources like Python files, `colcon build --symlink-install` can be used to create symlinks, allowing changes in the source space to be reflected immediately.

## Package Definition: `package.xml` and `setup.py`

Each ROS 2 package is defined by a `package.xml` file, which contains metadata about the package, such as its name, version, description, maintainers, licenses, and its dependencies. For Python packages, a `setup.py` file is also used to describe how the package is built and installed, including entry points for executables and how to install launch files.

## Launch Files and Orchestrating Multi-Node Systems

**Launch files** are XML, YAML, or Python scripts used to start and configure multiple ROS 2 nodes simultaneously. They provide a powerful way to orchestrate complex robotic systems, defining the nodes to be run, their parameters, and their interconnections. Launch files can also include other launch files, allowing for modular and reusable configurations. Python launch scripts offer the most flexibility, enabling conditional logic and dynamic generation of nodes. However, for typical use cases, XML and YAML are often preferred for their simplicity.

## Example Folder Trees

A common structure for a ROS 2 workspace might look like this:

```my_ros2_workspace/
├── src/                # Your ROS 2 packages go here
│   ├── my_package/
│   │   ├── CMakeLists.txt
│   │   ├── package.xml
│   │   ├── launch/
│   │   └── src/
│   └── another_package/
├── install/            # Created after colcon build
├── build/              # Created after colcon build
└── log/                # Build logs
```

And a Python package might look like this:

```my_ros2_workspace/
└── src/
    └── my_python_pkg/
        ├── my_python_pkg/           # Python module folder
        │   ├── __init__.py
        │   ├── node.py              # Your ROS 2 node(s)
        │   └── utils.py             # Optional helper modules
        ├── package.xml               # Package metadata
        ├── setup.cfg                 # Python packaging config
        ├── setup.py                  # Python setup script
        └── resource/
            └── my_python_pkg         # Needed for ROS 2 entry points
```

## YAML Parameters

**YAML (YAML Ain't Markup Language)** is a human-friendly data serialization standard commonly used in ROS 2 for defining parameters. Parameters allow nodes to be configured dynamically at runtime. In ROS 2, YAML parameter files specify values for parameters, and these are loaded by nodes at startup or changed during runtime. The main difference from ROS 1 is that in ROS 2, node names must be used to address parameters within the YAML file, typically under a `ros__parameters` key.

Example `my_params.yaml`:

```yaml
my_robot_node:
  ros__parameters:
    speed_limit: 1.5
    sensor_topic: "/scan"
```

</ChapterTranslator>