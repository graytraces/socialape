const { db } = require('../util/admin')

exports.getAllScreams = (req, res) => {
    db.collection("screams")
      .orderBy("createdAt", "desc")
      .get()
      .then((data) => {
        let screams = [];
        data.forEach((doc) => {
          screams.push({
            screamId: doc.id,
            ...doc.data(), //동영상에서는 노드 6라서 안됐는데, 지금 firebase는 되는듯?
          });
        });
  
        return res.json(screams);
      })
      .catch((err) => {
          console.error(err)
          res.status(500).json({error: err.code});
      } );
  };

  exports.postOneScream = (req, res) => {
    if (req.body.body.trim() === '') {
      return res.status(400).json({ body: "Must not be empty" });
    }
  
    const newScream = {
      body: req.body.body,
      userHandle: req.user.handle,
      createdAt: new Date().toISOString(),
    };
  
    db.collection("screams")
      .add(newScream)
      .then((doc) => {
        res.json({ message: `document ${doc.id} created successfully` });
      })
      .catch((err) => {
        res.status(500).json({ error: "somthing went wrong" });
        console.error(err);
      });
  }
