import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";
import { ActivatedRoute, Router } from '@angular/router';
import { MovieStoreService } from '../../services/movie.service';
import { ShowTimeService } from '../../services/ShowTime.service';
import { SeatService } from '../../services/seats.service';
import { Seats } from '../../services/seats.model';
import { MatDialog } from '@angular/material/dialog';
import { GuestDialogComponent } from '../guest-dialog/guest-dialog.component';
import { PaymentService } from '../../services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-view-seats',
  imports: [HeaderComponent, CommonModule],
  templateUrl: './view-seats.component.html',
  styleUrl: './view-seats.component.scss'
})
export class ViewSeatsComponent {
  private route = inject(ActivatedRoute);
  private movieStore = inject(MovieStoreService);
  private showTimeService = inject(ShowTimeService);
  private seatService = inject(SeatService);
  private paymentService = inject(PaymentService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  movieId = signal<number | null>(null);
  selectedDate = signal<Date>(new Date());
  showtimes = signal<any[]>([]);
  showtimeId = signal<number | null>(null);
  seatSelected = false;

  constructor(private router: Router) { }

  seats: Seats[] = []
  regularSeats: Seats[] = []
  premiumSeats: Seats[] = []
  vipSeats: Seats[] = []

  selectedMovie = this.movieStore.selectedMovie;
  loading = this.movieStore.loading;
  error = this.movieStore.error;
  protected readonly Array = Array;
  selectedSeats: Set<string> = new Set();

  toggleSeat(seatName: string) {
    if (this.selectedSeats.has(seatName)) {
      this.selectedSeats.delete(seatName);
    } else {
      this.selectedSeats.add(seatName);
    }
  }

  // Inside view-seats.component.ts
  // view-seats.component.ts

  onBookSeats() {
    const total = this.calculateTotal();
    const dialogRef = this.dialog.open(GuestDialogComponent, { width: '400px' });

    dialogRef.afterClosed().subscribe(guestInfo => {
      if (guestInfo) {
        // Get DB IDs instead of string labels ('A01')
        const selectedSeatIds = this.seats
          .filter(s => this.selectedSeats.has(s.seatName))
          .map(s => s.seat_id);

        const payload = {
          guest: guestInfo,
          showtime_id: this.showtimeId(),
          total_amount: total,
          seats: selectedSeatIds
        };

        // Chain the order creation and the payment initiation 
        this.paymentService.createOrder(payload).subscribe({
          next: (order) => {
            // Pass the order data and the success callback
            this.paymentService.initiatePayment(order, () => this.onSuccess());
          },
          error: (err) => {
            console.error("Failed to create order", err);
            this.snackBar.open('Booking failed. Please try again.', 'Close');
          }
        });
      }
    });
  }
  calculateTotal(): number {
    return Array.from(this.selectedSeats).reduce((total, seatName) => {
      // Find the seat object that matches the selected seatName
      const seat = this.seats.find(s => s.seatName === seatName);
      return total + (seat ? seat.seatPrice : 0);
    }, 0);
  }

  // Inside ViewSeatsComponent
  onSuccess() {
    // 1. Clear the frontend selection state
    this.selectedSeats.clear();

    // 2. Show a success message to the user
    this.snackBar.open('Tickets booked successfully!', 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['success-snackbar']
    });

    // 3. Refresh the seat map so the newly booked seats appear as 'Occupied'
    const currentShowtimeId = this.showtimeId();
    if (currentShowtimeId) {
      this.seatService.loadSeats(currentShowtimeId);
    }

    // 4. Optionally redirect the user to a 'My Bookings' or confirmation page
    this.router.navigate(['/home']);
  }

  processBooking(guestInfo: any) {
    const bookingPayload = {
      guest: guestInfo,
      showtime_id: this.showtimeId(),
      seats: Array.from(this.selectedSeats), // Array of seatNames or IDs
      total_amount: this.calculateTotal()
    };

    // Call your payment/booking service here
    this.paymentService.createOrder(bookingPayload).subscribe({
      next: (order) => this.paymentService.initiatePayment(order, () => this.onSuccess())
    });
  }


  ngOnInit() {
    const id = this.movieId();

    this.route.paramMap.subscribe(params => {
      const id = params.get('showtimeId');
      if (id) {
        const showtimeId = +id;
        this.showtimeId.set(showtimeId);
        this.seatService.loadSeats(showtimeId);
      }
    });
    this.route.paramMap.subscribe(params => {
      const id = params.get('movieId');
      if (id) {
        const movieId = +id;
        this.movieId.set(movieId);
        this.movieStore.loadMovieById(movieId);
      }
    });

    this.seatService.seat$.subscribe(seats => {
      this.seats = seats;
      this.regularSeats = this.seats.filter(seat => seat.seatType === "REGULAR")
      this.premiumSeats = this.seats.filter(seat => seat.seatType === "PREMIUM")
      this.vipSeats = this.seats.filter(seat => seat.seatType === "VIP")

    })
  }

}
