import { useEffect, useState } from "react";
import { useGetBlogByIdQuery, useUpdateBlogMutation } from "./blogApi";
import {useNavigate, useParams} from "react-router-dom";
import {Loader, SubmitBtn, FormLabel, CancelBtn} from "@/components";
import {useDispatch} from "react-redux";
import {setAlertMessage} from "@/core/globalSlice.js";
import {Form, Input, Upload} from "antd";
import {MdOutlineFileUpload} from "react-icons/md";

const EditBlogForm = () => {
    const { blogId } = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data, isLoading, isFetching } = useGetBlogByIdQuery(blogId);
    const currentBlog = data?.data;

    // console.log(currentBlog)

    const [updateBlog] = useUpdateBlogMutation();
    const nav = useNavigate();
    const dispatch = useDispatch()
    const [form] = Form.useForm()

    const onSubmit = async (data) => {
        const blogImage = data?.image?.file || null;
        delete data.image;
        const updatedBlogData = {
            ...data,
            id: currentBlog?._id,
            blogImage,
        };

        let formData = new FormData();
        formData.append("blogImage", blogImage);
        formData.append("blogData", JSON.stringify(updatedBlogData));

        try {
            setIsSubmitting(true);
            const { data } = await updateBlog(formData);
            if (data?.success) {
                setIsSubmitting(false);
                nav("/");
                dispatch(setAlertMessage({type : "success", content : data?.message}))
            } else {
                setIsSubmitting(false);
                dispatch(setAlertMessage({type : "error", content : data?.message}))
            }
        } catch (error) {
            throw new Error(error);
        }finally {
            setIsSubmitting(false);
        }
    };

    const supportedFileType = [".jpg", ".jpeg", ".png", ".webp"];
    const uploadProps = {
        beforeUpload: () => false,
        accept : [...supportedFileType],
        maxCount : 1,
        defaultFileList:  currentBlog?.blogImage ? [{uid : currentBlog?.blogImage, name : currentBlog?.blogImage, status : "done", url : currentBlog?.blogImage}] : [],
    }

    const imageValidator = (rule, value) => {
        const file = value?.file;
        const maxSize = 5 * 1024 * 1024;
        if(file?.size > maxSize){
            return Promise.reject("File size must be less than 5MB");
        }else{
            return Promise.resolve();
        }
    }

    useEffect(() => {
        if (!isLoading) {
            form.setFieldsValue({...currentBlog});
        }
    }, [currentBlog]);

    if (isLoading || isFetching) {
        return (
            <div className="w-full flex items-center justify-center ">
                <Loader />
            </div>
        );
    }

    return (
        <section className=" w-full">
            <div className="common-card">
                <h2 className="form-tlt mb-8"> Edit Blog </h2>

                <Form form={form} layout={"vertical"} onFinish={onSubmit} >
                    <Form.Item label={<FormLabel label={"title"} />} name={"title"} rules={[
                        {required : true, message : "Blog title is required!"}
                    ]}>
                        <Input/>
                    </Form.Item>
                    <Form.Item label={<FormLabel label={"Photo/Image"} isOptional={true}/>} name={"image"} rules={[ {validator : imageValidator} ]} >
                        <Upload {...uploadProps} className={`!w-full bg-darkTer `} >
                            <button type={"button"} className={`flex items-center gap-1 h-10 px-4 rounded-md border border-gray-300 hover:border-blue-500 bg-white w-full duration-200`} > <MdOutlineFileUpload className={`text-xl text-gray-600`} />Click to Upload</button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label={<FormLabel label={"content"} />} name={"description"} rules={[
                        {required : true, message : "Blog content is required!"}
                    ]} >
                        <Input.TextArea bordered={true} className={" !min-h-[200px] "} />
                    </Form.Item>
                    <div className={`pt-6 flex items-center gap-4`}>
                        <CancelBtn path={".."}/>
                        <SubmitBtn label={"save"} isSubmitting={isSubmitting} />
                    </div>
                </Form>
            </div>
        </section>
    );
};

export default EditBlogForm;
