import React, { useState, useEffect, useMemo, Fragment } from "react";
import { Day } from "../models/Day";
import { unit } from "../styles";
import { H2 } from "../components/base";
import { DaySummary } from "../components/DaySummary";
import { DayRepo } from "../repositories/Days";
import styled from "styled-components";
import { addDays, differenceInCalendarDays } from "date-fns/esm";
import { Placeholder } from "../components/Placeholder";
import { months } from "../util";
import { Link } from "react-router-dom";
import { startOfDay } from "date-fns";

function last<A>(arr: A[]): A {
  return arr[arr.length - 1];
}

const monthAndDay = (date: Date) =>
  `${months[date.getMonth()]} ${date.getDate()}`;

const YearHeader = styled(H2)`
  margin-bottom: ${unit(1)};
`;

interface DaysWithMissing {
  date: Date;
  day: Day | null;
}

const fillInMissingDays = (days: Day[]): DaysWithMissing[] =>
  days.reduce<DaysWithMissing[]>((daysWithMissing, day) => {
    if (daysWithMissing.length === 0) {
      daysWithMissing.push({ date: day.date, day: day });
      return daysWithMissing;
    }

    const numberOfMissingDays =
      differenceInCalendarDays(last(daysWithMissing).date, day.date) - 1;

    const missingDays = Array.from(Array(numberOfMissingDays), (_, i) => {
      const date = addDays(day.date, i + 1);
      return { date: date, day: null };
    });

    return [
      ...daysWithMissing,
      ...missingDays.reverse(),
      { date: day.date, day: day }
    ];
  }, []);

const groupByYear = (
  days: DaysWithMissing[]
): { [year: string]: DaysWithMissing[] } =>
  days.reduce(
    (acc, day) => {
      const yearString = "" + day.date.getFullYear();
      if (acc[yearString]) {
        acc[yearString].push(day);
      } else {
        acc[yearString] = [day];
      }

      return acc;
    },
    {} as { [year: string]: DaysWithMissing[] }
  );

function DatePlaceholder({ date }: { date: Date }) {
  const encodedDate = encodeURIComponent(date.toISOString());
  return (
    <Link to={`/new?date=${encodedDate}`}>
      <Placeholder title={monthAndDay(date)} />
    </Link>
  );
}

interface DayProps {
  dayRepo: DayRepo;
}

export function Home({ dayRepo }: DayProps) {
  const [days, setDays] = useState([] as Day[]);
  useEffect(() => {
    dayRepo
      .lastWeek()
      .then(setDays)
      .catch(console.error);
  }, []);

  const daysWithMissing = useMemo(
    () =>
      days.length > 0
        ? fillInMissingDays(days)
        : [{ day: null, date: startOfDay(new Date()) }],
    [days]
  );

  const daysByYear: [string, DaysWithMissing[]][] = useMemo(
    () =>
      Object.entries(groupByYear(daysWithMissing)).sort(([a], [b]) => +b - +a),
    [daysWithMissing]
  );

  return (
    <>
      {daysByYear.map(([year, days]) => (
        <Fragment key={`year${year}`}>
          <YearHeader>{year}</YearHeader>
          {days.map(({ day, date }) =>
            day !== null ? (
              <DaySummary day={day} key={date.toString()} />
            ) : (
              <DatePlaceholder key={date.toString()} date={date} />
            )
          )}
        </Fragment>
      ))}
    </>
  );
}
