import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { useSelector } from "react-redux";
import { isAuthorized } from "../../redux/slices/auth";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import api from "../../axios";

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [fields, setFields] = useState({
    tags: "",
    title: "",
    imageUrl: "",
  });

  const inputFileRef = useRef(null);
  const isAuth = useSelector(isAuthorized);
  const isEditing = Boolean(id);

  useEffect(() => {
    if (id) {
      api
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setFields({
            title: data.title,
            tags: data.tags.join(","),
            imageUrl: data.imageUrl,
          });
          setText(data.text);
        })
        .catch((err) => {
          console.warn(err);
          alert(err.message);
        });
    }
  }, [id]);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await api.post("/upload", formData);
      setFields((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      console.warn(err);
      alert(err.message);
    }
  };

  const onClickRemoveImage = () => {
    setFields((prev) => ({ ...prev, imageUrl: "" }));
  };

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      const params = { ...fields, text };

      const { data } = isEditing
        ? await api.patch(`/posts/${id}`, params)
        : await api.post("/posts/create", params);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      alert(err.message);
    }
  };

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {fields.imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            width={400}
            height={400}
            className={styles.image}
            src={`${fields.imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={fields?.title}
        onChange={(e) =>
          setFields((prev) => ({ ...prev, title: e.target.value }))
        }
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={fields.tags}
        onChange={(e) =>
          setFields((prev) => ({ ...prev, tags: e.target.value }))
        }
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? "Сохранить" : "Опубликовать"}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
