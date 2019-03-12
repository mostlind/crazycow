import React, { useMemo } from "react";
import {
  BrowserRouter,
  Route,
  Redirect,
  Switch,
  RouteComponentProps
} from "react-router-dom";
import { DayRepo } from "./repositories/Days";
import styled from "styled-components";
import { unit, navHeight } from "./styles";
import { Nav } from "./components/Nav";
import { NavItemProps, NavItem } from "./components/NavItem";
import { MetricsIcon } from "./components/MetricsIcon";
import { NewMealIcon } from "./components/NewMealIcon";
import { HomeIcon } from "./components/HomeIcon";
import { Home } from "./pages/Home";
import ReactDOM from "react-dom";
import { Api } from "./api/Api";
import { DayDetail } from "./components/DayDetail";
import { CreateMeal } from "./pages/CreateMeal";
import { MealRepo } from "./repositories/Meals";
import { Location } from "history";
import { Metrics } from "./pages/Metrics";

const Main = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1 0;
  padding: ${unit(2)};
  padding-bottom: ${navHeight};
`;

const navItems: NavItemProps[] = [
  {
    icon: <HomeIcon />,
    route: "/home"
  },
  {
    icon: <MetricsIcon />,
    route: "/metrics"
  },
  {
    icon: <NewMealIcon />,
    route: "/new"
  }
];

interface AppProps {
  api: Api;
}

function App({ api }: AppProps) {
  const dayRepo = useMemo(() => DayRepo.init(api), []);
  const mealRepo = useMemo(() => MealRepo.init(api), []);

  return (
    <BrowserRouter>
      <Main>
        <Content>
          <Switch>
            <Redirect from="/" exact to="/home" />
            <Route path="/home" component={() => <Home dayRepo={dayRepo} />} />
            <Route path="/metrics" component={() => <Metrics />} />
            <Route
              path="/day/:id"
              component={({ match }: RouteComponentProps<{ id: string }>) => (
                <DayDetail dayRepo={dayRepo} id={+match.params.id} />
              )}
            />
            <Route
              path="/new"
              component={({
                history,
                location
              }: {
                history: History;
                location: Location;
              }) => (
                <CreateMeal
                  mealRepo={mealRepo}
                  dayRepo={dayRepo}
                  history={history}
                  location={location}
                />
              )}
            />
          </Switch>
        </Content>
        <Nav>
          {navItems.map(({ icon, route }) => (
            <NavItem key={route} icon={icon} route={route} />
          ))}
        </Nav>
      </Main>
    </BrowserRouter>
  );
}

export function renderApp(api: Api) {
  return ReactDOM.render(<App api={api} />, document.getElementById("app"));
}
