import { Meal } from "./Meal";
import { Optional } from "./util";

export interface DayFields {
  date: Date;
  eveningMeal: Optional<Meal>;
  morningMeal: Optional<Meal>;
  notes: string;
}

export interface Day {
  id: number;
  date: Date;
  eveningMeal: Optional<Meal>;
  morningMeal: Optional<Meal>;
  notes: string;
}
