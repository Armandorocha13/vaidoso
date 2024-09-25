class FinancialCalculator {
    constructor(investmentRate = 0.5, expenseRate = 0.25) {
        this.investmentRate = investmentRate; // Porcentagem a ser investida
        this.expenseRate = expenseRate; // Porcentagem a ser gasta
        this.totalEntradaMensal = 0; // Inicializar total de entrada mensal
        this.financialHistory = JSON.parse(localStorage.getItem('financialHistory')) || []; // Recuperar histórico do localStorage
    }

    adicionarValorDiario(valorDiario) {
        this.totalEntradaMensal += valorDiario; // Adicionar o valor diário
    }

    calcularInvestimentosMensais() {
        return this.totalEntradaMensal * this.investmentRate; // Porcentagem do total de entradas
    }

    calcularArrecadacaoAnual() {
        return this.totalEntradaMensal * 12; // Total do ano
    }

    calcularGastosAnuais() {
        const arrecadacaoAnual = this.calcularArrecadacaoAnual();
        return arrecadacaoAnual * this.expenseRate; // Porcentagem do total de arrecadação
    }

    calcularTudo() {
        const investimentosMensais = this.calcularInvestimentosMensais();
        const arrecadacaoAnual = this.calcularArrecadacaoAnual();
        const gastosAnuais = this.calcularGastosAnuais();

        return {
            totalEntradaMensal: this.totalEntradaMensal,
            investimentosMensais,
            arrecadacaoAnual,
            gastosAnuais
        };
    }

    adicionarHistorico(mes, entradaMensal, investimentosMensais) {
        // Verificar se o mês já existe no histórico
        const existingRecord = this.financialHistory.find(record => record.mes === mes);
        if (existingRecord) {
            // Atualizar valores existentes
            existingRecord.entradaMensal += entradaMensal;
            existingRecord.investimentosMensais += investimentosMensais;
        } else {
            // Adicionar novo registro
            this.financialHistory.push({ mes, entradaMensal, investimentosMensais });
        }
        localStorage.setItem('financialHistory', JSON.stringify(this.financialHistory)); // Atualizar localStorage
    }

    calcularTotalAcumulado() {
        return this.financialHistory.reduce((acc, item) => acc + item.entradaMensal, 0).toFixed(2); // Calcular total acumulado
    }

    atualizarTabela(mesSelecionado = null) {
        const tbody = document.getElementById('financialHistory');
        tbody.innerHTML = ''; // Limpar a tabela existente

        const filteredHistory = mesSelecionado
            ? this.financialHistory.filter(record => record.mes === mesSelecionado) // Filtrar pelo mês selecionado
            : this.financialHistory;

        filteredHistory.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.mes}</td>
                <td>${record.entradaMensal.toFixed(2)}</td>
                <td>${record.investimentosMensais.toFixed(2)}</td>
            `;
            tbody.appendChild(row);
        });

        document.getElementById('totalAcumulado').innerText = this.calcularTotalAcumulado(); // Atualizar total acumulado
    }
}

// Recuperar o valor diário do localStorage
let valorDiarioArmazenado = parseFloat(localStorage.getItem('valorDiario')) || 0;

// Inicializar o formulário com o valor diário armazenado
document.getElementById('valorDiario').value = valorDiarioArmazenado;

// Inicialização do gráfico
const financialData = {
    labels: ['Entrada Mensal', 'Investimentos Mensais', 'Arrecadação Anual', 'Gastos Anuais'],
    datasets: [{
        label: 'Desempenho Financeiro',
        data: [0, 0, 0, 0],  // Valores iniciais
        backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
    }]
};

const config = {
    type: 'bar',
    data: financialData,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
};

const financialChart = new Chart(document.getElementById('financialChart'), config);

// Lógica do botão "Confirmar"
document.getElementById('confirmButton').addEventListener('click', function() {
    const valorDiario = parseFloat(document.getElementById('valorDiario').value) || 0;

    // Atualizar o valor diário armazenado no localStorage
    localStorage.setItem('valorDiario', valorDiario);

    // Criar uma instância do FinancialCalculator
    const calculator = new FinancialCalculator();

    // Adicionar o valor diário
    calculator.adicionarValorDiario(valorDiario);

    // Calcular novos valores
    const { totalEntradaMensal, investimentosMensais, arrecadacaoAnual, gastosAnuais } = calculator.calcularTudo();

    // Atualizar os inputs
    document.getElementById('entradaMensal').value = totalEntradaMensal.toFixed(2);
    document.getElementById('investimentosMensais').value = investimentosMensais.toFixed(2);
    document.getElementById('arrecadacaoAnual').value = arrecadacaoAnual.toFixed(2);
    document.getElementById('gastosAnuais').value = gastosAnuais.toFixed(2);

    // Adicionar histórico mensal
    const mesAtual = new Date().toLocaleString('default', { month: 'long' });
    calculator.adicionarHistorico(mesAtual, totalEntradaMensal, investimentosMensais);

    // Atualizar a tabela de histórico
    calculator.atualizarTabela();

    // Atualizar o gráfico
    updateChart(totalEntradaMensal, investimentosMensais, arrecadacaoAnual, gastosAnuais);
});

// Função para atualizar o gráfico
function updateChart(totalEntradaMensal, investimentosMensais, arrecadacaoAnual, gastosAnuais) {
    financialChart.data.datasets[0].data = [totalEntradaMensal, investimentosMensais, arrecadacaoAnual, gastosAnuais];
    financialChart.update();
}

// Função para atualizar histórico e gráfico com base no mês selecionado
function atualizarHistoricoEGrafico() {
    const mesSelecionado = document.getElementById('mesSelecionado').value;
    const calculator = new FinancialCalculator();
    calculator.atualizarTabela(mesSelecionado);
    
    // Atualizar o gráfico baseado no mês selecionado
    const selectedRecord = calculator.financialHistory.find(record => record.mes === mesSelecionado);
    if (selectedRecord) {
        const { entradaMensal, investimentosMensais } = selectedRecord;
        updateChart(entradaMensal, investimentosMensais, calculator.calcularArrecadacaoAnual(), calculator.calcularGastosAnuais());
    } else {
        updateChart(0, 0, 0, 0); // Limpar gráfico se não houver dados
    }
}

// Inicializar a tabela de histórico ao carregar
const initialCalculator = new FinancialCalculator();
initialCalculator.atualizarTabela();
