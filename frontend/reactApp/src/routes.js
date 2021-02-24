/*!

=========================================================
* Light Bootstrap Dashboard React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import RouteRecommender from "views/RouteRecommender/RouteRecommneder";
import Dashboard from "views/Dashboard/Dashboard";
import AnalyticsCard from "views/Analytics/AnalyticsCard";

const dashboardRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "nc-icon nc-pin-3",
    component: RouteRecommender,
    layout: "/admin",
  },
  {
    path: "/analytics",
    name: "Analytics",
    icon: "nc-icon nc-paper-2",
    component: AnalyticsCard,
    layout: "/admin",
  },
];

export default dashboardRoutes;
