# filepath: app.py
from flask import Flask, render_template, jsonify, request
import json
import os

app = Flask(__name__)

# Load hero data
def load_heroes():
    data_path = os.path.join(os.path.dirname(__file__), 'data', 'heroes.json')
    with open(data_path, 'r', encoding='utf-8') as f:
        return json.load(f)

heroes = load_heroes()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/heroes')
def get_heroes():
    return jsonify(heroes)

@app.route('/api/recommend', methods=['POST'])
def recommend():
    data = request.json
    enemy_heroes = data.get('enemy', [])
    ally_heroes = data.get('ally', [])
    
    recommendations = get_recommendations(enemy_heroes, ally_heroes)
    return jsonify(recommendations)

def get_recommendations(enemy_heroes, ally_heroes):
    """Generate hero recommendations based on draft state."""
    # Get enemy hero objects
    enemy_objs = [h for h in heroes if h['id'] in enemy_heroes]
    ally_objs = [h for h in heroes if h['id'] in ally_heroes]
    
    # Already picked heroes
    picked_ids = set(enemy_heroes + ally_heroes)
    
    scores = []
    
    for hero in heroes:
        if hero['id'] in picked_ids:
            continue
            
        score = 0
        reasons = []
        
        # Counter score: how well this hero counters enemy team
        counter_score, counter_reasons = calculate_counter_score(hero, enemy_objs)
        score += counter_score * 1.5  # Weight counters heavily
        reasons.extend(counter_reasons)
        
        # Synergy score: how well this hero works with allies
        synergy_score, synergy_reasons = calculate_synergy_score(hero, ally_objs)
        score += synergy_score
        reasons.extend(synergy_reasons)
        
        # Role coverage: check if team needs this role
        role_score, role_reason = calculate_role_score(hero, ally_objs, enemy_objs)
        score += role_score
        if role_reason:
            reasons.append(role_reason)
        
        if reasons:
            scores.append({
                'hero': hero,
                'score': round(score, 1),
                'reasons': reasons[:3]  # Top 3 reasons
            })
    
    # Sort by score descending
    scores.sort(key=lambda x: x['score'], reverse=True)
    return scores[:10]

def calculate_counter_score(hero, enemy_objs):
    """Calculate how well hero counters the enemy team."""
    if not enemy_objs:
        return 0, []
    
    score = 0
    reasons = []
    
    for enemy in enemy_objs:
        # Check if hero counters this enemy
        counters = enemy.get('counters', [])
        if hero['id'] in counters:
            score += 25
            reasons.append(f"Counters {enemy['name']}")
        
        # Check if enemy counters this hero (negative)
        hero_counters = hero.get('counters', [])
        if enemy['id'] in hero_counters:
            score -= 10
            reasons.append(f"Weak against {enemy['name']}")
    
    return score, reasons[:2]

def calculate_synergy_score(hero, ally_objs):
    """Calculate how well hero synergizes with allies."""
    if not ally_objs:
        return 0, []
    
    score = 0
    reasons = []
    
    for ally in ally_objs:
        synergies = ally.get('synergies', [])
        if hero['id'] in synergies:
            score += 20
            reasons.append(f"Synergizes with {ally['name']}")
    
    return score, reasons[:2]

def calculate_role_score(hero, ally_objs, enemy_objs):
    """Calculate role coverage need."""
    if not ally_objs:
        return 5, "Flexible pick"
    
    role_counts = {}
    for ally in ally_objs:
        role = ally.get('role', 'fighter')
        role_counts[role] = role_counts.get(role, 0) + 1
    
    # Check if team lacks this role
    hero_role = hero.get('role', 'fighter')
    role_count = role_counts.get(hero_role, 0)
    
    if role_count < 2:
        return 15, f"Team needs {hero_role}"
    
    return 0, None

if __name__ == '__main__':
    app.run(debug=True, port=5000)