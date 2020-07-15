import React, { useState } from "react";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Input from "@material-ui/core/Input";
import Button from "@material-ui/core/Button";
import { useSnackbar } from "notistack";

import axios from "axios";

export default function Upload({ activePath, apiAdrs, load }) {
    const [file, setFile] = useState("");
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    let onChange = (e) => {
        setFile(e.target.files[0]);
    };
    let upload = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("destination", activePath);
        axios
            .post(`${apiAdrs}/upload`, formData, { headers: { "Content-Type": "multipart/form-data" } })
            .then((res) => {
                if (res.status == 200) {
                    load();
                    enqueueSnackbar("File Successfully Uploaded", {
                        variant: "success",
                    });
                } else {
                    enqueueSnackbar("Error Uploading File", {
                        variant: "error",
                    });
                }
            })
            .catch((err) =>
                enqueueSnackbar("Error Uploading File", {
                    variant: "error",
                })
            );
    };
    return (
        <div className={"upload"}>
            <form enctype="multipart/form-data" onSubmit={upload}>
                <Input type="file" onChange={onChange} />
                <Button type="submit" color="default" startIcon={<CloudUploadIcon />} size="small">
                    Upload
                </Button>
            </form>
        </div>
    );
}
