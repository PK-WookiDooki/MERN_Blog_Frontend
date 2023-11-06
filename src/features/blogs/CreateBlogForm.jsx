import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateBlogMutation } from "./blogApi";
import { useNavigate } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import { useGetAllCategoriesQuery } from "../categories/categoriesApi";
import { Loader, SubmitBtn, ErrorMsg } from "@/components";
import {setAlertMessage} from "@/core/globalSlice.js";

const CreateBlogForm = () => {
    const [canSave, setCanSave] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const [createBlog] = useCreateBlogMutation();
    const nav = useNavigate();
    const [selectedOpt, setSelectedOpt] = useState("");

    const { data, isLoading, isFetching } = useGetAllCategoriesQuery();
    const categories = data?.data;

    const dispatch = useDispatch()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const formData = watch();

    const onSubmit = async (data) => {
        const blogData = { ...data, userId: user?._id };
        try {
            setIsSubmitting(true);
            const { data } = await createBlog(blogData);
            if (data?.success) {
                setIsSubmitting(false);
                dispatch(setAlertMessage({type : "success", content : data?.message}))
                nav("/");
            } else {
                setIsSubmitting(false);
                dispatch(setAlertMessage({type : "error", content : data?.message}))
            }
        } catch (error) {
            throw new Error(error);
        }
    };

    useEffect(() => {
        if (formData.title && formData.description && formData.categoryId) {
            setCanSave(true);
            setSelectedOpt(formData.categoryId);
        } else {
            setCanSave(false);
        }
    }, [formData]);

    if (isLoading || isFetching) {
        return (
            <div className="w-full flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <section className=" w-full">
            <div className="common-card">
                <h2 className="form-tlt"> Create New Blog </h2>

                <form action="#" onSubmit={handleSubmit(onSubmit)}>
                    {/* title */}
                    <div className="mb-5">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            {...register("title", {
                                required: {
                                    value: true,
                                    message: "Blog title is required!",
                                },
                                //pattern: {
                                //    value: /^\b([A-Z])+[\w -!$_.]*/,
                                //    message:
                                //        "First letter of the title must be capital !",
                                //},
                                minLength: {
                                    value: 5,
                                    message:
                                        "Blog title must have at least 5 characters!",
                                },
                            })}
                            id="title"
                            className={`form-input ${
                                errors.title?.message ? "input-error" : ""
                            }`}
                        />
                        <ErrorMsg message={errors.title?.message} />
                    </div>

                    {/* category */}
                    <div className="mb-5">
                        <label htmlFor="categoryId">Category</label>
                        <select
                            defaultValue={selectedOpt}
                            {...register("categoryId", {
                                required: {
                                    value: true,
                                    message: "Blog's categoryId is required!",
                                },
                            })}
                            id="categoryId"
                            className={`form-input ${
                                errors.categoryId?.message ? "input-error" : ""
                            }`}
                        >
                            <option disabled={true} value={""}>
                                {" "}
                                Select Blog Category{" "}
                            </option>
                            {categories?.map((item) => {
                                return (
                                    <option key={item._id} value={item._id}>
                                        {item.title}
                                    </option>
                                );
                            })}
                        </select>
                        <ErrorMsg message={errors.categoryId?.message} />
                    </div>

                    {/* content/description */}
                    <div className="mb-5">
                        <label htmlFor="description">Content</label>
                        <textarea
                            rows={7}
                            {...register("description", {
                                required: {
                                    value: true,
                                    message: "Blog content is required!",
                                },
                                //pattern: {
                                //    value: /^\b([A-Z])+[\w -!$_.]*/,
                                //    message:
                                //        "First letter of the content must be capital !",
                                //},
                                minLength: {
                                    value: 20,
                                    message:
                                        "Blog content must have at least 20 characters!",
                                },
                            })}
                            id="description"
                            className={`form-input resize-none ${
                                errors.description?.message ? "input-error" : ""
                            }`}
                        ></textarea>
                        <ErrorMsg message={errors.description?.message} />
                    </div>
                    <SubmitBtn
                        isSubmitting={isSubmitting}
                        label={"Publish"}
                        canSave={canSave}
                        isDisabled={true}
                    />
                </form>
            </div>
        </section>
    );
};

export default CreateBlogForm;
