// frontend/src/app/services/payment.service.ts
import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { API_CONFIG } from '../constants/constants';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private renderer: Renderer2;

  constructor(private http: HttpClient, rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  private loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = this.renderer.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      this.renderer.appendChild(document.body, script);
    });
  }


  createOrder(bookingDetails: any) {
    return this.http.post(`${API_CONFIG.BASE_URL}/payment/create-order`, bookingDetails);
  }

  verifyPayment(payload: any) {
    return this.http.post(`${API_CONFIG.BASE_URL}/payment/verify-payment`, payload);
  }

  // frontend/src/app/services/payment.service.ts

  async initiatePayment(orderData: any, onSuccess: Function) {
    const isLoaded = await this.loadRazorpayScript();
    if (!isLoaded) {
      console.error('Razorpay SDK failed to load');
      return;
    }

    const options = {
      key: environment.razorpay.keyId,
      amount: orderData.amount,
      order_id: orderData.id,


      handler: (response: any) => {

        // 1. Combine the Razorpay response with booking_id
        const payloadForBackend = {
          ...response,                  // signature, payment_id, order_id
          booking_id: orderData.booking_id
        };

        // 2. Send the combined payload to backend
        this.verifyPayment(payloadForBackend).subscribe({
          next: (res) => onSuccess(res),
          error: (err) => console.error("Payment verification failed on backend", err)
        });
      }
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  }
}
