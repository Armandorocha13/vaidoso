
    // Dados financeiros para o gráfico
    const financialData = {
        labels: ['Entrada Mensal', 'Investimentos Mensais', 'Arrecadação Anual', 'Gastos Anuais'],
        datasets: [{
            label: 'Desempenho Financeiro',
            data: [100000, 50000, 1200000, 300000],  // Valores para o gráfico
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)',  // Cor para Entrada Mensal
                'rgba(54, 162, 235, 0.2)',  // Cor para Investimentos Mensais
                'rgba(153, 102, 255, 0.2)', // Cor para Arrecadação Anual
                'rgba(255, 99, 132, 0.2)'   // Cor para Gastos Anuais
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

    // Configurações do gráfico
    const config = {
        type: 'bar',  // Tipo de gráfico (pode ser 'line', 'pie', etc.)
        data: financialData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    const financialChart = new Chart(
        document.getElementById('financialChart'),
        config
    );

    // Mostrar conteúdo do gráfico ao clicar no "Analytics"
    document.getElementById('analytics-tab').addEventListener('click', function () {
        const content = document.getElementById('analytics-content');
        if (content.style.display === "none") {
            content.style.display = "block";
        } else {
            content.style.display = "none";
        }
    });

