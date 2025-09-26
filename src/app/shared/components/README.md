# Shared Components

This folder contains all reusable UI components used throughout the Angular Component Communication examples.

## Structure

Each component is organized in its own folder with the following pattern:
```
component-name/
├── component-name.component.ts    # Component logic
├── component-name.component.html  # Template
├── component-name.component.css   # Styles
└── index.ts                       # Export barrel
```

## Components

### Learning Notes (`learning-notes/`)
Displays educational tips, warnings, and information blocks.

### Code Examples (`code-examples/`)
Shows formatted code snippets with syntax highlighting and explanations.

### Explanation Section (`explanation-section/`)
Renders structured educational content with icons and formatted text.

### Pros & Cons Section (`pros-cons-section/`)
Displays comparative information in a side-by-side pros/cons layout.

## Usage

Import any component from the shared module:
```typescript
import { 
  LearningNotesComponent,
  CodeExamplesComponent,
  ExplanationSectionComponent,
  ProsConsSectionComponent 
} from '../../shared';
```

All components are standalone and can be used independently.