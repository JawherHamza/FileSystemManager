const fs = require("fs");

module.exports = {
    browse: (req, res) => {
        const { path } = req.body;
        console.log(path);
        fs.readdir(path, (err, files) => {
            if (err) {
                res.status(400).send(err);
            } else {
                var result = [];
                files.forEach((el) => {
                    let FilePath = path + el;
                    result.push({
                        isDirectory: fs.existsSync(FilePath) && fs.lstatSync(FilePath).isDirectory(),
                        path: FilePath,
                    });
                });
                res.send(result);
            }
        });
    },
    download: (req, res) => {
        res.download(req.headers.path, (err) => {
            if (err) res.status(400).send(err);
        });
    },
    remove: (req, res) => {
        fs.unlink(req.body.path, (err) => (err ? res.status(400).send(err) : res.end()));
    },
    upload: (req, res) => {
        if (req.files === null) {
            return res.status(400).json({ msg: "No file uploaded" });
        }
        const file = req.files.file;
        fs.writeFile(`${req.body.destination}/${file.name}`, file.data, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send(err);
            }
            res.status(200).send("The file was saved!");
        });
    },
};
