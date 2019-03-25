import { Api } from "../api/Api";
import { Day, DayFields } from "../models/Day";
import { MealData, dataToMeal } from "./Meals";
import { subWeeks, setHours, setMinutes, startOfDay } from "date-fns/esm";
import { subHours, startOfHour } from "date-fns";

const toISOString = (date: Date) => date.toISOString();
const includeAll =
  "id,date,notes,morningmealid,eveningmealid,eveningmeal(*,amount(*)),morningmeal(*,amount(*))";
const dateDesc = "date.desc";
const week = () => {
  const todayDate = startOfDay(new Date());
  const today = toISOString(todayDate);
  const aWeekAgo = toISOString(subWeeks(today, 1));
  return `(date.lte.${today},date.gt.${aWeekAgo})`;
};

const head = <T>([x]: T[]): T | undefined => x;
const map = <A, B>(fn: (a: A) => B) => (arr: Array<A>): Array<B> => arr.map(fn);

export interface DayData {
  id: number;
  date: string;
  morningmealid: number | null;
  eveningmealid: number | null;
  morningmeal: MealData | null;
  eveningmeal: MealData | null;
  notes: string;
}

export const dataToDay = (data: DayData): Day => ({
  id: data.id,
  date: new Date(data.date),
  morningMeal: data.morningmeal && dataToMeal(data.morningmeal),
  eveningMeal: data.eveningmeal && dataToMeal(data.eveningmeal),
  notes: data.notes
});

const dayFieldsToData = (dayFields: Partial<DayFields>): Partial<DayData> => {
  const dayData: Partial<DayData> = {};

  if (dayFields.date) {
    dayData.date = toISOString(startOfDay(dayFields.date));
  }

  if (dayFields.morningMeal) {
    dayData.morningmealid = dayFields.morningMeal.id;
  }

  if (dayFields.eveningMeal) {
    dayData.eveningmealid = dayFields.eveningMeal.id;
  }

  if (dayFields.notes) {
    dayData.notes = dayFields.notes;
  }

  return dayData;
};

const emptyDay = (date: Date) => ({
  date,
  morningMeal: null,
  eveningMeal: null,
  notes: ""
});

export class DayRepo {
  private constructor(private api: Api) {}

  all(): Promise<Day[]> {
    return this.api
      .get<DayData[]>({
        path: "days",
        params: { select: includeAll, order: dateDesc }
      })
      .then(map(dataToDay));
  }

  lastWeek(): Promise<Day[]> {
    return this.api
      .get<DayData[]>({
        path: "days",
        params: { select: includeAll, order: dateDesc, and: week() }
      })
      .then(map(dataToDay));
  }

  findById(id: number): Promise<Day | null> {
    return this.api
      .get<DayData[]>({
        path: "days",
        params: {
          id: `eq.${id}`,
          select: includeAll
        }
      })
      .then(head)
      .then(data => (data ? dataToDay(data) : null));
  }

  create(dayFields: DayFields): Promise<Day> {
    return this.api
      .post<{ id: number }[]>(
        {
          path: "days",
          params: {
            select: "id"
          }
        },
        dayFieldsToData(dayFields)
      )
      .then(vals => head(vals)!)
      .then(async ({ id }) => (await this.findById(id))!);
  }

  getDayByDate(date: Date): Promise<Day | null> {
    return this.api
      .get<DayData[]>({
        path: "days",
        params: {
          date: `eq.(${toISOString(date)})`,
          select: includeAll
        }
      })
      .then(head)
      .then(data => (data ? dataToDay(data) : null));
  }

  async findOrCreate(date: Date): Promise<Day> {
    return (await this.getDayByDate(date)) || this.create(emptyDay(date));
  }

  update(id: number, dayFields: Partial<DayFields>): Promise<Day> {
    return this.api
      .patch<{ id: number }[]>(
        {
          path: "days",
          params: {
            id: `eq.${id}`,
            select: "id"
          }
        },
        dayFieldsToData(dayFields)
      )
      .then(vals => head(vals)!)
      .then(async ({ id }) => (await this.findById(id))!);
  }

  delete(id: number) {
    return this.api.delete({
      path: "days",
      params: {
        id: `eq.${id}`
      }
    });
  }

  static init(api: Api): DayRepo {
    return new DayRepo(api);
  }
}
