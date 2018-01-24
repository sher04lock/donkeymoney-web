import { Component, OnInit } from '@angular/core';
import { OperationsService } from '../operations.service';
import { Operation } from '../operation';

/**
 * Dashboard component is responsible for displaying user's summary
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  operations: Operation[];
  totalSpent: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  monthlyBudget: number;
  biggestExpense = new Operation();
  constructor(private operationService: OperationsService) { }

  /**
   * Angular function called whenever component is created.
   * It fetches last transactions and displays user overview.
   */
  ngOnInit() {
    this.operationService.getOperations(100)
      .subscribe(operations => {
        this.operations = operations;
        this.totalSpent = this.operations
          .map(op => op.amount)
          .reduce((x, y) => x + y, 0);

        this.biggestExpense = this.operations.reduce((x, y) => x.amount < y.amount ? x : y, this.biggestExpense);
        let date = new Date();
        let expensesFromLastMonth = this.operations.filter(o => this.getCreationMonth(o.createdAt) === (date.getMonth() + 1));
        this.monthlyExpenses = expensesFromLastMonth
          .map(o => o.amount)
          .filter(x => x < 0)
          .reduce((x, y) => x + y, 0);

        this.monthlyIncome = expensesFromLastMonth
          .map(o => o.amount)
          .filter(x => x > 0)
          .reduce((x, y) => x + y, 0);

        this.monthlyBudget = this.monthlyIncome + this.monthlyExpenses;
      });
  }

  getCreationYear(date: string) {
    return +date.substr(0, 4);
  }

  getCreationMonth(date: string) {
    return +date.substr(5, 2);
  }

  getCreationDay(date: string) {
    return +date.substr(8, 2);
  }
}
