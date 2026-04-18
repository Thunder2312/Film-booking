import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-guest-dialog',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './guest-dialog.component.html',
  styleUrl: './guest-dialog.component.scss'
})
export class GuestDialogComponent {
  private dialogRef = inject(MatDialogRef<GuestDialogComponent>);
  guest = { full_name: '', email: '', phone: '' };

  onCancel() { this.dialogRef.close(); }
  onConfirm() { this.dialogRef.close(this.guest); }
}