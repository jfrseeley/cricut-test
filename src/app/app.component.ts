import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { delay, of, zip } from 'rxjs';
import { CardComponent } from './components/card/card.component';
import { RelativeTimePipe } from './pipes/relative-time.pipe';

interface Animal {
  animalId: number;
  name: string;
  species: string;
}

interface AnimalTransaction {
  animalId: number;
  transactionDate: string;
  price: number;
}

interface Row extends Animal {
  priceLatest: number | null | undefined;
  priceMin: number | null | undefined;
  priceMax: number | null | undefined;

  lastPurchaseDate: string | null | undefined;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, RelativeTimePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  twoWay: string | undefined;
  data: Row[] = [];

  ngOnInit(): void {
    zip([this.getAnimals(), this.getAnimalTransactionHistory()]).subscribe(([animals, animalTransactions]) => {
      const animalTransactionsByAnimal = animalTransactions.reduce<{ [id: number]: AnimalTransaction[] }>((groups, at) => {
        (groups[at.animalId] ??= []).push(at);
        return groups;
      }, {});

      this.data = animals.map<Row>(a => {
        const group = animalTransactionsByAnimal[a.animalId];
        const lastTransaction = group != null ? group.reduce((p, v) => (p.transactionDate.localeCompare(v.transactionDate) > 0 ? p : v)) : null;

        return {
          ...a,
          priceLatest: lastTransaction?.price,
          priceMin: group != null ? Math.min(...group.map(t => t.price)) : null,
          priceMax:group != null ?  Math.max(...group.map(t => t.price)) : null,

          lastPurchaseDate: lastTransaction?.transactionDate
        };
      });
    })
  }

  private getAnimals() {
    const data: Animal[] = [
      {
        animalId: 3,
        name: 'Anise',
        species: 'Cow'
      },
      {
        animalId: 4,
        name: 'Dash',
        species: 'Chicken'
      },
      {
        animalId: 6,
        name: 'Goldie',
        species: 'Chicken'
      },
      {
        animalId: 7,
        name: 'Flash',
        species: 'Cow'
      },
      {
        animalId: 11,
        name: 'Jewel',
        species: 'Cow'
      },
      {
        animalId: 13,
        name: 'Reepicheep',
        species: 'Chicken'
      },
      {
        animalId: 42,
        name: 'Ruby Rod',
        species: 'Cow'
      },
      {
        animalId: 101,
        name: 'Tingaleo',
        species: 'Chicken'
      }
    ];

    return of(data).pipe(delay(500));
  }

  private getAnimalTransactionHistory() {
    const now = new Date();
    const data: AnimalTransaction[] = [
      {
        animalId: 4,
        transactionDate: '2015-03-27',
        price: 19
      },
      {
        animalId: 3,
        transactionDate: '2016-04-13',
        price: 1420
      },
      // {
      //   animalId: 101,
      //   transactionDate: '2017-05-01',
      //   price: 44
      // },
      {
        animalId: 3,
        transactionDate: '2017-12-17',
        price: 850
      },
      {
        animalId: 7,
        transactionDate: '2018-04-28',
        price: 870
      },
      {
        animalId: 11,
        transactionDate: '2018-05-06',
        price: 630
      },
      {
        animalId: 4,
        transactionDate: '2018-09-06',
        price: 17
      },
      {
        animalId: 13,
        transactionDate: '2019-01-26',
        price: 37
      },
      {
        animalId: 42,
        transactionDate: '2019-04-20',
        price: 870
      },
      {
        animalId: 42,
        transactionDate: '2020-11-11',
        price: 640
      },
      {
        animalId: 42,
        transactionDate: '2020-02-17',
        price: 1400
      },
      {
        animalId: 13,
        transactionDate: '2022-04-03',
        price: 43
      },
      {
        animalId: 7,
        transactionDate: '2022-07-15',
        price: 1270
      },
      {
        animalId: 6,
        transactionDate: '2023-04-02',
        price: 28
      },
      {
        animalId: 4,
        transactionDate: new Date(now.getTime() - (1000 * 60  * 60 * 24)).toISOString(),
        price: 10
      }
    ];

    return of(data).pipe(delay(1000));
  }
}
