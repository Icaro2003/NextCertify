import { useState } from "react";

export default function useAlert() {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");
    const [variant, setVarient] = useState("");
    const [key, setKey] = useState("");

    function handleAlert(msg, type = "danger") {
        setMessage(msg);
        setVarient(type);
        setKey(type);
        setShow(true);
    }

    const alertProps = {
        show,
        setShow,
        message,
        variant,
        key,
        handleAlert
    };


    return alertProps;
}