---
sidebar_position: 3
title: "Communication: Topics, Services, and Actions"
slug: /chapter-2-robotic-nervous-system/02-communication-topics-services-actions
---
import ChapterTranslator from '@site/src/components/Translation/chapterTranslator';

<ChapterTranslator>

# Communication: Topics, Services, and Actions

In ROS 2, nodes communicate with each other using various mechanisms, forming the dynamic ROS graph. The primary communication patterns are Topics, Services, and Actions, each suited for different types of interactions.

## Topics (Publish/Subscribe)

**Topics** are a fundamental element of the ROS graph, providing a unidirectional, asynchronous communication mechanism based on the publish/subscribe pattern. Nodes publish messages to a named topic, and any node subscribed to that topic will receive those messages. This is ideal for streaming data, such as sensor readings (e.g., camera images, LiDAR scans, IMU data) or robot odometry. A key characteristic of topics is that publishers do not know or care about how many subscribers are receiving their messages, and subscribers do not know or care about how many publishers are sending messages to a topic.

## Services (Request/Response)

**Services** offer a synchronous, request/response communication pattern. A client node sends a request to a service-providing node and waits for a single response. This is suitable for operations that require an immediate result, such as querying a robot's state, triggering a specific action that provides a definitive outcome, or requesting a computation. Unlike topics, services are a one-to-one communication where a client interacts with a specific service. Each node in ROS 2 has infrastructure services related to parameters, allowing runtime configuration.

## Actions (Goal/Feedback/Result)

**Actions** are a more complex communication pattern built on top of topics and services, designed for long-running, cancellable tasks that provide periodic feedback. An action client sends a goal to an action server, which then processes the goal and sends continuous feedback about its progress. Once the task is complete, the action server sends a final result. The client can also preempt or cancel the goal while it is in progress. Actions are well-suited for tasks like navigating to a goal, performing a complex manipulation sequence, or executing a long-duration trajectory, where monitoring progress and potential cancellation are important.

## Message Definitions

**Messages** are the data structures used for communication over topics, services, and actions. They define the type and structure of the data being exchanged between nodes. ROS 2 uses `.msg` files to define the structure of topic messages, `.srv` files for service requests and responses, and `.action` files for action goals, feedback, and results. These files are typically simple text files that specify the data types and names of the fields within the message.

## Parameters and Lifecycle Nodes

### Parameters

**Parameters** allow nodes to expose configurable values that can be changed dynamically at runtime without recompiling the code. In ROS 2, parameters are associated with individual nodes and are configurable at runtime using ROS services. This enables flexible configuration of robot behavior, such as adjusting PID gains for a motor controller or setting a navigation threshold.

### Lifecycle Nodes

**Lifecycle nodes** in ROS 2 introduce a managed state machine for nodes, providing a more robust and predictable startup, shutdown, and error handling process. Unlike standard nodes, lifecycle nodes transition through well-defined states (e.g., Unconfigured, Inactive, Active, Finalized), allowing for better control over resource allocation and deterministic behavior. This is particularly useful in critical applications where predictable system behavior and graceful error recovery are essential. The `rclcpp` and `rclpy` client libraries provide APIs to create and manage lifecycle nodes, enabling developers to implement custom logic for state transitions.

## Communication Pattern Comparison

| Feature          | Topics          | Services         | Actions                  |
| :--------------- | :-------------- | :--------------- | :----------------------- |
| **Pattern**      | Publish/Subscribe | Request/Response | Goal/Feedback/Result     |
| **Direction**    | Unidirectional  | Bidirectional    | Bidirectional            |
| **Timing**       | Asynchronous    | Synchronous      | Asynchronous (long-running) |
| **Feedback**     | None            | Single response  | Continuous feedback      |
| **Cancellable?** | N/A             | No               | Yes                      |
| **Use Case**     | Streaming data  | Immediate queries | Long-running, cancellable tasks |

</ChapterTranslator>