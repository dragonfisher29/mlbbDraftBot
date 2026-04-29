# MLBB Draft Assistant

A web-based drafting assistant for Mobile Legends: Bang Bang (MLBB) that provides strategic hero recommendations during the draft phase.

![MLBB Draft Assistant](https://img.shields.io/badge/MLBB-Draft%20Assistant-e94560?style=for-the-badge)

## Features

- **Hero Selection**: Pick up to 5 enemy heroes and 5 allied heroes
- **Smart Recommendations**: AI-powered suggestions based on:
  - Counter-picks against enemy team composition
  - Synergy with allied heroes
  - Role coverage for balanced team composition
- **Role Filtering**: Filter recommendations by role (Tank, Fighter, Mage, Assassin, Marksman, Support)
- **Hero Search**: Quickly find heroes by name
- **Stats Display**: View hero durability, damage, and mobility ratings

## Tech Stack

- **Backend**: Python with Flask
- **Frontend**: HTML, CSS, JavaScript
- **Data**: JSON-based hero database

## Quick Start

### Prerequisites

- Python 3.8 or higher
- Flask

### Installation

1. Clone the repository:
```bash
cd mlbbDraftBot
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

4. Open your browser and navigate to:
```
http://127.0.0.1:5000
```

## Usage

1. **Select Enemy Heroes**: Click on the enemy team slots to pick enemy heroes
2. **Select Your Team**: Click on your team slots to add allied heroes
3. **View Recommendations**: The app will automatically show recommended heroes based on your draft
4. **Filter Results**: Use role buttons to filter recommendations by hero class
5. **Search Heroes**: Use the search bar to find specific heroes

## Project Structure

```
mlbbDraftBot/
├── app.py              # Flask backend with recommendation API
├── data/
│   └── heroes.json     # Hero database with stats and relationships
├── static/
│   ├── css/
│   │   └── style.css   # Gaming-themed dark UI
│   └── js/
│       └── app.js      # Frontend logic
├── templates/
│   └── index.html      # Main UI template
├── requirements.txt    # Python dependencies
├── SPEC.md            # Project specification
└── README.md          # This file
```

## Adding More Heroes

To add more heroes to the database, edit `data/heroes.json`:

```json
{
  "id": "hero-id",
  "name": "Hero Name",
  "role": "tank|fighter|mage|assassin|marksman|support",
  "icon": "URL to hero icon",
  "durability": 1-10,
  "damage": 1-10,
  "mobility": 1-10,
  "effects": 1-10,
  "counters": ["hero-id-1", "hero-id-2"],
  "synergies": ["hero-id-3", "hero-id-4"]
}
```

## License

This project is for educational purposes only. MLBB and Mobile Legends are trademarks of Moonton.