export class HandleDate {
  static UTC(date: Date, utc: number): Date {
    date.setHours(date.getHours() + utc);
    return date;
  }
}
