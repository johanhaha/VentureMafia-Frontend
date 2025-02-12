View web app live at [venturemafia.xyz](https://venturemafia.xyz/)

# Venture Mafia (Documentation in progress)

## Table of Contents
1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Key Components](#key-components)
4. [Styling](#styling)
5. [Utilities](#utilities)
6. [External Integrations](#external-integrations)
7. [Build and Deployment](#build-and-deployment)

## Project Overview

This React application appears to be a data visualization tool for exploring alumni networks of various organizations, with a focus on startups and venture capital. It uses D3.js for creating interactive network graphs and includes features like displaying information about organizations, individuals, and their connections.

## Project Structure

The project follows a typical React application structure:

- `src/`: Contains the main source code
  - `components/`: React components
  - `assets/`: Static assets like images and fonts
  - `styling.js`: Global styling configurations
- `public/`: Public assets and HTML template
- Configuration files (e.g., `package.json`, `.firebaserc`, etc.)

## Key Components

### App.js
The main component that sets up routing and overall layout.

### Layout.js
Defines the overall layout of the application, including a grid structure and footer.

### OrgAlumniContent.js
Manages the main content for displaying organization alumni information.

### NetworkGraph/
Contains components and utilities for rendering the network graph:
- `NetworkGraph.js`: Main component for rendering the D3.js graph
- `GraphContainer.js`: Container for the graph
- `utils/`: Helper functions for graph operations

### Sidebar/
Components for the sidebar, displaying detailed information:
- `Sidebar.js`: Main sidebar component
- `TargetOrgContent.js`, `PrimaryNodeContent.js`, `SecondaryNodeContent.js`: Different content types for the sidebar
- `ProfileImage.js`: Component for displaying profile images
- `utils.js`: Utility functions for the sidebar

### Footer.js
Renders the footer with color-coded relationship types.

## Styling

The project uses a combination of inline styles and a global styling configuration:

- `styling.js`: Defines color schemes, opacities, and text styles
- `assets/fonts.css`: Custom font definitions
- Inline styles are used extensively throughout components

## Utilities

Several utility functions are defined to handle data processing, formatting, and graph operations:

- `dataUtils.js`: Data processing for the graph
- `textUtils.js`: Text wrapping utilities for graph labels
- `graphUtils.js`: Various graph-related calculations and helper functions
- `forceUtils.js`: Force simulation setup for D3.js

## External Integrations

1. **Firebase**: Used for analytics (`firebase.js`)
2. **D3.js**: For creating the interactive network graph
3. **Font Awesome**: Icon library integration (`fontAwesome.js`)

## Build and Deployment

- The project uses Create React App for development and building
- `Dockerfile` and `nginx.conf` suggest containerization for deployment
- Firebase configuration indicates possible hosting on Firebase

## Additional Notes

1. SEO optimization is implemented using React Helmet for dynamic meta tags.
2. The application supports multiple "mafia" networks (PayPal, Skype, LinkedIn, eBay, Spotify).
3. Responsive design considerations are evident in the styling and layout.

This documentation provides an overview of the project structure and key components. For more detailed information about specific functions or components, refer to the inline comments in the respective files.
