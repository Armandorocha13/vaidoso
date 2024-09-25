
    const athleteDataKey = 'athleteData';
    let athleteData = JSON.parse(localStorage.getItem(athleteDataKey)) || [];

    document.getElementById('athleteForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const athleteName = document.getElementById('athleteName').value;
        const athleteWhatsApp = document.getElementById('athleteWhatsApp').value;
        const paymentMonth = document.getElementById('paymentMonth').value;
        const feeType = document.getElementById('feeType').value;
        const athletePayment = document.getElementById('athletePayment').value;

        const athlete = { name: athleteName, whatsapp: athleteWhatsApp, month: paymentMonth, fee: feeType, payment: athletePayment };
        athleteData.push(athlete);
        localStorage.setItem(athleteDataKey, JSON.stringify(athleteData));
        addAthleteToTable(athlete);
        this.reset();
    });

    function addAthleteToTable(athlete) {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${athlete.name}</td>
            <td>${athlete.whatsapp}</td>
            <td>${athlete.month}</td>
            <td>${athlete.fee}</td>
            <td>${athlete.payment}</td>
            <td>
                <button class="btn btn-info btn-sm" onclick="showPaymentHistory('${athlete.name}')">Histórico</button>
            </td>
        `;
        document.getElementById('athleteTableBody').appendChild(newRow);
    }

    function loadAthletes() {
        athleteData.forEach(addAthleteToTable);
    }

    document.getElementById('searchAthlete').addEventListener('input', function() {
        const searchValue = this.value.toLowerCase();
        const filteredAthletes = athleteData.filter(athlete => athlete.name.toLowerCase().includes(searchValue));
        
        document.getElementById('athleteTableBody').innerHTML = '';
        filteredAthletes.forEach(addAthleteToTable);
    });

    function showPaymentHistory(athleteName) {
        const paymentHistoryList = document.getElementById('paymentHistoryList');
        paymentHistoryList.innerHTML = ''; // Limpa a lista antes de adicionar

        const athletePayments = athleteData.filter(athlete => athlete.name === athleteName);
        athletePayments.forEach(payment => {
            const listItem = document.createElement('li');
            listItem.textContent = `Mês: ${payment.month}, Tipo de Taxa: ${payment.fee}, Status: ${payment.payment}`;
            paymentHistoryList.appendChild(listItem);
        });

        $('#paymentHistoryModal').modal('show'); // Mostra o modal
    }

    loadAthletes();
