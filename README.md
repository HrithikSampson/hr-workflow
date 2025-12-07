# HR Workflow Designer

Visual workflow builder for HR processes with node-based canvas, dynamic forms, and workflow simulation.

## How to Run

```bash
npm install
npm run build
npm start
```

Visit [http://localhost:3000](http://localhost:3000)

Create workflow → Drag nodes → Connect → Edit → Save

## Design Decisions

### 1. Node Form Architecture

**Problem**: Each node type needs different form fields that change dynamically.

**Solution**: Discriminated unions with Zod

```typescript
// src/lib/nodeSchemas.ts
export const nodeDataSchema = z.discriminatedUnion("type", [
  startNodeSchema,
  taskNodeSchema,
  // ...
]);
```

**Why this works**:
- TypeScript knows exact fields based on node type
- Runtime validation matches compile-time types
- Adding new node type = add schema to union
- Forms get auto-complete for correct fields

**Alternative considered**: Separate validation logic per form
- Rejected because it duplicates type definitions
- No single source of truth

### 2. Dynamic Form Parameters

Node Data that is used in props are different so saved strategically with BaseNodeType in `src/types/nodeData.ts` also contains a getter from its type infered form BaseNodeType.

**Problem**: Automated Step nodes need different params based on selected action from API.

**Solution**: `useEffect` watches action selection, fetches params from API, dynamically renders inputs

```typescript
// src/components/forms/AutomatedStepNodeForm.tsx
const actions = await mockAPI.automations.getAll();
selectedAction.params.map(param => <input key={param} />)
```

**Why this works**:
- New automation types added to API automatically show in UI
- No hardcoded param lists in frontend
- Params come from single source (API)

**Alternative considered**: Hardcode all possible params
- Rejected because adding new automation requires code change

### 3. Graph Validation Strategy

**Problem**: Need to validate workflow structure before save, not just individual nodes.

**Solution**: Two-layer validation

```typescript
// Layer 1: Node-level (Zod schemas)
nodeDataSchema.safeParse(node.data)

// Layer 2: Graph-level (custom validator)
WorkflowValidator.validateWorkflow(nodes, edges)
// Checks: start/end nodes, connectivity, orphans
```

**Why separated**:
- Node validation reusable in forms
- Graph validation runs only on save (expensive)
- Clear separation of concerns

**Alternative considered**: Validate everything on every edit
- Rejected because too slow for large workflows

### 4. State Management Choice

**Problem**: Workflow state needed by: Canvas, Forms, Navbar, Node components.

**Solution**: Redux Toolkit with async thunks

**Why Redux**:
- Dispatch from anywhere (form save → update canvas)
- Navbar can read workflow without prop drilling
- DevTools show exact state mutations
- Thunks handle async API calls cleanly

```typescript
// src/state/workspace/workspaceSlice.ts
export const workflowSave = createAsyncThunk(
  'workflows/save',
  async (_, { getState }) => {
    await mockAPI.workflows.save(...)
  }
);
```

**Alternative considered**: Context API
- Rejected because forms 5 levels deep would need multiple contexts
- Redux dispatch simpler than passing callbacks through tree

### 5. Canvas Implementation

**Problem**: Need pan, zoom, edge routing, node selection.

**Solution**: React Flow library

**Why not build from scratch**:
- Pan/zoom requires transform matrix math
- Edge routing needs path algorithms
- Selection state management complex
- React Flow does all this, we provide node components

**Custom parts**:
- Node visual rendering (`concreteNodes/`)
- Edge styling (custom edge component)
- Drag-drop logic (sidebar → canvas)

### 6. Mock API Design

**Problem**: Simulate real backend with async operations.

**Solution**: Promise-based functions with delays

- Easily can be used with tanstack

```typescript
// src/lib/mockApi.ts
getAll: async (): Promise<AutomationAction[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...automationActions];
}
```

**Why delays matter**:
- Tests loading states in UI
- Catches race conditions
- Makes migration to real API easier (already handling async)

**Structure**:
- `workflows.*` - CRUD operations
- `automations.*` - GET automation types
- `simulate.*` - POST workflow, returns execution steps
- `export.*` / `import.*` - JSON serialization

### 7. Validation Error Display

**Problem**: Need to show which exact field on which node has error.

**Solution**: Toast notifications with field names and node IDs

```typescript
errors.forEach(error => {
  showToast({
    message: `${error.field}: ${error.message} (Node: ${error.nodeId})`
  });
});
```

**Why toasts**:
- Non-blocking (user can see canvas)
- Multiple errors shown sequentially
- Auto-dismiss keeps UI clean

**Alternative considered**: Inline errors on nodes
- Rejected because hard to see which specific field

### 8. Workflow Simulation Logic

**Problem**: Execute nodes in correct order without cycles.

**Solution**: BFS traversal from start node

```typescript
// src/lib/mockApi.ts - simulate.execute
const executionOrder = getExecutionOrder(edges, startNode.id);
// BFS returns: [startId, task1, approval1, endId]

for (const nodeId of executionOrder) {
  const step = await simulateNodeExecution(node);
  steps.push(step);
}
```

**Why BFS**:
- Handles multiple parallel paths
- Detects disconnected nodes (won't be in order)
- Natural execution flow

**What's simulated**:
- Task nodes: Assign to user
- Approval nodes: 70% approval rate
- Automated: Execute action with params
- End: Complete workflow

## Architecture Highlights

**Modular Node System**
- Each node type: Visual component + Form + Schema
- Adding new type: 3 files (component, form, schema)

**Type Safety**
- Zod schemas generate TypeScript types
- No manual interface duplication
- Runtime validation matches compile-time

**Separation of Concerns**
- `components/` - UI only
- `lib/` - Business logic and API
- `state/` - State management
- `types/` - Shared interfaces

**Extensibility**
- New node type: Add to `NodeType` enum + schema + components
- New automation: Add to `automationActions` array
- New validation rule: Extend `WorkflowValidator`

## Tech Stack Reasoning

**Next.js 14**: App Router, easy deployment, server components for future
**TypeScript**: Strict mode catches errors at compile time
**Redux Toolkit**: Complex state, multiple access points, thunks for async
**Zod**: Runtime validation = compile-time types
**React Flow**: Handles canvas complexity we don't need to build
**CSS Modules**: Component-scoped styles.

## Additional Features other than the Required one

- Minimap and Zoom 
- Node Templates: Template that is dragged from the sidebar and can be put so its Concrete Node type which will be added to the canvas.
- Import and Export: export works after saving.

