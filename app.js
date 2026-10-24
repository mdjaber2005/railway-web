// 1. Expanded Database with Seats and Distance-based Prices
let trainDatabase = [
    { id: 1, name: "Subarna Express", from: "Dhaka", to: "Chattogram", dep: "15:00", arr: "20:30", price: 450, seats: 120 },
    { id: 2, name: "Sonar Bangla Express", from: "Dhaka", to: "Chattogram", dep: "07:00", arr: "12:15", price: 500, seats: 80 },
    { id: 3, name: "Parjotok Express", from: "Dhaka", to: "Cox's Bazar", dep: "22:30", arr: "07:00", price: 750, seats: 150 },
    { id: 4, name: "Sylhet Express", from: "Dhaka", to: "Sylhet", dep: "21:30", arr: "05:00", price: 350, seats: 60 },
    { id: 5, name: "Padma Express", from: "Dhaka", to: "Rajshahi", dep: "23:00", arr: "04:00", price: 400, seats: 90 },
    { id: 6, name: "Sundarban Express", from: "Dhaka", to: "Khulna", dep: "20:30", arr: "05:30", price: 420, seats: 110 },
    { id: 7, name: "Ekota Express", from: "Dhaka", to: "Rangpur", dep: "09:00", arr: "19:00", price: 600, seats: 45 },
    { id: 8, name: "Turna Express", from: "Chattogram", to: "Dhaka", dep: "23:30", arr: "06:30", price: 450, seats: 100 },
    { id: 9, name: "Udayan Express", from: "Sylhet", to: "Chattogram", dep: "20:00", arr: "06:00", price: 550, seats: 70 }
];

// Check if there is saved seat data in LocalStorage to persist the seat counts
const savedDatabase = localStorage.getItem('bdRailwayDatabase');
if (savedDatabase) {
    trainDatabase = JSON.parse(savedDatabase);
}

const resultsSection = document.getElementById('resultsSection');
const travelDateInput = document.getElementById('travelDate');

// Set default date to today
const today = new Date().toISOString().split('T')[0];
travelDateInput.value = today;
travelDateInput.min = today;

// 2. Search Function
function searchTrains() {
    const from = document.getElementById('fromStation').value;
    const to = document.getElementById('toStation').value;
    const date = travelDateInput.value;

    if (from === to) {
        showToast("Departure and Destination cannot be the same!", "error");
        return;
    }

    resultsSection.innerHTML = `
        <div class="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center">
            <div class="spinner mb-4"></div>
            <p class="text-brand-light font-semibold animate-pulse">Searching available trains...</p>
        </div>
    `;

    setTimeout(() => {
        const availableTrains = trainDatabase.filter(train => 
            train.from.toLowerCase() === from.toLowerCase() && 
            train.to.toLowerCase() === to.toLowerCase()
        );
        renderResults(availableTrains, from, to, date);
    }, 800);
}

// 3. Render Results with Seats
function renderResults(trains, from, to, date) {
    if (trains.length === 0) {
        resultsSection.innerHTML = `
            <div class="glass-panel rounded-2xl p-12 text-center flex flex-col items-center justify-center">
                <div class="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mb-4 border border-rose-500/30">
                    <i class="fa-solid fa-triangle-exclamation text-3xl text-rose-400"></i>
                </div>
                <h3 class="text-xl font-bold text-white mb-2">No Trains Found</h3>
                <p class="text-slate-400">There are no direct trains from ${from} to ${to} right now.</p>
            </div>
        `;
        return;
    }

    let html = `<h3 class="text-xl font-bold text-white mb-6 px-2 flex items-center gap-2"><i class="fa-solid fa-list-check text-brand-light"></i> Available Trains</h3>`;
    html += `<div class="space-y-4">`;

    trains.forEach(train => {
        // Determine seat color based on availability
        let seatColorClass = "text-emerald-400";
        if (train.seats < 20) seatColorClass = "text-amber-400";
        if (train.seats === 0) seatColorClass = "text-rose-500";

        // Disable button if no seats
        const btnDisabled = train.seats === 0 ? "opacity-50 cursor-not-allowed" : "";
        const btnText = train.seats === 0 ? "Sold Out" : "Book";

        html += `
            <div class="train-card glass-panel rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center border-l-4 border-l-brand-light">
                <div class="mb-6 md:mb-0 text-center md:text-left w-full md:w-1/3">
                    <h4 class="text-lg font-bold text-white">${train.name}</h4>
                    <p class="text-sm text-slate-400 mt-1"><i class="fa-solid fa-hashtag text-xs"></i> Train ID: ${train.id}</p>
                </div>
                
                <div class="flex items-center justify-center gap-6 mb-6 md:mb-0 w-full md:w-1/3">
                    <div class="text-center">
                        <p class="text-xl font-extrabold text-white">${train.dep}</p>
                        <p class="text-xs text-slate-400 uppercase tracking-wider mt-1">${train.from}</p>
                    </div>
                    <div class="flex flex-col items-center text-slate-500">
                        <i class="fa-solid fa-train text-sm mb-1"></i>
                        <div class="w-12 h-[2px] bg-slate-600"></div>
                    </div>
                    <div class="text-center">
                        <p class="text-xl font-extrabold text-white">${train.arr}</p>
                        <p class="text-xs text-slate-400 uppercase tracking-wider mt-1">${train.to}</p>
                    </div>
                </div>

                <div class="flex items-center justify-between md:justify-end gap-6 w-full md:w-1/3">
                    <div class="text-right">
                        <p class="text-2xl font-extrabold text-brand-light">৳${train.price}</p>
                        <p class="text-xs font-semibold ${seatColorClass} mt-1">
                            <i class="fa-solid fa-chair mr-1"></i> ${train.seats} Seats Left
                        </p>
                    </div>
                    <button onclick="bookTicket(${train.id}, '${date}')" 
                        class="bg-white text-brand-dark hover:bg-brand-light hover:text-white px-6 py-2 rounded-xl font-bold transition-all shadow-lg shadow-white/10 ${btnDisabled}">
                        ${btnText}
                    </button>
                </div>
            </div>
        `;
    });

    html += `</div>`;
    resultsSection.innerHTML = html;
}

// 4. Booking Logic (Reduces Seats)
function bookTicket(trainId, date) {
    // Find the train
    const trainIndex = trainDatabase.findIndex(t => t.id === trainId);
    const train = trainDatabase[trainIndex];

    if (train.seats <= 0) {
        showToast("Sorry, this train is sold out!", "error");
        return;
    }

    // Reduce seat count by 1
    trainDatabase[trainIndex].seats -= 1;

    // Save updated database to LocalStorage
    localStorage.setItem('bdRailwayDatabase', JSON.stringify(trainDatabase));

    // Generate a random seat number for the ticket
    const randomSeat = `A-${Math.floor(Math.random() * 50) + 1}`;

    const ticketData = { 
        name: train.name, 
        from: train.from, 
        to: train.to, 
        price: train.price, 
        date: date,
        seat: randomSeat
    };
    
    // Save ticket to LocalStorage
    localStorage.setItem('bdRailwayTicket', JSON.stringify(ticketData));
    
    // Show success message and display ticket
    showToast("Ticket Booked Successfully!", "success");
    showTicket(ticketData);
    
    // Re-run search to update the seat count in the UI
    searchTrains(); 
}

// 5. Show Modal
function showTicket(data) {
    document.getElementById('tktTrainName').innerText = data.name;
    document.getElementById('tktDate').innerText = data.date;
    document.getElementById('tktFrom').innerText = data.from;
    document.getElementById('tktTo').innerText = data.to;
    document.getElementById('tktPrice').innerText = `৳${data.price}`;
    document.getElementById('tktSeat').innerText = `(${data.seat})`;

    const modal = document.getElementById('ticketModal');
    modal.classList.remove('hidden');
    
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
}

// 6. View Saved Ticket
function viewMyTicket() {
    const savedTicket = JSON.parse(localStorage.getItem('bdRailwayTicket'));
    if (savedTicket) {
        showTicket(savedTicket);
    } else {
        showToast("You have not booked any tickets yet!", "error");
    }
}

// 7. Close Modal
function closeModal() {
    const modal = document.getElementById('ticketModal');
    modal.classList.remove('active');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300);
}

// 8. Custom Toast Notification (Replaces boring alerts)
function showToast(message, type) {
    const bgColor = type === 'success' ? 'bg-emerald-500' : 'bg-rose-500';
    const icon = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    
    const alertBox = document.createElement('div');
    alertBox.className = `fixed top-24 left-1/2 -translate-x-1/2 ${bgColor} text-white px-6 py-3 rounded-lg shadow-xl z-[100] font-semibold flex items-center gap-2 transition-opacity duration-300`;
    alertBox.innerHTML = `<i class="fa-solid ${icon}"></i> ${message}`;
    document.body.appendChild(alertBox);
    
    setTimeout(() => {
        alertBox.style.opacity = '0';
        setTimeout(() => alertBox.remove(), 300);
    }, 3000);
}

// Initial setup to save the database to localstorage if it doesn't exist
if (!localStorage.getItem('bdRailwayDatabase')) {
    localStorage.setItem('bdRailwayDatabase', JSON.stringify(trainDatabase));
}