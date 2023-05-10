// Enums Interfaces
export interface IIncomeType {
  cattleSale: 'Cattle Sale'
  swineSale: 'Swine Sale'
  goatSale: 'Goat Sale'
  meatSale: 'Meat Sale'
  milkSale: 'Milk Sale'
  pigSale: 'Pig Sale'
}

export interface IMeatType {
  pork: 'Pork'
  beef: 'Beef'
  goat: 'Goat'
}

export interface IMilkType {
  cattle: 'Cattle'
  goat: 'Goat'
}



// Enums
export const INCOME_TYPES: IIncomeType = {
  cattleSale: 'Cattle Sale',
  swineSale: 'Swine Sale',
  goatSale: 'Goat Sale',
  meatSale: 'Meat Sale',
  milkSale: 'Milk Sale',
  pigSale: 'Pig Sale',
}

export const MEAT_TYPES: IMeatType = {
  pork: 'Pork',
  beef: 'Beef',
  goat: 'Goat',
}

export const MILK_TYPES: IMilkType = {
  cattle: 'Cattle',
  goat: 'Goat',
}