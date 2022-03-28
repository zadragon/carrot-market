import {useState} from "react";
import {FieldErrors, useForm} from "react-hook-form";

interface LoginForm {
    username: string;
    password: string;
    email: string;
}

export default function Forms() {
    const {register, handleSubmit} = useForm<LoginForm>();
    const onValid = (data:LoginForm) => {

        console.log('inm here')
    }
    const onInvalid = (errors: FieldErrors) => {
        console.log(errors)
    }
    return (
        <form onSubmit={handleSubmit(onValid, onInvalid)}>
            <input
                {...register("usename", {
                    required: "Username is required",
                    minLength: {
                        message:"the username should be longer than 5 chars",
                        value:5
                    }
                })}
                type="text"
                placeholder="Username"
                required
            />
            <input
                {...register("email", {
                    required: true
                })}
                type="email"
                placeholder="Email"
                required
            />

            <input
                {...register("password", {
                    required: true
                })}
                type="password"
                placeholder="Password"
                required
            />
            <input type="submit" value="Create Account"/>
        </form>
    );
}
