# MLBB Draft Assistant - Specification

## Project Overview
- **Project Name**: MLBB Draft Assistant
- **Type**: Web Application
- **Core Functionality**: A drafting assistant that suggests optimal hero picks based on enemy selections and team composition needs for Mobile Legends: Bang Bang
- **Target Users**: MLBB players who want strategic hero recommendations during draft phase

## Technology Stack
- **Backend**: Python with Flask
- **Frontend**: HTML/CSS/JavaScript
- **Data Storage**: JSON-based hero database

## UI/UX Specification

### Layout Structure
- **Header**: App title and navigation
- **Main Content**: 
  - Team composition display (5 hero slots per team)
  - Recommendation panel
  - Hero search/filter
- **Footer**: Credits and data attribution

### Visual Design
- **Color Palette**:
  - Primary: `#1a1a2e` (Dark navy background)
  - Secondary: `#16213e` (Slightly lighter navy)
  - Accent: `#e94560` (MLBB-inspired red)
  - Text Primary: `#eaeaea`
  - Text Secondary: `#a0a0a0`
  - Success: `#4ecca3` (Teal green)
  - Enemy indicator: `#ff6b6b` (Coral red)
  - Ally indicator: `#4ecca3` (Teal green)
- **Typography**:
  - Headings: 'Rajdhani', sans-serif (gaming aesthetic)
  - Body: 'Poppins', sans-serif
- **Spacing**: 8px base unit
- **Visual Effects**:
  - Card hover: subtle scale(1.02) with box-shadow
  - Hero portraits: rounded corners with border glow on selection
  - Smooth transitions: 0.3s ease

### Components
1. **Hero Slot**: Clickable placeholder showing hero icon/name
2. **Hero Card**: Portrait with name, role, and recommendation score
3. **Recommendation Panel**: List of suggested heroes with reasoning
4. **Role Filter**: Buttons to filter by tank, mage, assassin, etc.
5. **Search Bar**: Hero name search with autocomplete

## Functionality Specification

### Core Features
1. **Hero Database**: 
   - All MLBB heroes with roles (tank, mage, assassin, fighter, marksman, support)
   - Basic stats (durability, damage, mobility, effects)
   - Counter relationships

2. **Draft Input**:
   - Select enemy heroes (up to 5)
   - Select allied heroes (up to 5)
   - Clear/reset draft

3. **Hero Recommendations**:
   - Score heroes based on:
     - Counter effectiveness vs enemy team
     - Synergy with allied heroes
     - Role coverage for team
   - Display top 5 recommendations with explanation

4. **Hero Details**:
   - View hero stats and abilities
   - See counters and synergies

### User Interactions
- Click hero slot to open hero selection modal
- Click recommendation to view details
- Filter by role
- Search by hero name

## Acceptance Criteria
1. App loads without errors
2. Can select up to 5 enemy and 5 allied heroes
3. Recommendations update based on current draft
4. Hero search works correctly
5. Role filters function properly
6. UI is responsive and visually appealing