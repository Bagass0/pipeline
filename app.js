// app.js
const express = require('express');
const app = express();
const port = 3000;

const { getRegisteredUsers } = require('./inMemoryUserRepository');

// Middleware pour afficher les en-têtes de requête
app.use((req, res, next) => {
    console.log("Headers:", req.headers);
    next();
});

// Middleware de firewall
const authenticatedUsers = {}; // Objet pour stocker les utilisateurs authentifiés

function firewall(req, res, next) {
    const requestedUrl = req.url;

    if (publicUrls.includes(requestedUrl)) { // Si l'URL est publique
        next(); // Transférer la requête au endpoint directement
    } else { // Si l'URL est restreinte
        // Vérifier si le token est fourni dans les en-têtes de la requête
        const token = req.headers['authorization'];
        if (token && authenticatedUsers[token]) { // Vérifier si le token est valide
            next(); // Transférer la requête au endpoint
        } else {
            // Renvoyer une erreur 403 si le token est incorrect ou non fourni
            res.status(403).send("Accès non autorisé");
        }
    }
}

// Activer le middleware de firewall
app.use(firewall);

// Route de login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const registeredUsers = getRegisteredUsers();
    
    // Vérifier les identifiants de l'utilisateur
    const user = registeredUsers.find(user => user.email === email && user.password === password);
    if (user) {
        // Générer un token aléatoire (à améliorer pour une utilisation en production)
        const token = Math.random().toString(36).substring(2);
        authenticatedUsers[token] = { email: user.email }; // Stocker l'utilisateur authentifié
        res.json({ token: token }); // Renvoyer le token au client
    } else {
        // Renvoyer une erreur 403 si les identifiants sont invalides
        res.status(403).send("Identifiants invalides");
    }
});

// Routes publiques
app.get('/url1', (req, res) => {
    res.send('Hello World from /url1!');
});

app.get('/url2', (req, res) => {
    res.send('Hello World from /url2!');
});

// Routes privées
app.get('/private/url1', (req, res) => {
    res.send('Hello, it is private!');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});