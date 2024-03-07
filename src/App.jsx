import Container from "@mui/material/Container";
import { Route, Routes } from "react-router-dom";

import { Header } from "./components";
import {
  Home,
  FullPost,
  Registration,
  AddPost,
  Login,
  NotFound,
} from "./pages";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { userGetData } from "./redux/slices/auth";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userGetData());
  }, [dispatch]);

  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/posts/:id/edit" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
