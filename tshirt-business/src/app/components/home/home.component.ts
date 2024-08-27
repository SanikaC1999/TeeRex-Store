import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule]
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchQuery: string = '';
  filters = {
    gender: '',
    color: '',
    priceRange: '',
    type: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<any[]>('https://geektrust.s3.ap-southeast-1.amazonaws.com/coding-problems/shopping-cart/catalogue.json')
      .subscribe(data => {
        this.products = data;
        this.filteredProducts = data;
      });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      return (
        (this.filters.gender === '' || product.gender === this.filters.gender) &&
        (this.filters.color === '' || product.color.includes(this.filters.color)) &&
        (this.filters.type === '' || product.type === this.filters.type) &&
        (this.filters.priceRange === '' || this.isWithinPriceRange(product.price))
      );
    });
  }

  isWithinPriceRange(price: number): boolean {
    switch (this.filters.priceRange) {
      case 'low':
        return price < 500;
      case 'medium':
        return price >= 500 && price <= 1000;
      case 'high':
        return price > 1000;
      default:
        return true;
    }
  }

  searchProducts() {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      product.color.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      product.type.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.applyFilters();
  }

  addToCart(product: any) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
    // Check if the product is already in the cart
    const existingProduct = cart.find((item: any) => item.id === product.id);
  
    if (existingProduct) {
      // If the product is already in the cart, check the quantity
      if (existingProduct.quantity < product.quantity) {
        existingProduct.quantity += 1;
      } else {
        alert('Cannot add more than available quantity!');
      }
    } else {
      // Add a new product to the cart
      cart.push({ ...product, quantity: 1 });
    }
  
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  
}
