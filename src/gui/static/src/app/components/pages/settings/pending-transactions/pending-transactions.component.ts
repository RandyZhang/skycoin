import { Component, OnDestroy, OnInit } from '@angular/core';
import { WalletService } from '../../../../services/wallet.service';
import * as moment from 'moment';
import { ISubscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-pending-transactions',
  templateUrl: './pending-transactions.component.html',
  styleUrls: ['./pending-transactions.component.scss'],
})
export class PendingTransactionsComponent implements OnInit, OnDestroy {
  transactions: any[];

  private transactionsSubscription: ISubscription;

  constructor(
    public walletService: WalletService,
  ) {
    this.walletService.startDataRefreshSubscription();
  }

  ngOnInit() {
    this.transactionsSubscription = this.walletService.pendingTransactions().subscribe(transactions => {
      this.transactions = this.mapTransactions(transactions);
    });
  }

  ngOnDestroy() {
    this.transactionsSubscription.unsubscribe();
  }

  private mapTransactions(transactions) {
    return transactions.map(transaction => {
      transaction.transaction.timestamp = moment(transaction.received).unix();

      return transaction.transaction;
    })
    .map(transaction => {
      transaction.amount = transaction.outputs
        .map(output => output.coins >= 0 ? output.coins : 0)
        .reduce((a , b) => a + parseFloat(b), 0);

      return transaction;
    });
  }
}
