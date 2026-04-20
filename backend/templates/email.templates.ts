const EmailTemplates = {
  TICKET_CONFIRMATION: {
    subject: "Your Movie Ticket - {{movie}}",
    html: `
      <h2>Booking Confirmed 🎉</h2>

      <p><b>Booking ID:</b> {{bookingId}}</p>
      <p><b>Movie:</b> {{movie}}</p>
      <p><b>Screen:</b> {{screen}}</p>
      <p><b>Date:</b> {{date}}</p>
      <p><b>Time:</b> {{time}}</p>
      <p><b>Seats:</b> {{seats}}</p>

      <h3>Show this QR at entry</h3>
      <img src="{{qrCode}}" alt="QR Code" />

      <p>Enjoy your movie 🍿</p>
    `,
  },
};

module.exports = { EmailTemplates };