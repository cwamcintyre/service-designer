import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
    route("/", "routes/home.tsx"),
    route("/form", "routes/form/list.tsx"),
    route("/form/edit/:formId", "routes/form/edit.tsx"),
    route("/form/editPage/:formId/:pageId", "routes/form/editPage.tsx"),
] satisfies RouteConfig;
