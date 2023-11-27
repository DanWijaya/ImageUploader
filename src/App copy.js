import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { withAuthenticator } from "@aws-amplify/ui-react";

import "@aws-amplify/ui-react/styles.css";
import { removeTypeDescriptors } from "./tools/removeFileTypeDescriptor";
import { Auth } from "aws-amplify";

async function uploadImage(data) {
  const { image, description, isPublic } = data;

  const formData = new FormData();

  formData.append("image", image, description);

  try {
    const response = await axios.post(`/imagesWithDesc/?description=${description}&${isPublic}`, formData);

    return response.data;
  } catch (err) {
    console.error(err);
  }
}

function App() {
  const [file, setFile] = useState();
  const [images, setImages] = useState([]);
  const [allDescription, setAllDescriptionImages] = useState([]);
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  React.useEffect(() => {
    const getImages = async () => {
      const response = await axios.get("/getimages/all");

      let descriptionList = [];
      let imagesList = [];

      if (Array.isArray(response.data)) {
        response.data.forEach((item) => {
          let imageItem = removeTypeDescriptors(item);
          descriptionList.push(imageItem.Description);
          imagesList.push(imageItem.fileKey);
        });
      }

      setAllDescriptionImages(descriptionList);
      setImages(imagesList);
    };

    getImages();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    const result = await uploadImage({ image: file, description: description, isPublic });
    if (!result) {
      setImages([result.imagePath, ...images]);
    }
    setAllDescriptionImages([result.description, ...allDescription]);
    setDescription("");
    setIsPublic(false);
    setFile(null);
  };

  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      File Uploader prototype app
      <br />
      <br />
      <form
        onSubmit={submit}
        style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}
      >
        <input onChange={fileSelected} type="file" accept="image/*"></input>
        <label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} type="text"></input>
          Description
        </label>
        <label>
          <input type="checkbox" checked={isPublic} onChange={() => setIsPublic(!isPublic)} />
          Make Image Public?
        </label>
        <button type="submit">Submit</button>
      </form>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {images.map((image, idx) => (
          <div key={image}>
            <img src={`/images/${image}`} style={{ maxWidth: "1000px", maxHeight: "1000px" }}></img>
            <p style={{ textAlign: "center" }}>{allDescription[idx]}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuthenticator(App);
