import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./auth/authApi";
import { blogApi } from "./blogs/blogApi";
import { userApi } from "./users/UserApi";
import { categoriesApi } from "./categories/categoriesApi";
import { commentsApi } from "./comments/commentsApi";
import authSlice from "./auth/authSlice";
import categoriesSlice from "./categories/categoriesSlice";
import blogSlice from "./blogs/blogSlice";
import globalSlice from "@/core/globalSlice";
import {baseApi} from "@/core/baseApi.js";

export const store = configureStore({
    reducer: {
        global : globalSlice,
        [baseApi.reducerPath] : baseApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [blogApi.reducerPath]: blogApi.reducer,
        [userApi.reducerPath]: userApi.reducer,
        [categoriesApi.reducerPath]: categoriesApi.reducer,
        [commentsApi.reducerPath]: commentsApi.reducer,
        auth: authSlice,
        category: categoriesSlice,
        blog: blogSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            baseApi.middleware,
            authApi.middleware,
            blogApi.middleware,
            userApi.middleware,
            categoriesApi.middleware,
            commentsApi.middleware
        ),
});
