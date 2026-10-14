// import { Component, OnInit } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';

// import { DonorAuthService } from '../../../core/services/donor-auth.service';
// import { BloodBankService } from '../../../core/services/blood-bank.service';

// @Component({
//   selector: 'app-donor-register',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './register.component.html',
//   styleUrls: ['./register.component.css']
// })
// export class DonorRegisterComponent implements OnInit {

//   constructor(
//     private donorAuthService: DonorAuthService,
//     private bloodBankService: BloodBankService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.loadBloodBanks();
//   }

//   isLoginMode = false;

//   currentStep = 1;

//   bloodBanks: any[] = [];

//   donorData = {

//     bloodBankId: null,

//     username: '',
//     password: '',

//     fullName: '',
//     email: '',
//     mobileNumber: '',

//     gender: '',

//     dateOfBirth: '',

//     bloodGroup: '',

//     weight: null,
//     hemoglobin: null,

//     address: '',
//     city: '',
//     state: ''
//   };

//   loginData = {
//     username: '',
//     password: ''
//   };

//   loadBloodBanks() {
//     this.bloodBankService
//       .getAllBloodBanks()
//       .subscribe({
//         next: (data: any) => {
//           this.bloodBanks = data;
//         },
//         error: (err) => {
//           console.error(err);
//         }
//       });
//   }

//   toggleMode() {
//     this.isLoginMode = !this.isLoginMode;
//     this.currentStep = 1;
//   }

//   nextStep() {

//     if (!this.validateCurrentStep()) {
//       return;
//     }

//     this.currentStep++;
//   }

//   previousStep() {
//     this.currentStep--;
//   }

//   validateCurrentStep(): boolean {

//     if (this.currentStep === 1) {

//       if (
//         !this.donorData.fullName ||
//         !this.donorData.email ||
//         !this.donorData.mobileNumber ||
//         !this.donorData.gender ||
//         !this.donorData.dateOfBirth
//       ) {
//         alert('Please complete all personal details');
//         return false;
//       }
//     }

//     if (this.currentStep === 2) {

//       if (
//         !this.donorData.bloodGroup ||
//         !this.donorData.weight ||
//         !this.donorData.hemoglobin
//       ) {
//         alert('Please complete medical details');
//         return false;
//       }

//       if (this.donorData.weight < 45) {
//         alert('Weight should be above 45 kg');
//         return false;
//       }

//       if (this.donorData.hemoglobin < 12) {
//         alert('Hemoglobin should be minimum 12');
//         return false;
//       }
//     }

//     if (this.currentStep === 3) {

//       if (
//         !this.donorData.address ||
//         !this.donorData.city ||
//         !this.donorData.state ||
//         !this.donorData.username ||
//         !this.donorData.password ||
//         !this.donorData.bloodBankId
//       ) {
//         alert('Please complete account details');
//         return false;
//       }
//     }

//     return true;
//   }

//   register() {

//     if (!this.validateCurrentStep()) {
//       return;
//     }

//     this.donorAuthService
//       .registerDonor(this.donorData)
//       .subscribe({

//         next: (response: any) => {

//           alert('Registration Successful');

//           this.isLoginMode = true;

//           this.loginData.username =
//             this.donorData.username;

//           this.loginData.password =
//             this.donorData.password;
//         },

//         error: (err) => {

//           console.error(err);

//           alert(
//             err.error?.message ||
//             'Registration Failed'
//           );
//         }
//       });
//   }

//   login() {

//     if (
//       !this.loginData.username ||
//       !this.loginData.password
//     ) {
//       alert('Enter username and password');
//       return;
//     }

//     this.donorAuthService
//       .loginDonor(this.loginData)
//       .subscribe({

//         next: (response: any) => {

//           localStorage.setItem(
//             'donorToken',
//             response.token
//           );

//           localStorage.setItem(
//             'donorUser',
//             JSON.stringify(response)
//           );

//           this.router.navigate(
//             ['/donor/dashboard']
//           );
//         },

//         error: (err) => {

//           console.error(err);

//           alert('Login Failed');
//         }
//       });
//   }
// }