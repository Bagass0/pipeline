const express = require('express');
const app = express();
const port = 3000;

// Liste des URL publiques
let publicUrls = [
    '/url1',
    '/url2',
    '/login'
];

// Middleware pour afficher les en-têtes de requête
app.use((req, res, next) => {
    console.log("Headers:", req.headers);
    next();
});

// Middleware de firewall
function firewall(req, res, next) {
    const requestedUrl = req.url;

    if (publicUrls.includes(requestedUrl)) { // Si l'URL est publique
        next(); // Transférer la requête au endpoint directement
    } else { // Si l'URL est restreinte
        // Vérifier si le token est fourni dans les en-têtes de la requête
        const token = req.headers['authorization'];
        if (token && token === 'Bearer 42') { // Vérifier si le token est correct (ici codé en dur)
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
    // Générer un token aléatoire (à améliorer pour une utilisation en production)
    const token = Math.random().toString(36).substring(2);
    res.json({ token: token }); // Renvoyer le token au client
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
