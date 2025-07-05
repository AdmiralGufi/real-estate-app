import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
    origin: [
        'https://admiralgufi.github.io',
        'https://real-estate-app-static.onrender.com',
        'https://admiralgufi.github.io/real-estate-app',
        'https://admiralgufi.github.io/real-estate-app/',
        'https://real-estate-app-frontend.onrender.com',
        'https://real-estate-app-frontend-xyz.onrender.com',
        'https://real-estate-app-front-1hpo.onrender.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

const propertiesFilePath = path.join(__dirname, 'properties.json');

const readProperties = () => {
    try {
        if (fs.existsSync(propertiesFilePath)) {
            const data = fs.readFileSync(propertiesFilePath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Error reading or parsing properties.json:', error);
    }
    return []; // Возвращаем пустой массив в случае ошибки или отсутствия файла
};

const writeProperties = (data) => {
    try {
        fs.writeFileSync(propertiesFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error writing to properties.json:', error);
    }
};

// Root route for health check
app.get('/', (req, res) => {
    res.json({ 
        message: 'Real Estate API is running!', 
        endpoints: [
            'GET /api/properties',
            'GET /api/properties/:id',
            'POST /api/properties',
            'PUT /api/properties/:id',
            'DELETE /api/properties/:id'
        ]
    });
});

// --- API Routes ---

// GET all properties with filtering
app.get('/api/properties', (req, res) => {
    try {
        const properties = readProperties();
        res.json(properties);
    } catch (error) {
        res.status(500).json({ message: "Error reading properties data" });
    }
});

// GET a single property by ID
app.get('/api/properties/:id', (req, res) => {
    try {
        const properties = readProperties();
        const property = properties.find(p => p.id === parseInt(req.params.id));
        if (property) {
            res.status(200).json(property);
        } else {
            res.status(404).json({ message: 'Объект не найден' });
        }
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// POST a new property
app.post('/api/properties', async (req, res) => {
    try {
        const properties = readProperties();
        const newProperty = req.body;

        // Generate a new ID
        const newId = properties.length > 0 ? Math.max(...properties.map(p => p.id)) + 1 : 1;
        newProperty.id = newId;

        properties.push(newProperty);

        // Write data back to the file
        writeProperties(properties);

        res.status(201).json(newProperty);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера при создании объекта" });
    }
});

// PUT update a property
app.put('/api/properties/:id', async (req, res) => {
    try {
        const properties = readProperties();
        const propertyId = parseInt(req.params.id);
        const updatedProperty = req.body;
        
        const propertyIndex = properties.findIndex(p => p.id === propertyId);
        if (propertyIndex === -1) {
            return res.status(404).json({ message: 'Объект не найден' });
        }
        
        properties[propertyIndex] = { ...properties[propertyIndex], ...updatedProperty, id: propertyId };
        
        writeProperties(properties);
        
        res.status(200).json(properties[propertyIndex]);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера при обновлении объекта" });
    }
});

// DELETE a property
app.delete('/api/properties/:id', async (req, res) => {
    try {
        const properties = readProperties();
        const propertyId = parseInt(req.params.id);
        
        const propertyIndex = properties.findIndex(p => p.id === propertyId);
        if (propertyIndex === -1) {
            return res.status(404).json({ message: 'Объект не найден' });
        }
        
        const deletedProperty = properties.splice(propertyIndex, 1)[0];
        
        writeProperties(properties);
        
        res.status(200).json({ message: 'Объект удален', property: deletedProperty });
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера при удалении объекта" });
    }
});

// A fake auth route
app.post('/api/login', (req, res) => {
    // In a real app, you'd check username/password
    res.json({ token: 'fake-jwt-token', message: 'Вход выполнен успешно' });
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
