# Cosmic Snake Game Project

## Background and Motivation
Building a Snake game powered by true cosmic randomness from SpaceComputer's Orbitport cTRNG API. The game will be integrated into the existing application with custom routing and a cosmic theme.

## Key Challenges and Analysis
1. Integration of SpaceComputer's cTRNG API for true random number generation
   - Need to handle API authentication securely
   - Must manage API rate limits and caching
   - Should implement fallback for API failures
2. Building a performant Snake game in React without external libraries
   - Need to optimize render performance
   - Must handle game state efficiently
   - Should implement smooth animations
3. Managing game state and food placement using cosmic randomness
   - Need to parse and validate hex data
   - Must ensure fair distribution of food positions
   - Should handle edge cases in position calculation
4. Implementing proper routing between pages
   - Need to maintain clean URL structure
   - Must handle navigation state
   - Should implement loading transitions
5. Removing all wallet-related components
   - Need to identify all wallet dependencies
   - Must clean up related state management
   - Should remove unused imports and code
6. Ensuring smooth game controls and preventing instant direction reversal
   - Need to implement proper key event handling
   - Must manage direction state
   - Should add visual feedback for controls

## High-level Task Breakdown

### Phase 1: Project Setup and Routing
- [ ] Create new route for cosmic-hub page
  - Create `/app/cosmic-hub/page.tsx`
  - Implement responsive layout
  - Add cosmic theme styling
- [ ] Create new route for Snake game
  - Create `/app/snake-game/page.tsx`
  - Set up game container component
  - Add game initialization logic
- [ ] Remove wallet components from landing page
  - Remove wallet connection button
  - Clean up wallet-related state
  - Remove unused imports
- [ ] Remove wallet components from Profile page
  - Remove wallet display
  - Clean up wallet-related state
  - Remove unused imports
- [ ] Replace "Discover Profile" button with "Enter the Cosmos" button
  - Update button text and styling
  - Implement new navigation logic
  - Add hover effects
- [ ] Create card components for cosmic-hub page
  - Create Profile card component
  - Create Snake Game card component
  - Add hover animations
  - Implement responsive grid layout

### Phase 2: SpaceComputer Integration
- [ ] Set up SpaceComputer API client
  - Reuse existing authentication logic from `/app/api/cosmic/route.ts`
  - Create dedicated service for game random numbers
  - Add error handling and fallback
- [ ] Implement food position generation
  - Create hex to grid position converter
  - Implement position validation
  - Add position caching
- [ ] Create food placement service
  - Implement food position queue
  - Add background refresh logic
  - Create position validation

### Phase 3: Snake Game Implementation
- [ ] Create game board component
  - Implement 20x20 grid
  - Add cell rendering
  - Create board styling
- [ ] Implement snake movement logic
  - Create snake state management
  - Add movement calculations
  - Implement 200ms tick rate
- [ ] Add keyboard controls
  - Implement key event listeners
  - Add direction state management
  - Create control feedback
- [ ] Implement collision detection
  - Add wall collision check
  - Implement self collision check
  - Create collision feedback
- [ ] Add food placement using cTRNG
  - Integrate with SpaceComputer service
  - Implement food position calculation
  - Add food rendering
- [ ] Implement snake growth mechanics
  - Add length management
  - Create growth animation
  - Update score tracking
- [ ] Add game over conditions
  - Implement game over state
  - Add restart functionality
  - Create game over screen
- [ ] Add cosmic visual styling
  - Create space theme
  - Add particle effects
  - Implement smooth animations

### Phase 4: Testing and Polish
- [ ] Test routing between all pages
  - Verify navigation flow
  - Test loading states
  - Check error handling
- [ ] Test game mechanics
  - Verify snake movement
  - Test collision detection
  - Check food placement
- [ ] Test random number generation
  - Verify API integration
  - Test position calculation
  - Check distribution
- [ ] Add loading states
  - Implement loading indicators
  - Add transition animations
  - Create error states
- [ ] Add error handling
  - Implement error boundaries
  - Add user feedback
  - Create recovery options
- [ ] Polish UI/UX
  - Add final animations
  - Implement responsive design
  - Create consistent styling

## Project Status Board
- [ ] Phase 1: Project Setup and Routing
- [ ] Phase 2: SpaceComputer Integration
- [ ] Phase 3: Snake Game Implementation
- [ ] Phase 4: Testing and Polish

## Executor's Feedback or Assistance Requests
(To be filled during implementation)

## Lessons
(To be filled during implementation)

## Technical Specifications

### API Integration Details
- Base URL: https://op.spacecomputer.io/api/v1/services/trng
- Authentication: OAuth2 with client credentials (reusing existing implementation)
- Response Format: JSON with hex data
- Token Caching: Implemented with 5-minute buffer
- Fallback: Math.random() for error cases

### Game Specifications
- Grid Size: 20x20
- Tick Rate: 200ms
- Controls: Arrow keys
- Food Positions: 8 positions per API response
- Visual Theme: Cosmic/Space

### Food Position Generation
1. Get hex data from cTRNG API
2. Slice into 2-character chunks
3. Group in 4s (4 hex chars = 2 bytes = x,y)
4. Convert to grid positions using modulo 20
5. Cache positions and refresh when needed 