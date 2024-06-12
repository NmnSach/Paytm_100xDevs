import React from 'react'
import { Heading } from '../components/Heading'
import { SubHeading } from '../components/SubHeading'
import { InputBox } from '../components/InputBox'
import { Button } from '../components/Button'
import { BottomWarning } from '../components/BottomWarning'
import { useNavigate } from "react-router-dom";


const Signin = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-slate-300 h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
                    <Heading label={"Sign In"} />
                    <SubHeading label={"Enter your credentials to access your account"} />
                    <InputBox label={"Email"} placeholder={"namansachdeva@gmail.com"} />
                    <InputBox label={"Password"} placeholder={""} />
                    <div className="pt-4">
                        <Button onClick={() => {
                            navigate('/dashboard')
                        }} label={"Sign In"} />
                    </div>

                    <BottomWarning label={"Don't have an account?"} buttonText={"Sign Up"} to={"/signup"} />

                </div>
            </div>
        </div>

    )
}

export default Signin
