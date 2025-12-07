# Chatbot Flow Builder

## Project Overview

This project is a **React-based Chatbot Flow Builder** developed as part of the BiteSpeed Frontend Task. It provides a visual, drag-and-drop interface for creating and managing chatbot conversation flows by connecting multiple message nodes together to determine their execution order.

**Live Demo:** [https://bite-speed-assignment-lb849ii4t-hrithiks-projects-a05d4764.vercel.app/](https://bite-speed-assignment-lb849ii4t-hrithiks-projects-a05d4764.vercel.app/)

## Problem Statement

The goal was to build a simple yet extensible chatbot flow builder that allows users to:
- Visually design chatbot conversation flows
- Connect multiple text message nodes to create conversation paths
- Edit and manage message content through an intuitive interface
- Validate flow integrity before saving
- Create a foundation that can be easily extended with additional node types

## Key Features

### 🎯 Core Functionality
- **Visual Flow Builder**: Drag-and-drop interface for creating chatbot flows
- **Text Message Nodes**: Support for multiple text message nodes in a single flow
- **Node Connections**: Connect nodes using edges to define conversation flow
- **Real-time Editing**: Click on any node to edit its content instantly
- **Flow Validation**: Ensures flow integrity before saving
- **Persistent State**: Save and manage flow configurations

### 🔧 Technical Features
- **Extensible Architecture**: Designed to easily accommodate new node types
- **React Flow Integration**: Built using the powerful React Flow library
- **Component-based Design**: Modular components for easy maintenance and extension
- **State Management**: Efficient state handling for complex flow operations
- **Responsive Design**: Works across different screen sizes

## Architecture & Components

### Core Components

#### 1. **Flow Builder (Main Component)**
- Central component that orchestrates the entire flow building experience
- Manages the canvas where nodes and edges are rendered
- Handles node selection, drag-and-drop operations, and flow state

#### 2. **Nodes Panel**
- Contains draggable node types that can be added to the flow
- Currently features Text Message nodes
- Designed to be extensible for future node types (image, video, conditional, etc.)

#### 3. **Settings Panel**
- Dynamic panel that replaces the Nodes Panel when a node is selected
- Provides text editing capabilities for the selected node
- Can be extended to support different property types for various node kinds

#### 4. **Text Message Node**
- Custom node component representing a text message in the chatbot flow
- Features source and target handles for connections
- Displays message content and handles visual feedback

#### 5. **Edge System**
- Custom edges that connect nodes together
- Implements the rule that each source handle can only have one outgoing edge
- Target handles can accept multiple incoming edges

### Technical Specifications

#### Node Handle Rules
- **Source Handle**: Can only have **one edge originating** from it
- **Target Handle**: Can have **multiple edges connecting** to it
- This ensures proper flow control and prevents ambiguous conversation paths

#### Flow Validation
The application implements validation logic to ensure:
- No nodes with empty target handles exist (except for start nodes)
- All nodes are properly connected in a meaningful conversation flow
- Proper error messaging when validation fails

## Technology Stack

- **Frontend Framework**: Next.js (React 18+)
- **Flow Library**: React Flow
- **Styling**: CSS Modules / Tailwind CSS
- **State Management**: React Hooks (useState, useCallback)
- **Build Tool**: Next.js built-in tooling
- **Deployment**: Vercel

## Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm, yarn, pnpm, or bun

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/HrithikSampson/Workflow.git
   cd Workflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser

## Usage Guide

### Building a Chatbot Flow

1. **Adding Nodes**
   - Drag a Text Message node from the Nodes Panel
   - Drop it onto the canvas to add it to your flow

2. **Connecting Nodes**
   - Click and drag from the source handle (bottom) of one node
   - Connect it to the target handle (top) of another node
   - Each source can only connect to one target

3. **Editing Node Content**
   - Click on any node to select it
   - The Settings Panel will appear with a text field
   - Edit the message content and see changes reflected immediately

4. **Saving Your Flow**
   - Click the "Save Changes" button to persist your flow
   - The system will validate your flow before saving
   - Error messages will appear if validation fails

### Flow Validation Rules

- All nodes should be connected in a meaningful way
- No orphaned nodes (nodes without proper connections)
- Proper start and end points should be defined

## Future Extensibility

The project is architected with extensibility in mind. Here are planned enhancements:

### Additional Node Types
- **Decision Nodes**: Conditional branching based on user input
- **Media Nodes**: Support for images, videos, and files
- **API Integration Nodes**: External service calls
- **User Input Nodes**: Forms and data collection

### Enhanced Features
- **Undo/Redo Functionality**: Operation history management
- **Flow Templates**: Pre-built conversation templates
- **Export/Import**: Flow sharing and backup capabilities
- **Analytics Integration**: Flow performance tracking

## Development Insights

### Code Structure
```
src/
├── components/
│   ├── FlowBuilder.js      # Main flow component
│   ├── NodesPanel.js       # Draggable nodes panel
│   ├── SettingsPanel.js    # Node editing interface
│   └── nodes/
│       └── TextNode.js     # Text message node component
├── hooks/
│   └── useFlowState.js     # Flow state management
├── utils/
│   └── validation.js       # Flow validation logic
└── styles/
    └── globals.css         # Global styles
```

### Key Implementation Decisions

1. **React Flow Choice**: Selected for its robust node-graph capabilities and extensive customization options
2. **Component Modularity**: Each node type is a separate component for easy extension
3. **State Management**: Used React hooks for lightweight state management suitable for the current scope
4. **Validation Strategy**: Implemented client-side validation to provide immediate feedback

## Performance Considerations

- **Efficient Rendering**: React Flow handles virtual rendering for large flows
- **State Optimization**: Minimal re-renders through proper state management
- **Memory Management**: Proper cleanup of event listeners and effects

## Challenges Overcome

1. **Handle Connection Logic**: Implementing the one-to-many relationship between source and target handles
2. **Dynamic Panel Switching**: Seamless transition between Nodes Panel and Settings Panel
3. **Flow Validation**: Creating robust validation that prevents invalid flow configurations
4. **State Persistence**: Managing complex flow state while maintaining performance

## Testing Strategy

The application can be tested through:
- **Manual Testing**: Interactive flow creation and validation
- **Edge Case Testing**: Invalid connections and orphaned nodes
- **Responsive Testing**: Different screen sizes and devices

## Contributing

This project welcomes contributions. Key areas for improvement:
- Additional node types
- Enhanced UI/UX
- Performance optimizations
- Test coverage expansion

## License

This project is developed as part of a technical assessment and is available for educational and demonstration purposes.

---

**Author**: [Hrithik Sampson](https://github.com/HrithikSampson)  
**Project Type**: Frontend Technical Assessment  
**Company**: BiteSpeed  
**Technology Focus**: React, Node.js Development
