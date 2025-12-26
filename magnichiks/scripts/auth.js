// Données des utilisateurs (simulation)
const users = JSON.parse(localStorage.getItem('magnickis_users')) || [
    {
        id: 1,
        firstName: 'Admin',
        lastName: 'Magnickis',
        email: 'admin@magnickis.fr',
        password: 'admin123',
        phone: '+237 XXX XXX XXX',
        type: 'admin',
        createdAt: new Date().toISOString()
    }
];

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    setupEventListeners();
});

// Initialisation de l'authentification
function initializeAuth() {
    // Vérifier si l'utilisateur est déjà connecté
    const currentUser = JSON.parse(localStorage.getItem('magnickis_user'));
    if (currentUser) {
        const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
        if (redirectUrl) {
            window.location.href = redirectUrl + '.html';
        } else {
            window.location.href = currentUser.type === 'admin' ? 'admin.html' : 'profile.html';
        }
    }
}

// Configuration des événements
function setupEventListeners() {
    // Connexion
    const loginForm = document.getElementById('loginFormElement');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Inscription
    const registerForm = document.getElementById('registerFormElement');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Mot de passe oublié
    const forgotForm = document.getElementById('forgotFormElement');
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotPassword);
    }
    
    // Affichage/masquage du mot de passe
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const passwordInput = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
    
    // Liens "Mot de passe oublié"
    const forgotLinks = document.querySelectorAll('.forgot-password');
    forgotLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showForgotPassword();
        });
    });
}

// Gestion de la connexion
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // Validation
    if (!email || !password) {
        showNotification('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    // Rechercher l'utilisateur
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        showNotification('Email ou mot de passe incorrect', 'error');
        return;
    }
    
    // Connecter l'utilisateur
    loginUser(user, rememberMe);
}

// Gestion de l'inscription
function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const userType = document.getElementById('userType').value;
    const acceptTerms = document.getElementById('acceptTerms').checked;
    
    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    if (!acceptTerms) {
        showNotification('Veuillez accepter les conditions d\'utilisation', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showNotification('Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Le mot de passe doit contenir au moins 6 caractères', 'error');
        return;
    }
    
    // Vérifier si l'email existe déjà
    if (users.some(u => u.email === email)) {
        showNotification('Cet email est déjà utilisé', 'error');
        return;
    }
    
    // Créer l'utilisateur
    const newUser = {
        id: Date.now(),
        firstName,
        lastName,
        email,
        phone,
        password, // Dans un projet réel, vous hashriez le mot de passe
        type: userType,
        createdAt: new Date().toISOString(),
        lastLogin: null
    };
    
    // Ajouter l'utilisateur
    users.push(newUser);
    localStorage.setItem('magnickis_users', JSON.stringify(users));
    
    // Connecter l'utilisateur
    loginUser(newUser, true);
}

// Gestion du mot de passe oublié
function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value.trim();
    
    if (!email) {
        showNotification('Veuillez entrer votre email', 'error');
        return;
    }
    
    // Simuler l'envoi d'email
    showNotification('Un email de réinitialisation a été envoyé', 'info');
    
    // Réinitialiser le formulaire
    document.getElementById('forgotFormElement').reset();
    
    // Revenir à la connexion après 2 secondes
    setTimeout(() => {
        showLogin();
    }, 2000);
}

// Connecter l'utilisateur
function loginUser(user, rememberMe) {
    // Mettre à jour la dernière connexion
    user.lastLogin = new Date().toISOString();
    
    // Sauvegarder l'utilisateur dans localStorage
    localStorage.setItem('magnickis_user', JSON.stringify(user));
    
    // Mettre à jour la liste des utilisateurs
    localStorage.setItem('magnickis_users', JSON.stringify(users));
    
    // Notification de succès
    showNotification(`Bienvenue ${user.firstName} !`, 'success');
    
    // Redirection
    setTimeout(() => {
        const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
        if (redirectUrl) {
            window.location.href = redirectUrl + '.html';
        } else {
            window.location.href = user.type === 'admin' ? 'admin.html' : 'profile.html';
        }
    }, 1500);
}

// Afficher le formulaire de connexion
function showLogin() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('forgotForm').classList.remove('active');
}

// Afficher le formulaire d'inscription
function showRegister() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('forgotForm').classList.remove('active');
}

// Afficher le formulaire de mot de passe oublié
function showForgotPassword() {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('registerForm').classList.remove('active');
    document.getElementById('forgotForm').classList.add('active');
}

// Afficher une notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('authNotification');
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

// Exporter les fonctions globalement
window.showLogin = showLogin;
window.showRegister = showRegister;
window.showForgotPassword = showForgotPassword;