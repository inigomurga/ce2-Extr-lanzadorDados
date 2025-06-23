const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

let diceHistory = [];

app.post('/roll', (req, res) => {
    const { numDice, numSides } = req.body;
    if (
        typeof numDice !== 'number' || numDice < 1 || numDice > 20 ||
        typeof numSides !== 'number' || numSides < 2 || numSides > 100
    ) {
        return res.status(400).json({ error: 'Parámetros inválidos' });
    }
    const results = [];
    for (let i = 0; i < numDice; i++) {
        results.push(Math.floor(Math.random() * numSides) + 1);
    }
    const stats = {
        sum: results.reduce((a, b) => a + b, 0),
        avg: (results.reduce((a, b) => a + b, 0) / results.length).toFixed(2),
        min: Math.min(...results),
        max: Math.max(...results)
    };
    const record = { numDice, numSides, results };
    diceHistory.push(record);
    res.json({ results, stats });
});

app.get('/history', (req, res) => {
    res.json(diceHistory);
});

app.post('/clear', (req, res) => {
    diceHistory = [];
    res.json({ ok: true });
});

app.get('/csv', (req, res) => {
    const headers = ['#', 'Dados', 'Caras', 'Resultados', 'Suma', 'Promedio', 'Mín', 'Máx'];
    const rows = [headers.join(',')];
    diceHistory.forEach((item, idx) => {
        const sum = item.results.reduce((a, b) => a + b, 0);
        const avg = (sum / item.results.length).toFixed(2);
        const min = Math.min(...item.results);
        const max = Math.max(...item.results);
        rows.push([
            idx + 1,
            item.numDice,
            item.numSides,
            `"${item.results.join(', ')}"`,
            sum,
            avg,
            min,
            max
        ].join(','));
    });
    res.header('Content-Type', 'text/csv');
    res.attachment('historial_dados.csv');
    res.send(rows.join('\n'));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor dados escuchando en puerto ${PORT}`));
