export let getFileName = (path) => path.split("\\").pop();

export let previousPath = (path) => {
  let previousPath = path.split("\\");
  previousPath.pop();
  console.log(previousPath.pop());
  console.log(previousPath.join("\\") + "\\");
  return previousPath.join("\\") + "\\";
};
