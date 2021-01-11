const functions = require("firebase-functions");
const admin = require("firebase-admin");
const app = require("express")();
admin.initializeApp();

const firebaseConfig = {
  apiKey: "AIzaSyA6uIG09EuhnJOU3plux37UtsNoJAw0l5o",
  authDomain: "socialape-3cf82.firebaseapp.com",
  projectId: "socialape-3cf82",
  storageBucket: "socialape-3cf82.appspot.com",
  messagingSenderId: "1068544942083",
  appId: "1:1068544942083:web:be7a25ba0c9fb18d5fee36",
  measurementId: "G-VBTEWLBTHB",
};

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

app.get("/screams", (req, res) => {
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
    .catch((err) => console.error(err));
});

//리퀘스트를 가로채고, 요청이 뭔가를 가지고 있는지, 
//muiltiple router에 
/*so we would actually, we could write the code right here.
but since we need this functionality for multiple route
then we need to make this into a function and then run a chain at before any request.
so let's actually write this ?? a function. And the way express works is that we can pass second argument
to this post or any actually any route and this argument would be a function that those something 
that intercept the request and then 
the something depending what they request has
and then decides whether to proceed to our handler or to stop there and send reponse.
AKA middleware
*/


//여러개 체이닝으로 가능하지만 지금은 하나만 쓸거야
const FBAuth = (req, res, next) => {

    let idToken;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        idToken = req.headers.authorization.split('Bearer ')[1];
    }else{
        console.error('No token found.')
        return res.status(403).json( {error : 'Unauthorized'} );
    }

    admin.auth().verifyIdToken(idToken)
        .then( decodedToken => {
            req.user = decodedToken;
            console.log(decodedToken)
            return db.collection('users')
                .where('userId', '==', req.user.uid)
                .limit(1)
                .get();
        })
        .then (data => {
            req.user.handle = data.docs[0].data().handle;
            return next();  //allow request to proceed
        })
        .catch( err => {
            console.error('Error wile verifying token ', err);
            return res.status(403).json({err});
        });
}

app.post("/scream", FBAuth, (req, res) => {
  if (isEmpty(req.body.body)) {
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
});

const isEmail = (email) => {
  const regEx = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) {
    return true;
  } else {
    return false;
  }
};

const isEmpty = (string) => {
  if (string.trim() === "") {
    return true;
  } else {
    return false;
  }
};

//Sigmup route
app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  let errors = {};

  if (isEmpty(newUser.email)) {
    errors.email = "Email must not be empty.";
  } else if (!isEmail(newUser.email)) {
    errors.email = "Must be a valid email address.";
  }

  if (isEmpty(newUser.password)) {
    errors.password = "Must not be empty.";
  }
  if (newUser.password !== newUser.confirmPassword) {
    errors.confirmPassword = "Password must match";
  }

  if (isEmpty(newUser.handle)) {
    errors.handle = "Must not be empty.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  let token, userId;

  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res.status(400).json({ handle: "this handle is already taken" });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;

      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      };

      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already in use" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

app.post("/login", (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  let errors = {};

  if (isEmpty(user.email)) {
    errors.email = "Must not be empty";
  }

  if (isEmpty(user.password)) {
    errors.password = "Must not be empty";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);

      if (err.code === "auth/wrong-password") {
        return res
          .status(403)
          .json({ general: "Wrong credentials, pleas try again" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

exports.api = functions.region("asia-northeast3").https.onRequest(app);
