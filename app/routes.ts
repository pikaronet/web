import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("discography", "./routes/discography.tsx"),
] satisfies RouteConfig;
