import express from 'express'

const app = express();


app.get("/home", (req,res) => {
    res.send("Der er hul gennem serveren");
})





const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log("Server is running on ", PORT);
})