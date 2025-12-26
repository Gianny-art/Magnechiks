// Données globales
const productsData = [
    {
        id: 1,
        name: "Poulet Fermier Frais",
        description: "Élevé en plein air, alimentation naturelle, chair tendre",
        price: 16.50,
        weight: "1.8 kg",
        age: "50 jours",
        state: "fresh",
        category: "standard",
        available: true,
        image: "fas fa-egg",
        badge: "Nouveau"
    },
    {
        id: 2,
        name: "Poulet Bio Premium",
        description: "Certification AB, élevage en liberté, qualité exceptionnelle",
        price: 24.90,
        weight: "2.1 kg",
        age: "60 jours",
        state: "fresh",
        category: "bio",
        available: true,
        image: "fas fa-leaf",
        badge: "Bio"
    },
    {
        id: 3,
        name: "Poulet Congelé Grande Taille",
        description: "Parfait pour les grandes familles, conservation optimale",
        price: 14.75,
        weight: "2.5 kg",
        age: "45 jours",
        state: "frozen",
        category: "standard",
        available: true,
        image: "fas fa-snowflake",
        badge: "Économique"
    },
    {
        id: 4,
        name: "Poulet Fermier Label Rouge",
        description: "Label Rouge garantie, saveur authentique",
        price: 19.90,
        weight: "1.9 kg",
        age: "81 jours",
        state: "fresh",
        category: "premium",
        available: true,
        image: "fas fa-award",
        badge: "Label Rouge"
    },
    {
        id: 5,
        name: "Poulet Bio Congelé",
        description: "Bio et pratique, qualité préservée par congélation rapide",
        price: 21.50,
        weight: "1.7 kg",
        age: "58 jours",
        state: "frozen",
        category: "bio",
        available: true,
        image: "fas fa-snowflake",
        badge: "Bio"
    }
];

const batchesData = [
    {
        id: 1,
        name: "Lot Standard",
        type: "fresh",
        weight: "1.5-2 kg",
        age: "50 jours",
        quantity: 100,
        price: 15.00,
        available: true,
        description: "Lot de poulets frais standard"
    },
    {
        id: 2,
        name: "Lot Premium",
        type: "fresh",
        weight: "2-2.5 kg",
        age: "60 jours",
        quantity: 50,
        price: 22.50,
        available: true,
        description: "Lot de poulets premium qualité supérieure"
    },
    {
        id: 3,
        name: "Lot Économique",
        type: "frozen",
        weight: "1-1.5 kg",
        age: "40 jours",
        quantity: 200,
        price: 12.00,
        available: true,
        description: "Lot de poulets congelés économique"
    },
    {
        id: 4,
        name: "Lot Bio",
        type: "fresh",
        weight: "1.8-2.2 kg",
        age: "70 jours",
        quantity: 75,
        price: 27.90,
        available: true,
        description: "Lot de poulets biologiques certifiés"
    },
    {
        id: 5,
        name: "Lot Famille",
        type: "mixed",
        weight: "1.5-2.5 kg",
        age: "45-60 jours",
        quantity: 150,
        price: 18.50,
        available: true,
        description: "Lot mixte pour les grandes familles"
    }
];

let cart = JSON.parse(localStorage.getItem('magnickis_cart')) || [];
let selectedBatches = [];
let currentLanguage = localStorage.getItem('magnickis_lang') || 'fr';
let currentDelivery = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    initializeSwiper();
    loadTranslations(currentLanguage);
});

// Initialisation de l'application
function initializeApp() {
    // Gestion du thème
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('magnickis_theme') || 'light';
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
    }
    
    themeToggle.addEventListener('change', toggleTheme);
    
    // Gestion des onglets
    setupTabs();
    
    // Gestion de la langue
    setupLanguageSelector();
    
    // Chargement des données
    loadProducts();
    loadBatches();
    updateCart();
    
    // Événements
    setupEventListeners();
    
    // Vérification de la connexion
    checkAuthStatus();
}

// Gestion du thème
function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('magnickis_theme', isDark ? 'dark' : 'light');
}

// Configuration des onglets
function setupTabs() {
    const tabItems = document.querySelectorAll('.tab-item');
    const sections = document.querySelectorAll('.content-section');
    
    tabItems.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Supprimer la classe active de tous les onglets
            tabItems.forEach(item => item.classList.remove('active'));
            // Ajouter la classe active à l'onglet cliqué
            this.classList.add('active');
            
            // Masquer toutes les sections
            sections.forEach(section => section.classList.remove('active'));
            
            // Afficher la section correspondante
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
}

// Configuration du sélecteur de langue
function setupLanguageSelector() {
    const currentLang = document.getElementById('currentLang');
    const langDropdown = document.getElementById('langDropdown');
    
    currentLang.addEventListener('click', function() {
        langDropdown.style.display = langDropdown.style.display === 'block' ? 'none' : 'block';
    });
    
    document.querySelectorAll('.lang-option').forEach(option => {
        option.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            switchLanguage(lang);
            langDropdown.style.display = 'none';
        });
    });
    
    // Fermer le dropdown en cliquant ailleurs
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.language-selector')) {
            langDropdown.style.display = 'none';
        }
    });
}

// Chargement des produits
function loadProducts(filteredProducts = productsData) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-image">
                <i class="${product.image}"></i>
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-details">
                    <span>Poids: ${product.weight}</span>
                    <span>Âge: ${product.age}</span>
                    <span>${product.state === 'fresh' ? 'Frais' : 'Congelé'}</span>
                </div>
                <div class="product-price">${product.price.toFixed(2)} FCFA</div>
                <div class="product-actions">
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Ajouter
                    </button>
                    <button class="view-details" onclick="viewProductDetails(${product.id})">
                        <i class="fas fa-eye"></i> Détails
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Chargement des lots
function loadBatches() {
    const batchesGrid = document.getElementById('batchesGrid');
    if (!batchesGrid) return;
    
    batchesGrid.innerHTML = batchesData.map(batch => `
        <div class="batch-card" data-id="${batch.id}">
            <div class="batch-header">
                <h4 class="batch-name">${batch.name}</h4>
                <span class="batch-badge">${batch.type === 'fresh' ? 'Frais' : batch.type === 'frozen' ? 'Congelé' : 'Mixte'}</span>
            </div>
            <p>${batch.description}</p>
            <div class="batch-details">
                <div class="detail-item">
                    <span class="detail-label">Poids:</span>
                    <span class="detail-value">${batch.weight}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Âge:</span>
                    <span class="detail-value">${batch.age}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Disponible:</span>
                    <span class="detail-value">${batch.quantity} unités</span>
                </div>
            </div>
            <div class="batch-price">${batch.price.toFixed(2)} €/unité</div>
            <button class="batch-select" onclick="selectBatch(${batch.id})">
                <i class="fas fa-check"></i> Sélectionner
            </button>
        </div>
    `).join('');
}

// Sélection d'un lot
function selectBatch(batchId) {
    const batchCard = document.querySelector(`.batch-card[data-id="${batchId}"]`);
    const batch = batchesData.find(b => b.id === batchId);
    
    if (!batch) return;
    
    const quantity = parseInt(document.getElementById('batchQuantity').value) || 1;
    
    // Vérifier si le lot est déjà sélectionné
    const existingIndex = selectedBatches.findIndex(item => item.id === batchId);
    
    if (existingIndex > -1) {
        // Mettre à jour la quantité
        selectedBatches[existingIndex].quantity += quantity;
        selectedBatches[existingIndex].total = selectedBatches[existingIndex].quantity * batch.price;
    } else {
        // Ajouter le lot
        selectedBatches.push({
            id: batchId,
            name: batch.name,
            price: batch.price,
            quantity: quantity,
            total: batch.price * quantity,
            type: batch.type
        });
        batchCard.classList.add('selected');
    }
    
    updateOrderSummary();
    showNotification(`Lot "${batch.name}" ajouté à la commande`);
}

// Mise à jour du résumé de commande
function updateOrderSummary() {
    const totalBatches = selectedBatches.length;
    const totalQuantity = selectedBatches.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = selectedBatches.reduce((sum, item) => sum + item.total, 0);
    
    document.getElementById('selectedBatches').textContent = totalBatches;
    document.getElementById('totalQuantity').textContent = totalQuantity;
    document.getElementById('totalAmount').textContent = totalAmount.toFixed(2) + ' FCFA';
    document.getElementById('paymentAmount').textContent = totalAmount.toFixed(2) + ' FCFA';
}

// Ajouter au panier
function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${product.name} ajouté au panier`);
}

// Mise à jour du panier
function updateCart() {
    localStorage.setItem('magnickis_cart', JSON.stringify(cart));
    
    // Mettre à jour le compteur du panier
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

// Vérification du statut d'authentification
function checkAuthStatus() {
    const user = JSON.parse(localStorage.getItem('magnickis_user'));
    const authButton = document.getElementById('authButton');
    
    if (user) {
        authButton.href = 'profile.html';
        authButton.innerHTML = `
            <i class="fas fa-user-circle"></i>
            <span class="auth-text">${user.firstName}</span>
        `;
    } else {
        authButton.href = 'login.html';
        authButton.innerHTML = `
            <i class="fas fa-user-circle"></i>
            <span class="auth-text" data-i18n="login">Se Connecter</span>
        `;
    }
}

// Initialisation du swiper
function initializeSwiper() {
    const swiper = new Swiper('.swiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
            },
            1024: {
                slidesPerView: 3,
            }
        }
    });
}

// Configuration des événements
function setupEventListeners() {
    // Recherche de produits
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.getElementById('productSearch');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') performSearch();
        });
    }
    
    // Filtres
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', filterProducts);
    }
    
    // Filtres de lots
    const stateButtons = document.querySelectorAll('.state-btn');
    stateButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            stateButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            filterBatches();
        });
    });
    
    // Quantité
    const qtyInput = document.getElementById('batchQuantity');
    const qtyMinus = document.querySelector('.qty-btn.minus');
    const qtyPlus = document.querySelector('.qty-btn.plus');
    
    if (qtyMinus && qtyPlus && qtyInput) {
        qtyMinus.addEventListener('click', () => {
            let value = parseInt(qtyInput.value);
            if (value > 1) qtyInput.value = value - 1;
        });
        
        qtyPlus.addEventListener('click', () => {
            let value = parseInt(qtyInput.value);
            if (value < 100) qtyInput.value = value + 1;
        });
    }
    
    // Plage de poids
    const weightMin = document.getElementById('weightMin');
    const weightMax = document.getElementById('weightMax');
    const weightRange = document.getElementById('weightRange');
    
    if (weightMin && weightMax && weightRange) {
        const updateWeightRange = () => {
            weightRange.textContent = `${weightMin.value} - ${weightMax.value} kg`;
            filterBatches();
        };
        
        weightMin.addEventListener('input', updateWeightRange);
        weightMax.addEventListener('input', updateWeightRange);
    }
    
    // Âge
    const ageSelect = document.getElementById('ageSelect');
    if (ageSelect) {
        ageSelect.addEventListener('change', filterBatches);
    }
    
    // Passer commande
    const placeOrderBtn = document.getElementById('placeOrder');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', placeOrder);
    }
    
    // Livraison
    const deliveryButtons = document.querySelectorAll('.delivery-select');
    deliveryButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            currentDelivery = this.getAttribute('data-delivery');
            showNotification(`Option de livraison sélectionnée: ${currentDelivery === 'pickup' ? 'Retrait' : 'Livraison'}`);
        });
    });
    
    // Méthodes de paiement
    const methodCards = document.querySelectorAll('.method-card');
    methodCards.forEach(card => {
        card.addEventListener('click', function() {
            methodCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Paiement
    const processPaymentBtn = document.getElementById('processPayment');
    if (processPaymentBtn) {
        processPaymentBtn.addEventListener('click', processPayment);
    }
}

// Recherche de produits
function performSearch() {
    const searchTerm = document.getElementById('productSearch').value.toLowerCase();
    const filtered = productsData.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    loadProducts(filtered);
    showNotification(`${filtered.length} produit(s) trouvé(s)`);
}

// Filtrage des produits
function filterProducts() {
    const category = document.getElementById('categoryFilter').value;
    const sort = document.getElementById('sortFilter').value;
    
    let filtered = [...productsData];
    
    // Filtre par catégorie
    if (category) {
        filtered = filtered.filter(product => 
            category === 'fresh' ? product.state === 'fresh' :
            category === 'frozen' ? product.state === 'frozen' :
            category === 'bio' ? product.category === 'bio' : true
        );
    }
    
    // Tri
    if (sort === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'name_asc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    loadProducts(filtered);
}

// Filtrage des lots
function filterBatches() {
    const stateBtn = document.querySelector('.state-btn.active');
    const state = stateBtn ? stateBtn.getAttribute('data-state') : 'all';
    const age = document.getElementById('ageSelect').value;
    
    // Pour le démonstration, filtrons les lots existants
    let filtered = [...batchesData];
    
    if (state !== 'all') {
        filtered = filtered.filter(batch => batch.type === state);
    }
    
    if (age) {
        // Convertir l'âge en nombre pour la comparaison
        const ageNum = parseInt(age);
        filtered = filtered.filter(batch => {
            const batchAge = parseInt(batch.age);
            return batchAge >= ageNum && batchAge < ageNum + 10;
        });
    }
    
    // Mise à jour de l'affichage
    const batchesGrid = document.getElementById('batchesGrid');
    if (batchesGrid) {
        const batchCards = batchesGrid.querySelectorAll('.batch-card');
        batchCards.forEach(card => {
            const batchId = parseInt(card.getAttribute('data-id'));
            const batch = filtered.find(b => b.id === batchId);
            card.style.display = batch ? 'block' : 'none';
        });
    }
}

// Passer commande
function placeOrder() {
    if (selectedBatches.length === 0) {
        showNotification('Veuillez sélectionner au moins un lot', 'error');
        return;
    }
    
    // Vérifier la connexion
    const user = JSON.parse(localStorage.getItem('magnickis_user'));
    if (!user) {
        showNotification('Veuillez vous connecter pour passer commande', 'error');
        setTimeout(() => {
            window.location.href = 'login.html?redirect=batches';
        }, 2000);
        return;
    }
    
    // Enregistrer la commande
    const order = {
        id: Date.now(),
        userId: user.id,
        batches: selectedBatches,
        total: selectedBatches.reduce((sum, item) => sum + item.total, 0),
        date: new Date().toISOString(),
        status: 'pending',
        delivery: currentDelivery || 'pickup'
    };
    
    // Sauvegarder la commande
    const orders = JSON.parse(localStorage.getItem('magnickis_orders')) || [];
    orders.push(order);
    localStorage.setItem('magnickis_orders', JSON.stringify(orders));
    
    // Rediriger vers la livraison
    window.location.href = 'delivery.html?order=' + order.id;
}

// Traitement du paiement
function processPayment() {
    const user = JSON.parse(localStorage.getItem('magnickis_user'));
    if (!user) {
        showNotification('Veuillez vous connecter', 'error');
        return;
    }
    
    const totalAmount = selectedBatches.reduce((sum, item) => sum + item.total, 0);
    
    // Simulation de paiement
    showNotification('Traitement du paiement...', 'info');
    
    setTimeout(() => {
        // Simuler un dépôt
        const depositSuccess = Math.random() > 0.1; // 90% de succès
        
        if (depositSuccess) {
            // Simuler un rollback (10% de chance)
            const rollbackNeeded = Math.random() < 0.1;
            
            if (rollbackNeeded) {
                showNotification('Paiement échoué - Rollback effectué', 'error');
                // Simuler le rollback
                setTimeout(() => {
                    showNotification('Montant remboursé sur votre compte', 'success');
                }, 1500);
            } else {
                showNotification('Paiement réussi ! Commande confirmée.', 'success');
                
                // Mettre à jour le statut de la commande
                const orderId = new URLSearchParams(window.location.search).get('order');
                if (orderId) {
                    const orders = JSON.parse(localStorage.getItem('magnickis_orders')) || [];
                    const orderIndex = orders.findIndex(o => o.id == orderId);
                    if (orderIndex > -1) {
                        orders[orderIndex].status = 'paid';
                        orders[orderIndex].paymentDate = new Date().toISOString();
                        localStorage.setItem('magnickis_orders', JSON.stringify(orders));
                    }
                }
                
                // Rediriger vers le profil
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 2000);
            }
        } else {
            showNotification('Paiement refusé', 'error');
        }
    }, 2000);
}

// Afficher les détails du produit
function viewProductDetails(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    const modal = createModal(`
        <div class="product-detail-modal">
            <div class="detail-header">
                <h3>${product.name}</h3>
                <span class="detail-badge">${product.badge}</span>
            </div>
            <div class="detail-content">
                <div class="detail-image">
                    <i class="${product.image}"></i>
                </div>
                <div class="detail-info">
                    <p><strong>Description:</strong> ${product.description}</p>
                    <p><strong>Poids:</strong> ${product.weight}</p>
                    <p><strong>Âge:</strong> ${product.age}</p>
                    <p><strong>État:</strong> ${product.state === 'fresh' ? 'Frais' : 'Congelé'}</p>
                    <p><strong>Catégorie:</strong> ${product.category}</p>
                    <p><strong>Prix:</strong> <span class="detail-price">${product.price.toFixed(2)} €</span></p>
                </div>
            </div>
            <div class="detail-actions">
                <button onclick="addToCart(${product.id}); closeModal()">
                    <i class="fas fa-cart-plus"></i> Ajouter au panier
                </button>
            </div>
        </div>
    `);
    
    document.body.appendChild(modal);
}

// Créer une modale
function createModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal">
            <button class="modal-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
            ${content}
        </div>
    `;
    return modal;
}

// Fermer la modale
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) modal.remove();
}

// Afficher une notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = 'notification show';
    notification.style.background = type === 'error' ? 
        'linear-gradient(135deg, #dc3545, #c82333)' :
        type === 'info' ?
        'linear-gradient(135deg, #17a2b8, #138496)' :
        'linear-gradient(135deg, var(--primary-red), var(--primary-dark-red))';
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Changer de langue
function switchLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('magnickis_lang', lang);
    loadTranslations(lang);
    showNotification(`Langue changée: ${lang.toUpperCase()}`);
}

// Charger les traductions
async function loadTranslations(lang) {
    try {
        // Dans un projet réel, vous chargeriez ceci depuis un fichier
        const translations = {
            fr: {
                login: "Se Connecter",
                hero_title: "L'EXCELLENCE DANS CHAQUE POULET",
                hero_subtitle: "Élevés avec passion, nourris avec soin, livrés avec fierté",
                years_exp: "Ans d'expérience",
                happy_clients: "Clients satisfaits",
                chickens_year: "Poulets/an",
                explore_products: "Explorer nos produits",
                home: "Accueil",
                catalogue: "Catalogue",
                batches: "Lots",
                delivery: "Livraison",
                partners: "Partenaires",
                our_story: "Notre Histoire",
                story_desc: "Une tradition d'excellence depuis 1995",
                sustainable_title: "Agriculture Durable",
                sustainable_desc: "Nous pratiquons une agriculture responsable respectueuse de l'environnement et du bien-être animal.",
                quality_title: "Qualité Premium",
                quality_desc: "Des poulets élevés en plein air avec une alimentation naturelle pour une chair tendre et savoureuse.",
                delivery_title: "Livraison Garantie",
                delivery_desc: "Livraison rapide et sécurisée pour garantir la fraîcheur de nos produits.",
                perspectives: "Nos Perspectives",
                perspective1_title: "Énergie Solaire",
                perspective1_desc: "Installation de panneaux solaires pour une production 100% verte d'ici 2024.",
                perspective2_title: "Automatisation",
                perspective2_desc: "Modernisation de nos installations avec des systèmes automatisés intelligents.",
                perspective3_title: "Expansion",
                perspective3_desc: "Ouverture de nouveaux marchés en Europe avec des standards de qualité élevés.",
                products_catalogue: "Catalogue des Produits",
                search_placeholder: "Rechercher un produit...",
                search: "Rechercher",
                all_categories: "Toutes catégories",
                fresh: "Frais",
                frozen: "Congelé",
                organic: "Bio",
                price_low: "Prix croissant",
                price_high: "Prix décroissant",
                name_asc: "Nom A-Z",
                available_batches: "Lots Disponibles",
                batch_subtitle: "Choisissez parmi nos lots préparés avec soin",
                weight: "Poids",
                age: "Âge (jours)",
                state: "État",
                all: "Tous",
                quantity: "Quantité",
                units: "unités",
                order_summary: "Résumé de la commande",
                selected_batches: "Lots sélectionnés:",
                total_quantity: "Quantité totale:",
                total_amount: "Montant total:",
                place_order: "Passer la commande",
                delivery_options: "Options de Livraison",
                pickup: "Retrait en entrepôt",
                pickup_desc: "Venez récupérer votre commande directement à notre entrepôt",
                pickup_benefit1: "Gratuit",
                pickup_benefit2: "Disponible 24h/24",
                pickup_benefit3: "Service rapide",
                choose_pickup: "Choisir le retrait",
                home_delivery: "Livraison à domicile",
                home_delivery_desc: "Nous livrons directement chez vous en 24-48h",
                home_benefit1: "Livraison express",
                home_benefit2: "Suivi en temps réel",
                home_benefit3: "Emballage isotherme",
                from: "À partir de",
                choose_delivery: "Choisir la livraison",
                payment_simulation: "Simulation de Paiement",
                credit_card: "Carte bancaire",
                transfer: "Virement",
                card_number: "Numéro de carte",
                expiry_date: "Date d'expiration",
                cvc: "CVC",
                amount_to_pay: "Montant à payer:",
                pay_now: "Payer maintenant",
                our_partners: "Nos Partenaires",
                partner1_desc: "Fournisseur d'aliments biologiques certifiés",
                partner2_desc: "Services de logistique et transport réfrigéré",
                partner3_desc: "Contrôle qualité et analyses sanitaires",
                partner4_desc: "Distribution grande surface premium",
                footer_motto: "L'excellence dans chaque poulet depuis 1995",
                quick_links: "Liens rapides",
                about_us: "À propos",
                products: "Produits",
                contact: "Contact",
                follow_us: "Suivez-nous",
                rights_reserved: "Tous droits réservés."
            },
            en: {
                login: "Login",
                hero_title: "EXCELLENCE IN EVERY CHICKEN",
                hero_subtitle: "Raised with passion, fed with care, delivered with pride",
                years_exp: "Years of experience",
                happy_clients: "Happy clients",
                chickens_year: "Chickens/year",
                explore_products: "Explore our products",
                home: "Home",
                catalogue: "Catalogue",
                batches: "Batches",
                delivery: "Delivery",
                partners: "Partners",
                our_story: "Our Story",
                story_desc: "A tradition of excellence since 1995",
                sustainable_title: "Sustainable Agriculture",
                sustainable_desc: "We practice responsible farming that respects the environment and animal welfare.",
                quality_title: "Premium Quality",
                quality_desc: "Free-range chickens with natural feeding for tender and flavorful meat.",
                delivery_title: "Guaranteed Delivery",
                delivery_desc: "Fast and secure delivery to ensure the freshness of our products.",
                perspectives: "Our Perspectives",
                perspective1_title: "Solar Energy",
                perspective1_desc: "Installation of solar panels for 100% green production by 2024.",
                perspective2_title: "Automation",
                perspective2_desc: "Modernization of our facilities with intelligent automated systems.",
                perspective3_title: "Expansion",
                perspective3_desc: "Opening new markets in Europe with high quality standards.",
                products_catalogue: "Products Catalogue",
                search_placeholder: "Search for a product...",
                search: "Search",
                all_categories: "All categories",
                fresh: "Fresh",
                frozen: "Frozen",
                organic: "Organic",
                price_low: "Price low to high",
                price_high: "Price high to low",
                name_asc: "Name A-Z",
                available_batches: "Available Batches",
                batch_subtitle: "Choose from our carefully prepared batches",
                weight: "Weight",
                age: "Age (days)",
                state: "State",
                all: "All",
                quantity: "Quantity",
                units: "units",
                order_summary: "Order Summary",
                selected_batches: "Selected batches:",
                total_quantity: "Total quantity:",
                total_amount: "Total amount:",
                place_order: "Place Order",
                delivery_options: "Delivery Options",
                pickup: "Warehouse Pickup",
                pickup_desc: "Come pick up your order directly at our warehouse",
                pickup_benefit1: "Free",
                pickup_benefit2: "Available 24/7",
                pickup_benefit3: "Fast service",
                choose_pickup: "Choose Pickup",
                home_delivery: "Home Delivery",
                home_delivery_desc: "We deliver directly to you within 24-48 hours",
                home_benefit1: "Express delivery",
                home_benefit2: "Real-time tracking",
                home_benefit3: "Insulated packaging",
                from: "From",
                choose_delivery: "Choose Delivery",
                payment_simulation: "Payment Simulation",
                credit_card: "Credit Card",
                transfer: "Transfer",
                card_number: "Card Number",
                expiry_date: "Expiry Date",
                cvc: "CVC",
                amount_to_pay: "Amount to pay:",
                pay_now: "Pay Now",
                our_partners: "Our Partners",
                partner1_desc: "Certified organic feed supplier",
                partner2_desc: "Logistics and refrigerated transport services",
                partner3_desc: "Quality control and sanitary analysis",
                partner4_desc: "Premium supermarket distribution",
                footer_motto: "Excellence in every chicken since 1995",
                quick_links: "Quick Links",
                about_us: "About Us",
                products: "Products",
                contact: "Contact",
                follow_us: "Follow Us",
                rights_reserved: "All rights reserved."
            },
            es: {
                login: "Iniciar Sesión",
                hero_title: "EXCELENCIA EN CADA POLLO",
                hero_subtitle: "Criados con pasión, alimentados con cuidado, entregados con orgullo",
                years_exp: "Años de experiencia",
                happy_clients: "Clientes satisfechos",
                chickens_year: "Pollos/año",
                explore_products: "Explorar productos",
                home: "Inicio",
                catalogue: "Catálogo",
                batches: "Lotes",
                delivery: "Entrega",
                partners: "Socios",
                our_story: "Nuestra Historia",
                story_desc: "Una tradición de excelencia desde 1995",
                sustainable_title: "Agricultura Sostenible",
                sustainable_desc: "Practicamos una agricultura responsable que respeta el medio ambiente y el bienestar animal.",
                quality_title: "Calidad Premium",
                quality_desc: "Pollos criados al aire libre con alimentación natural para una carne tierna y sabrosa.",
                delivery_title: "Entrega Garantizada",
                delivery_desc: "Entrega rápida y segura para garantizar la frescura de nuestros productos.",
                perspectives: "Nuestras Perspectivas",
                perspective1_title: "Energía Solar",
                perspective1_desc: "Instalación de paneles solares para una producción 100% verde para 2024.",
                perspective2_title: "Automatización",
                perspective2_desc: "Modernización de nuestras instalaciones con sistemas automatizados inteligentes.",
                perspective3_title: "Expansión",
                perspective3_desc: "Apertura de nuevos mercados en Europa con altos estándares de calidad.",
                products_catalogue: "Catálogo de Productos",
                search_placeholder: "Buscar un producto...",
                search: "Buscar",
                all_categories: "Todas las categorías",
                fresh: "Fresco",
                frozen: "Congelado",
                organic: "Orgánico",
                price_low: "Precio menor a mayor",
                price_high: "Precio mayor a menor",
                name_asc: "Nombre A-Z",
                available_batches: "Lotes Disponibles",
                batch_subtitle: "Elija entre nuestros lotes cuidadosamente preparados",
                weight: "Peso",
                age: "Edad (días)",
                state: "Estado",
                all: "Todos",
                quantity: "Cantidad",
                units: "unidades",
                order_summary: "Resumen del Pedido",
                selected_batches: "Lotes seleccionados:",
                total_quantity: "Cantidad total:",
                total_amount: "Importe total:",
                place_order: "Realizar Pedido",
                delivery_options: "Opciones de Entrega",
                pickup: "Recogida en Almacén",
                pickup_desc: "Recoja su pedido directamente en nuestro almacén",
                pickup_benefit1: "Gratuito",
                pickup_benefit2: "Disponible 24/7",
                pickup_benefit3: "Servicio rápido",
                choose_pickup: "Elegir Recogida",
                home_delivery: "Entrega a Domicilio",
                home_delivery_desc: "Entregamos directamente en 24-48 horas",
                home_benefit1: "Entrega exprés",
                home_benefit2: "Seguimiento en tiempo real",
                home_benefit3: "Embalaje isotérmico",
                from: "Desde",
                choose_delivery: "Elegir Entrega",
                payment_simulation: "Simulación de Pago",
                credit_card: "Tarjeta de Crédito",
                transfer: "Transferencia",
                card_number: "Número de Tarjeta",
                expiry_date: "Fecha de Vencimiento",
                cvc: "CVC",
                amount_to_pay: "Importe a pagar:",
                pay_now: "Pagar Ahora",
                our_partners: "Nuestros Socios",
                partner1_desc: "Proveedor de alimentos orgánicos certificados",
                partner2_desc: "Servicios de logística y transporte refrigerado",
                partner3_desc: "Control de calidad y análisis sanitario",
                partner4_desc: "Distribución en supermercados premium",
                footer_motto: "Excelencia en cada pollo desde 1995",
                quick_links: "Enlaces Rápidos",
                about_us: "Acerca de",
                products: "Productos",
                contact: "Contacto",
                follow_us: "Síguenos",
                rights_reserved: "Todos los derechos reservados."
            }
        };

        const langTranslations = translations[lang] || translations.fr;
        
        // Appliquer les traductions
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (langTranslations[key]) {
                if (element.tagName === 'INPUT' && element.type === 'text') {
                    element.placeholder = langTranslations[key];
                } else {
                    element.textContent = langTranslations[key];
                }
            }
        });
        
        // Mettre à jour le sélecteur de langue
        const currentLang = document.getElementById('currentLang');
        if (currentLang) {
            const flagUrl = `https://flagcdn.com/w20/${lang === 'en' ? 'gb' : lang}.png`;
            currentLang.innerHTML = `
                <img src="${flagUrl}" alt="${lang.toUpperCase()}">
                <span>${lang.toUpperCase()}</span>
                <i class="fas fa-chevron-down"></i>
            `;
        }
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('Une erreur est survenue', 'error');
});

// Exporter les fonctions nécessaires globalement
window.addToCart = addToCart;
window.viewProductDetails = viewProductDetails;
window.selectBatch = selectBatch;
window.closeModal = closeModal;