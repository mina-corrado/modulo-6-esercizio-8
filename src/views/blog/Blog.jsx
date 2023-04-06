import React, { useEffect, useState } from "react";
import { Container, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
// import posts from "../../data/posts.json";
import "./styles.css";
const Blog = props => {
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  
  useEffect(() => {
    const { id } = params;
    // const blog = posts.find(post => post._id.toString() === id);
    const headers = {
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        },
    }

    fetch(`http://localhost:3000/blogPosts/${id}`, headers).then(res=>res.json())
    .then(res=>{
      // reset
      if (res) {
        setBlog(res);
        setLoading(false);
      } else {
        navigate("/404");
      }
    }, (err)=>{
        //gestione errore
        console.log(err);
    })
  }, []);

  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <div className="blog-details-root">
        <Container>
          <Image className="blog-details-cover" src={blog.cover} fluid />
          <h1 className="blog-details-title">{blog.title}</h1>

          <div className="blog-details-container">
            <div className="blog-details-author">
              <BlogAuthor {...blog.author} />
            </div>
            <div className="blog-details-info">
              <div>{blog.createdAt}</div>
              <div>{`lettura da ${blog.readTime.value} ${blog.readTime.unit}`}</div>
              <div
                style={{
                  marginTop: 20,
                }}
              >
                <BlogLike defaultLikes={["123"]} onChange={console.log} />
              </div>
            </div>
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: blog.content,
            }}
          ></div>
        </Container>
      </div>
    );
  }
};

export default Blog;
