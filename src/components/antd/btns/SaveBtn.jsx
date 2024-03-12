import {useState} from "react";
import {BsBookmarkCheckFill, BsBookmarkPlus} from "react-icons/bs";
import {useDispatch} from "react-redux";
import {useGetUserDataQuery, useSaveBlogsMutation,} from "@/features/users/UserApi";
import {useNavigate} from "react-router-dom";
import {setAlertMessage} from "@/core/globalSlice.js";
import {useAuth} from "@/hooks/useAuth.js";
import {LoginAlertModal} from "@/components/index.js";

const SaveBtn = ({blogId}) => {

    const [openModal, setOpenModal] = useState(false);

    const {token} = useAuth();
    const {data: currentUser} = useGetUserDataQuery()
    const savedBlogsList = currentUser?.savedBlogs;
    const isAlreadySaved = savedBlogsList?.includes(blogId);
    const [isSaved, setIsSaved] = useState(isAlreadySaved);

    const [saveBlogs] = useSaveBlogsMutation();
    const nav = useNavigate();

    const dispatch = useDispatch()

    const handleSaveBlog = async () => {
        if (token) {
            try {
                setIsSaved(!isSaved);
                const {data, error} = await saveBlogs(blogId);
                if (data) {
                    dispatch(setAlertMessage({type: "success", content: data?.message}));
                } else {
                    dispatch(setAlertMessage({type: "error", content: data?.message}));
                }

            } catch (error) {
                throw new Error(error);
            }
        } else {
            setOpenModal(true)
        }
    };

    return (
        <section>
            <button
                onClick={handleSaveBlog}
                className={`outline-none border-none text-blue-600 dark:text-darkTer text-xl duration-200`}
            >
                {isSaved && token ? (
                    <BsBookmarkCheckFill/>
                ) : isSaved && !token ? (
                    <BsBookmarkPlus/>
                ) : (
                    <BsBookmarkPlus/>
                )}
            </button>

            {/* for un-auth user*/}
            <LoginAlertModal closeModal={() => setOpenModal(!openModal)} isOpen={openModal}
                             content={"You need to login to save this blog!"}/>
        </section>
    );
};

export default SaveBtn;
