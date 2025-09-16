import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Apiservice } from '../../core/apiservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { error } from 'console';

@Component({
  selector: 'app-repair-order-details',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './repair-order-details.html',
  styleUrl: './repair-order-details.css',
})
export class RepairOrderDetails implements OnInit {
  order: any;
  constructor(private route: ActivatedRoute, private api: Apiservice) {}
  ngOnInit(): void {
    debugger;
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.api.getByCustomer(orderId).subscribe({
        next: (res) => {
          this.order = res;
          console.log(this.order);
        },
        error: (err) => console.log(err),
      });
    }
  }
}
