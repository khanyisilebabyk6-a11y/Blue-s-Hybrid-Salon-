// Get all bookings from localStorage or start empty
let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

// Elements
const bookingForm = document.getElementById("bookingForm");
const bookingList = document.getElementById("bookingList");
const dateInput = document.getElementById("date");
const timeSlotSelect = document.getElementById("timeSlot");
const message = document.getElementById("message");
const whatsappLink = document.getElementById("whatsappLink");

// Full list of time slots
const allTimeSlots = [
    "09:00 AM","10:00 AM","11:00 AM","12:00 PM",
    "01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM"
];

// Function to detect mobile device
function isMobile() {
    return /Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

// Render available time slots for selected date
function updateTimeSlots() {
    const selectedDate = dateInput.value;
    const bookedSlots = bookings
        .filter(b => b.date === selectedDate)
        .map(b => b.timeSlot);

    timeSlotSelect.innerHTML = '<option value="">Select Time Slot</option>';

    allTimeSlots.forEach(slot => {
        if(!bookedSlots.includes(slot)){
            const option = document.createElement("option");
            option.value = slot;
            option.textContent = slot;
            timeSlotSelect.appendChild(option);
        }
    });

    updateWhatsAppLink();
}

// Render booked dates & times
function renderBookings() {
    bookingList.innerHTML = "";
    bookings.forEach((booking, index) => {
        const li = document.createElement("li");
        li.textContent = booking.date + " | " + booking.timeSlot;

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.style.marginLeft = "10px";
        delBtn.onclick = function() {
            bookings.splice(index, 1);
            localStorage.setItem("bookings", JSON.stringify(bookings));
            renderBookings();
            updateTimeSlots();
        };

        li.appendChild(delBtn);
        bookingList.appendChild(li);
    });
}

// Update WhatsApp link dynamically
function updateWhatsAppLink() {
    const date = dateInput.value;
    const timeSlot = timeSlotSelect.value;
    const phone = "27606614664";

    if(isMobile()){
        // Mobile: pre-fill message
        if(date && timeSlot){
            const messageText = `Hello! I want to book an appointment on ${date} at ${timeSlot}.`;
            whatsappLink.href = `https://wa.me/${phone}?text=${encodeURIComponent(messageText)}`;
        } else {
            whatsappLink.href = `https://wa.me/${phone}`;
        }
    } else {
        // Desktop: prevent opening WhatsApp Web
        whatsappLink.href = "#";
        whatsappLink.onclick = function(event){
            event.preventDefault();
            alert("Please open this booking on your phone to book via WhatsApp.");
        };
    }
}

// Event listeners
dateInput.addEventListener("change", updateTimeSlots);
timeSlotSelect.addEventListener("change", updateWhatsAppLink);

bookingForm.addEventListener("submit", function(event){
    event.preventDefault();

    const date = dateInput.value;
    const timeSlot = timeSlotSelect.value;

    if(!date || !timeSlot){
        message.innerText = "Please select both date and time!";
        return;
    }

    const newBooking = { date, timeSlot };
    bookings.push(newBooking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    message.innerText = "Your booking for " + date + " at " + timeSlot + " is confirmed!";

    bookingForm.reset();
    renderBookings();
    updateTimeSlots();
});

// Initial render
renderBookings();
updateTimeSlots();