import React from "react";
import { Button, Container, Form} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import "./styles.css";

const Login = props => {
    const navigate = useNavigate();

    const onSubmit = (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        // console.log(form);
        if (form.checkValidity() === false) {
            return;
        }

        const data = {
            username: form.querySelector('#login-form-username').value,
            password: form.querySelector('#login-form-password').value
        };
        const headers = {
            headers: {
            "Content-Type": "application/json"
            },
            method: 'POST',
            body: JSON.stringify(data)
        }
        fetch('http://localhost:3000/login', headers).then(res=>res.json())
        .then(res=>{
            // reset
            form.querySelector('#login-form-username').value = '';
            form.querySelector('#login-form-password').value = '';

            console.log("success login")
            localStorage.setItem('token', res.token);
            navigate("/");
        }, (err)=>{
            //gestione errore
            console.log(err);
        })
    };

    return (
        <Container className="login-container">
            <Form className="mt-5" onSubmit={onSubmit}>
                <Form.Group controlId="login-form-username" className="mt-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control size="lg" placeholder="Username" />
                </Form.Group>
                <Form.Group controlId="login-form-password" className="mt-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control size="lg" placeholder="Password" type="password" />
                </Form.Group>
                <Form.Group className="d-flex mt-3 justify-content-end">
                    <Button
                    type="submit"
                    size="lg"
                    variant="dark"
                    style={{
                        marginLeft: "1em",
                    }}
                    >
                    Login
                    </Button>
                </Form.Group>
            </Form>
            <hr />
            <Button as={Link} to="http://localhost:3000/oauth/google"
                    size="lg"
                    variant="dark"
                    style={{
                        marginLeft: "1em",
                    }}
                    >
                    Login with Google
                    </Button>
        </Container>
    )
}
export default Login; 