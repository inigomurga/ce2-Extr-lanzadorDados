const API_URL = 'http://localhost:3000';

function getStats(arr) {
    if (!arr.length) return { sum: 0, avg: 0, min: 0, max: 0 };
    const sum = arr.reduce((a, b) => a + b, 0);
    const avg = (sum / arr.length).toFixed(2);
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    return { sum, avg, min, max };
}

async function renderHistory() {
    const tbody = document.querySelector('#historyTable tbody');
    tbody.innerHTML = '';
    const res = await fetch(`${API_URL}/history`);
    const diceHistory = await res.json();
    let allResults = [];
    diceHistory.forEach((item, idx) => {
        allResults = allResults.concat(item.results);
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td>${item.numDice}</td>
            <td>${item.numSides}</td>
            <td>${item.results.join(', ')}</td>
        `;
        tbody.appendChild(tr);
    });

    const statsDivId = 'globalStats';
    let statsDiv = document.getElementById(statsDivId);
    if (!statsDiv) {
        statsDiv = document.createElement('div');
        statsDiv.id = statsDivId;
        statsDiv.style.marginTop = '15px';
        document.getElementById('historyStats').appendChild(statsDiv);
    }
    if (allResults.length) {
        const stats = getStats(allResults);
        statsDiv.innerHTML = `
            <strong>Estadísticas globales:</strong><br>
            <strong>Suma:</strong> ${stats.sum} |
            <strong>Promedio:</strong> ${stats.avg} |
            <strong>Mín:</strong> ${stats.min} |
            <strong>Máx:</strong> ${stats.max}
        `;
    } else {
        statsDiv.innerHTML = '';
    }
}

document.getElementById('rollDice').addEventListener('click', async () => {
    const numDice = parseInt(document.getElementById('numDice').value, 10);
    const numSides = parseInt(document.getElementById('numSides').value, 10);
    const resultsDiv = document.getElementById('diceResults');

    if (isNaN(numDice) || numDice < 1 || numDice > 20) {
        resultsDiv.innerHTML = '<span style="color:red;">Número de dados inválido (1-20).</span>';
        return;
    }
    if (isNaN(numSides) || numSides < 2 || numSides > 100) {
        resultsDiv.innerHTML = '<span style="color:red;">Número de caras inválido (2-100).</span>';
        return;
    }

    const res = await fetch(`${API_URL}/roll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numDice, numSides })
    });
    if (!res.ok) {
        resultsDiv.innerHTML = '<span style="color:red;">Error en el servidor.</span>';
        return;
    }
    const data = await res.json();
    resultsDiv.innerHTML = `<strong>Resultados:</strong> ${data.results.join(', ')}`;
    renderHistory();
});

document.getElementById('clearHistory').addEventListener('click', async () => {
    await fetch(`${API_URL}/clear`, { method: 'POST' });
    renderHistory();
});

document.getElementById('downloadCSV').addEventListener('click', () => {
    window.open(`${API_URL}/csv`, '_blank');
});

// Tabs/secciones
document.getElementById('tabSimulador').addEventListener('click', () => {
    document.getElementById('diceSimulatorSection').style.display = 'block';
    document.getElementById('historyStatsSection').style.display = 'none';
    document.getElementById('tabSimulador').classList.add('active');
    document.getElementById('tabHistorial').classList.remove('active');
});

document.getElementById('tabHistorial').addEventListener('click', () => {
    document.getElementById('diceSimulatorSection').style.display = 'none';
    document.getElementById('historyStatsSection').style.display = 'block';
    document.getElementById('tabSimulador').classList.remove('active');
    document.getElementById('tabHistorial').classList.add('active');
});


renderHistory();
