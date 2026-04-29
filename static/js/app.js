// filepath: static/js/app.js

// State
let heroes = [];
let enemyTeam = [];
let allyTeam = [];
let currentFilter = 'all';
let currentTeam = null;
let currentSlot = null;

// DOM Elements
const enemySlots = document.getElementById('enemy-slots');
const allySlots = document.getElementById('ally-slots');
const recommendationsDiv = document.getElementById('recommendations');
const heroModal = document.getElementById('hero-modal');
const heroGrid = document.getElementById('hero-grid');
const modalSearch = document.getElementById('modal-search');
const heroSearch = document.getElementById('hero-search');
const closeModalBtn = document.getElementById('close-modal');
const filterBtns = document.querySelectorAll('.filter-btn');

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
    await loadHeroes();
    setupEventListeners();
    renderHeroGrid(heroes);
}

async function loadHeroes() {
    try {
        const response = await fetch('/api/heroes');
        heroes = await response.json();
    } catch (error) {
        console.error('Failed to load heroes:', error);
    }
}

function setupEventListeners() {
    // Hero slot clicks
    document.querySelectorAll('.hero-slot').forEach(slot => {
        slot.addEventListener('click', handleSlotClick);
    });

    // Modal close
    closeModalBtn.addEventListener('click', closeModal);
    heroModal.addEventListener('click', (e) => {
        if (e.target === heroModal) closeModal();
    });

    // Search
    modalSearch.addEventListener('input', handleModalSearch);
    heroSearch.addEventListener('input', handleHeroSearch);

    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });
}

function handleSlotClick(e) {
    const slot = e.currentTarget;
    currentTeam = slot.dataset.team;
    currentSlot = parseInt(slot.dataset.slot);
    openModal();
}

function openModal() {
    heroModal.classList.add('active');
    modalSearch.value = '';
    renderHeroGrid(heroes);
}

function closeModal() {
    heroModal.classList.remove('active');
    currentTeam = null;
    currentSlot = null;
}

function handleModalSearch(e) {
    const query = e.target.value.toLowerCase();
    const filtered = heroes.filter(h => 
        h.name.toLowerCase().includes(query)
    );
    renderHeroGrid(filtered);
}

function handleHeroSearch(e) {
    const query = e.target.value.toLowerCase();
    updateRecommendations(query);
}

function handleFilterClick(e) {
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.role;
    updateRecommendations();
}

function renderHeroGrid(heroesToRender) {
    heroGrid.innerHTML = heroesToRender.map(hero => `
        <div class="hero-grid-item" data-hero-id="${hero.id}">
            <img src="${hero.icon}" alt="${hero.name}">
            <div class="name">${hero.name}</div>
            <div class="role">${hero.role}</div>
        </div>
    `).join('');

    // Add click handlers
    document.querySelectorAll('.hero-grid-item').forEach(item => {
        item.addEventListener('click', () => selectHero(item.dataset.heroId));
    });
}

function selectHero(heroId) {
    const hero = heroes.find(h => h.id === heroId);
    if (!hero) return;

    if (currentTeam === 'enemy') {
        if (currentSlot < enemyTeam.length) {
            enemyTeam[currentSlot] = heroId;
        } else if (enemyTeam.length < 5) {
            enemyTeam.push(heroId);
        }
    } else {
        if (currentSlot < allyTeam.length) {
            allyTeam[currentSlot] = heroId;
        } else if (allyTeam.length < 5) {
            allyTeam.push(heroId);
        }
    }

    renderSlots();
    updateRecommendations();
    closeModal();
}

function renderSlots() {
    // Render enemy slots
    const enemySlotEls = enemySlots.querySelectorAll('.hero-slot');
    enemySlotEls.forEach((slot, index) => {
        if (enemyTeam[index]) {
            const hero = heroes.find(h => h.id === enemyTeam[index]);
            if (hero) {
                slot.className = 'hero-slot filled enemy-slot';
                slot.innerHTML = `
                    <img src="${hero.icon}" alt="${hero.name}">
                    <span class="hero-name">${hero.name}</span>
                    <button class="remove-btn" data-team="enemy" data-index="${index}">&times;</button>
                `;
            }
        } else {
            slot.className = 'hero-slot empty';
            slot.innerHTML = '<span class="plus">+</span>';
        }
    });

    // Render ally slots
    const allySlotEls = allySlots.querySelectorAll('.hero-slot');
    allySlotEls.forEach((slot, index) => {
        if (allyTeam[index]) {
            const hero = heroes.find(h => h.id === allyTeam[index]);
            if (hero) {
                slot.className = 'hero-slot filled ally-slot';
                slot.innerHTML = `
                    <img src="${hero.icon}" alt="${hero.name}">
                    <span class="hero-name">${hero.name}</span>
                    <button class="remove-btn" data-team="ally" data-index="${index}">&times;</button>
                `;
            }
        } else {
            slot.className = 'hero-slot empty';
            slot.innerHTML = '<span class="plus">+</span>';
        }
    });

    // Add remove button handlers
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const team = btn.dataset.team;
            const index = parseInt(btn.dataset.index);
            
            if (team === 'enemy') {
                enemyTeam.splice(index, 1);
            } else {
                allyTeam.splice(index, 1);
            }
            
            renderSlots();
            updateRecommendations();
        });
    });
}

async function updateRecommendations(searchQuery = '') {
    if (enemyTeam.length === 0) {
        recommendationsDiv.innerHTML = `
            <div class="empty-state">
                <p>Select enemy heroes to get recommendations</p>
            </div>
        `;
        return;
    }

    try {
        const response = await fetch('/api/recommend', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                enemy: enemyTeam,
                ally: allyTeam
            })
        });

        let recommendations = await response.json();

        // Apply role filter
        if (currentFilter !== 'all') {
            recommendations = recommendations.filter(r => 
                r.hero.role === currentFilter
            );
        }

        // Apply search filter
        if (searchQuery) {
            recommendations = recommendations.filter(r => 
                r.hero.name.toLowerCase().includes(searchQuery)
            );
        }

        renderRecommendations(recommendations);
    } catch (error) {
        console.error('Failed to get recommendations:', error);
    }
}

function renderRecommendations(recommendations) {
    if (recommendations.length === 0) {
        recommendationsDiv.innerHTML = `
            <div class="empty-state">
                <p>No recommendations found</p>
            </div>
        `;
        return;
    }

    recommendationsDiv.innerHTML = recommendations.map(rec => `
        <div class="rec-card" data-hero-id="${rec.hero.id}">
            <div class="hero-icon">
                <img src="${rec.hero.icon}" alt="${rec.hero.name}">
            </div>
            <div class="rec-info">
                <div class="rec-header">
                    <span class="rec-hero-name">${rec.hero.name}</span>
                    <span class="rec-role">${rec.hero.role}</span>
                </div>
                <div class="rec-stats">
                    <span>Durability: ${rec.hero.durability}/10</span>
                    <span>Damage: ${rec.hero.damage}/10</span>
                    <span>Mobility: ${rec.hero.mobility}/10</span>
                </div>
                <div class="rec-reasons">
                    ${rec.reasons.map(r => `<span class="reason-tag">${r}</span>`).join('')}
                </div>
            </div>
            <div class="rec-score">${rec.score}</div>
        </div>
    `).join('');
}