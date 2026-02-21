import { useState } from "react";
import api from "../services/api.js";

export default function MentorDashboard(){
    const [form,setForm]=useState({
        title:"",
        description:"",
        duration:"",
        level:"Beginner",
        techStack:"",
        includes:"",
        price:"",
    });

    const [loading,setLoading]=useState(false);
    const [message,setMessage]=useState("");

    const handleChangge=(e)=>{
        setForm({
            ...form,
            [e.target.name]:e.target.value,
        });
    };

    const handleSubmit = async (e)=>{
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try{
            await api.post("/courses",{
                ...form,
                techStack:form.techStack.split(",").map((t)=>t.trim()),
                includes:form.includes.split(",").map((i)=>i.trim()),
                price:Number(form.price),
            });
            setMessage("Course created successfully!");
            setForm({
                title:"",
                description:"",
                duration:"",
                level:"Beginner",
                techStack:"",
                includes:"",
                price:"",
            });
        }catch(error){
            setMessage("Error creating course");
        }
        setLoading(false);
    };

    return (
        <section>
            <h1>
                Create New Course
            </h1>
        </section>
    )

}