import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone: true,
  imports: [FormsModule,CommonModule]
})
export class CartComponent {
  cartItems: any[] = JSON.parse(localStorage.getItem('cart') || '[]');
  totalAmount = this.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  increaseQuantity(item: any) {
    if (item.quantity < item.availableQty) {
      item.quantity++;
      this.updateCart();
    } else {
      alert('Cannot order more than available quantity!');
    }
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCart();
    }
  }

  removeFromCart(item: any) {
    this.cartItems = this.cartItems.filter(cartItem => cartItem !== item);
    this.updateCart();
  }

  updateCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
}
