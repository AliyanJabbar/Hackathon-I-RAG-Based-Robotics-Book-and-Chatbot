---
sidebar_position: 2
title: "Middleware and Architecture"
slug: /chapter-2-robotic-nervous-system/01-ros2-middleware-and-architecture
---
import ChapterTranslator from '@site/src/components/Translation/chapterTranslator';

<ChapterTranslator>

# ROS 2 Middleware and Architecture

## Why Robotics Needs Middleware

Robotics systems are inherently complex, often comprising numerous components such as sensors, actuators, control algorithms, and artificial intelligence modules. These components need to communicate seamlessly and efficiently, often across different processes, machines, and even operating systems. Middleware provides a crucial abstraction layer that handles the complexities of inter-process communication, data serialization, and network management, allowing developers to focus on the robotic application logic rather than the underlying communication infrastructure. For real-time applications, such as autonomous robots, the middleware must also guarantee reliable and timely data delivery.

## DDS Overview

At the heart of ROS 2's communication system is the Data Distribution Service (DDS), an open international standard for real-time systems. DDS is a decentralized, data-centric middleware that enables efficient, scalable, and robust data exchange between distributed applications. Unlike ROS 1's master-slave architecture, DDS allows nodes to discover each other and communicate directly, eliminating single points of failure and improving performance. All current ROS 2 middleware implementations are based on full or partial DDS implementations, with popular choices including eProsima's Fast DDS, RTI's Connext DDS, and Eclipse Cyclone DDS.

## Quality of Service (QoS) Policies

ROS 2 leverages DDS's Quality of Service (QoS) policies to provide fine-grained control over data communication characteristics. QoS settings allow developers to tailor communication behavior to specific application requirements, ensuring reliability, timeliness, and resource efficiency. Key QoS policies include:

-   **Reliability**: Guarantees that messages are delivered to all subscribers. Options range from best-effort (for non-critical, high-frequency data) to reliable (for critical data where loss is unacceptable).
-   **History**: Determines how many samples (messages) are kept by the middleware for a publisher or subscriber. Options include "keep last" (stores a specified number of recent samples) or "keep all" (stores all samples until they are consumed).
-   **Durability**: Controls whether transient data is available to late-joining subscribers. Options include "volatile" (data is not persisted) or "transient local" (data is persisted for new subscribers).
-   **Liveliness**: Monitors the health of publishers and detects failures.

These policies are critical for designing robust robotic systems, allowing developers to balance performance, resource usage, and communication guarantees.

## Nodes, Executors, and Callback Groups

### Nodes

In ROS 2, a **node** is a fundamental computational unit, representing a process that performs a specific task within the robotic system. Examples include a camera driver node, a motor control node, or a navigation node. Nodes communicate with each other using various mechanisms provided by the ROS 2 graph (topics, services, actions).

### Executors

**Executors** are responsible for executing callbacks within a node. They manage the threading model and determine how and when callbacks are triggered. ROS 2 offers different executor types, such as:

-   **Single-threaded Executor**: Executes callbacks sequentially in a single thread.
-   **Multi-threaded Executor**: Executes callbacks concurrently in multiple threads, improving parallelism.

### Callback Groups

**Callback groups** provide a mechanism to organize and control the execution of callbacks within a node, especially when using multi-threaded executors. They allow developers to group related callbacks and define their execution behavior, such as whether they can be executed concurrently or exclusively. This is crucial for managing concurrency and avoiding race conditions in complex nodes with multiple subscriptions, timers, or service callbacks. Callback groups can be created using `create_callback_group` in `rclcpp` (C++) or by calling the constructor of the specific callback group type in `rclpy` (Python).

## ROS Computation Graph Diagram

(Placeholder for ROS computation graph ASCII diagram)

</ChapterTranslator>