const router = require("express").Router();

router.get("/", (req,res)=>{
   res.send("reports working");
});

module.exports = router;  
