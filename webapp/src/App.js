import React, { useEffect, useState } from "react";
import { apiAdrs, source } from "./config";
import axios from "axios";
import FolderIcon from "@material-ui/icons/Folder";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import KeyboardBackspaceIcon from "@material-ui/icons/KeyboardBackspace";
import { Button, Input } from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Delete from "./Components/Delete";
import Upload from "./Components/Upload";
import { useSnackbar } from "notistack";
import { getFileName, previousPath } from "./helpers";
import "./App.css";

export default function App() {
  const [activePath, setActivePath] = useState(source);
  const [content, setOriginalContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  console.log(process.env.REACT_APP_API_ADRS);
  useEffect(() => {
    load();
  }, [activePath]);

  let load = () => {
    axios
      .post(apiAdrs + "/browse", { path: activePath })
      .then((res) => {
        setOriginalContent(res.data);
        setFilteredContent(res.data);
      })
      .catch(() => {
        enqueueSnackbar("Error Fetching Data", {
          variant: "error",
        });
      });
  };

  let search = (word) => content.filter((el) => el.path.toLowerCase().includes(word.toLowerCase()));

  let download = (path) => {
    axios({
      url: `${apiAdrs}/download`,
      method: "GET",
      responseType: "blob",
      headers: { path: path },
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", getFileName(path));
      document.body.appendChild(link);
      link.click();
    });
  };

  let remove = (path) => {
    axios
      .post(`${apiAdrs}/remove`, { path })
      .then((response) => {
        console.log(response);
        if (response.status == 200) {
          enqueueSnackbar("File Removed Successfully", {
            variant: "success",
          });
          load();
        }
      })
      .catch((err) =>
        enqueueSnackbar("Error Deleting File", {
          variant: "error",
        })
      );
  };

  return (
    <div>
      <Grid item>
        <Typography variant="h6" className="header">
          <Button onClick={() => setActivePath(previousPath(activePath))}>
            <KeyboardBackspaceIcon />
          </Button>
          {activePath}
          <Input onChange={(e) => setFilteredContent(search(e.target.value))} placeholder="Search ..."></Input>
          <Upload activePath={activePath} apiAdrs={apiAdrs} load={load} />
        </Typography>
        {content.length != 0 && (
          <List>
            {filteredContent.map((el) => {
              return (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar className={el.isDirectory ? "folder" : "file"}>
                      {el.isDirectory ? <FolderIcon /> : <FileCopyIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={getFileName(el.path)}
                    onClick={el.isDirectory ? () => setActivePath(el.path + "\\") : () => {}}
                    className="pointer"
                  />
                  <ListItemSecondaryAction>
                    {!el.isDirectory && (
                      <>
                        <IconButton edge="end" aria-label="delete">
                          <Delete el={el} apiAdrs={apiAdrs} remove={remove} fileName={getFileName(el.path)} />
                        </IconButton>
                        &nbsp;
                        <IconButton edge="end" aria-label="delete">
                          <SaveIcon onClick={() => download(el.path)} />
                        </IconButton>
                      </>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        )}
      </Grid>
    </div>
  );
}
