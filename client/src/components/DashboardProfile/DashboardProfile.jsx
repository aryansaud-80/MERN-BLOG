import { useState, useEffect, useRef } from "react";
import "./DashboardProfile.scss";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../../app/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { app } from "../../assets/firebase.config";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Flip, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashboardProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);

  const inputFileRef = useRef(null);

  const [formData, setFormData] = useState({});

  const notify = (message, type) => {
    toast(message, {
      type: type,
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Flip,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) throw new Error("No file selected");

    setImageFile(file);
    setImageFileUrl(URL.createObjectURL(file));
  };

  const handleImageLoad = () => {
    inputFileRef.current.click();
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(formData).length === 0) {
      dispatch(updateFailure("No changes"));
      notify("No changed", "error");
      return;
    }
    if (imageUploading) {
      dispatch(updateFailure("Image is uploading"));
      notify("Image is uploading", "error");
      return;
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`api/auth/update/${currentUser.data._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        notify(`${data.message}`, "error");
      } else {
        dispatch(updateSuccess(data));
        notify("User profile updated successfully", "success");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      notify(error.message, "error");
    }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageUploading(true);
    setImageUploadError(null);
    const storage = getStorage(app);
    const fileName = `${formData.username}_${imageFile.name}${Date.now().toLocaleString()}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageUploadError(error.message);
        setImageUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, avatar: downloadURL });
          setImageUploading(false);
        });
      }
    );
  };

  return (
    <div className="user--profile">
      <h1>Profile</h1>

      {activeTab === "profile" && (
        <form className="updateForm" onSubmit={handleSubmit}>
          <div className="user-profile__avatar" onClick={handleImageLoad}>
            <img src={imageFileUrl || currentUser.data.avatar} alt="profile" />

            {imageUploading && (
              <CircularProgressbar
                value={imageUploadProgress || 0}
                text={`${imageUploadProgress}%`}
                strokeWidth={5}
                styles={{
                  root: {
                    width: "13rem",
                    height: "13rem",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    transform: "translate(-0.5rem, -0.5rem)",
                  },
                  path: {
                    stroke: `rgba(62, 152, 199, ${imageUploadProgress / 100})`,
                  },
                }}
              />
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={inputFileRef}
            style={{ display: "none" }}
          />

          <input
            type="text"
            name="username"
            defaultValue={currentUser.data.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <input
            type="email"
            name="email"
            defaultValue={currentUser.data.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            defaultValue={""}
            onChange={handleChange}
            placeholder="Password"
          />

          <button type="submit" disabled={imageUploading}>
            Update
          </button>
        </form>
      )}

      <ToastContainer
        style={{
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "black",
        }}
      />

      {imageUploadError && ""}
    </div>
  );
};

export default DashboardProfile;
