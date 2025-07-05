import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read data
const readData = async () => {
    const data = await fs.readFile('./properties.json', 'utf-8');
    return JSON.parse(data);
};

// --- API Routes ---

// GET all properties with filtering
app.get('/api/properties', async (req, res) => {
    try {
        let properties = await readData();
        const { type, minPrice, maxPrice, district } = req.query;

        if (type && type !== 'all') {
            properties = properties.filter(p => p.type === type);
        }
        if (district && district !== 'all') {
            properties = properties.filter(p => p.location.district === district);
        }
        if (minPrice) {
            properties = properties.filter(p => p.price >= parseInt(minPrice));
        }
        if (maxPrice) {
            properties = properties.filter(p => p.price <= parseInt(maxPrice));
        }

        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: "Ошибка сервера" });
    }
});

// GET a single property by ID
app.get('/api/properties/:id', async (req, res) => {
    try {
        const properties = await readData();
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

// A fake auth route
app.post('/api/login', (req, res) => {
    // In a real app, you'd check username/password
    res.json({ token: 'fake-jwt-token', message: 'Вход выполнен успешно' });
});


app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
