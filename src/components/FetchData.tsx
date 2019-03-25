import React, { useState, useEffect } from "react";
import { DayRepo } from "../repositories/Days";
import { Day } from "../models/Day";

export function FetchData({ dayRepo }: { dayRepo: DayRepo }) {
  const [data, setData] = useState({
    loading: true,
    data: undefined as Day[] | undefined
  });

  useEffect(() => {
    dayRepo.all().then(data => setData({ loading: false, data }));
  }, []);

  return (
    <div>
      <h3>{data.loading ? "loading..." : JSON.stringify(data)}</h3>
      <button
        onClick={() => {
          dayRepo
            .create({
              date: new Date(),
              eveningMeal: null,
              morningMeal: null,
              notes: "these are some notes"
            })
            .then(console.log)
            .catch(console.error);
        }}
      >
        Add day
      </button>
    </div>
  );
}
