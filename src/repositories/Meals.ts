import { Api } from "../api/Api";
import { Meal, Time, MealFields } from "../models/Meal";
import { amounts } from "../models/Amount";

const head = <T>([x]: T[]): T | undefined => x;

export interface MealData {
  id: number;
  time: string;
  amountid: number;
  notes: string;
}

export function parseTime(timeStr: string): Time {
  const timeElements = timeStr.split(":");
  return {
    hours: +timeElements[0],
    minutes: +timeElements[1]
  };
}
const includeAll = "*";

const stringifyTime = (time: Time): string => `${time.hours}:${time.minutes}`;

export const dataToMeal = (data: MealData): Meal => ({
  id: data.id,
  time: parseTime(data.time),
  amount: amounts[data.amountid - 1],
  notes: data.notes
});

export const mealFieldsToData = (
  meal: Partial<MealFields>
): Partial<MealData> => {
  let mealFields: Partial<MealData> = {};

  if (meal.time) {
    mealFields.time = stringifyTime(meal.time);
  }

  if (meal.amount) {
    mealFields.amountid = meal.amount.id;
  }

  if (meal.notes) {
    mealFields.notes = meal.notes;
  }

  return mealFields;
};

export class MealRepo {
  private constructor(private api: Api) {}

  all(): Promise<Meal[]> {
    return this.api.get({ path: "meals" });
  }

  findById(id: number): Promise<Meal | null> {
    return this.api
      .get<MealData[]>({
        path: "meals",
        params: {
          id
        }
      })
      .then(head)
      .then(data => (data ? dataToMeal(data) : null));
  }

  create(meal: MealFields): Promise<Meal> {
    return this.api
      .post<MealData[]>(
        {
          path: "meals",
          params: {
            select: includeAll
          }
        },
        mealFieldsToData(meal)
      )
      .then(head)
      .then(data => dataToMeal(data!));
  }

  update(id: number, meal: Partial<MealFields>): Promise<Meal> {
    return this.api
      .patch<MealData[]>(
        {
          path: "meals",
          params: {
            id
          }
        },
        mealFieldsToData(meal)
      )
      .then(head)
      .then(data => dataToMeal(data!));
  }

  delete(id: number) {
    return this.api.delete({
      path: "days",
      params: {
        id
      }
    });
  }

  static init(api: Api): MealRepo {
    return new MealRepo(api);
  }
}
