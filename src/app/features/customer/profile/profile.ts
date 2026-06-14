import { Component, signal } from '@angular/core';
import { User } from '../../../core/models/user-model';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, TitleCasePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  profileData: Partial<User>;
  successMsg = signal('');
  errorMsg = signal('');
  saving = signal(false);

  preferenceData = {
    emailAlerts: false,
    smsAlerts: false
  };

  cities = ['Mumbai', 'Pune', 'Bangalore', 'Delhi', 'Hyderabad', 'Chennai'];

  constructor(public auth: AuthService) {
    const user = auth.currentUser()!;
    this.profileData = {
      name: user.name,
      email: user.email,
      phone: user.phone,
      city: user.city,
      budgetMin: user.budgetMin,
      budgetMax: user.budgetMax
    };
    this.preferenceData = {
      emailAlerts: user.emailAlerts ?? true,
      smsAlerts: user.smsAlerts ?? false
    };
  }

  saveProfile(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const min = this.profileData.budgetMin ?? 0;
    const max = this.profileData.budgetMax ?? 0;
    if (max < min) {
      this.errorMsg.set('Maximum budget cannot be less than minimum budget.');
      setTimeout(() => this.errorMsg.set(''), 5000);
      return;
    }

    this.saving.set(true);
    const userId = this.auth.currentUser()!.id;
    this.auth.updateProfile(userId, this.profileData).subscribe({
      next: () => {
        this.saving.set(false);
        this.successMsg.set('Profile updated successfully!');
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: () => {
        this.saving.set(false);
        this.errorMsg.set('Failed to update profile. Please try again.');
      }
    });
  }

  savePreferences() {
    this.saving.set(true);
    const userId = this.auth.currentUser()!.id;
    this.auth.updateProfile(userId, this.preferenceData).subscribe({
      next: () => {
        this.saving.set(false);
        this.successMsg.set('Preferences saved!');
        setTimeout(() => this.successMsg.set(''), 3000);
      },
      error: () => {
        this.saving.set(false);
        this.errorMsg.set('Failed to save preferences.');
      }
    });
  }
}
