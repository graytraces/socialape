const functions = require("firebase-functions");
const app = require("express")();

const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream,
} = require("./handlers/scream");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
} = require("./handlers/users");

const FBAuth = require("./util/fbAuth");

const { db } = require("./util/admin");

//scream routes
app.get("/screams", getAllScreams);
app.post("/scream", FBAuth, postOneScream); //여러개 체이닝으로 가능하지만 지금은 하나만 쓸거야
app.get("/scream/:screamId", getScream);
// TODO : delete scream
app.delete("/scream/:screamId", FBAuth, deleteScream);
// TODO : like a scream
app.get("/scream/:screamId/like", FBAuth, likeScream);
// TODO : unlike a scream
app.get("/scream/:screamId/unlike", FBAuth, unlikeScream);
// TODO : comment on scream
app.post("/scream/:screamId/comment", FBAuth, commentOnScream);

//users routes
app.post("/signup", signup);
app.post("/login", login);
app.post("/user/image", FBAuth, uploadImage);
app.post("/user", FBAuth, addUserDetails);
app.get("/user", FBAuth, getAuthenticatedUser);

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

exports.api = functions.region("asia-northeast3").https.onRequest(app);

exports.createNotificationOnLike = functions
  .region("asia-northeast3")
  .firestore.document("likes/{id}")
  .onCreate((snapshot) => {
    db.doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            read: "false",
            screamId: doc.id,
            type: "like",
            createdAt: new Date().toISOString(),
          });
        }
      })
      .then(() => {
        return; //DB Trigger. Not need to send result
      })
      .catch((err) => {
        console.error(err);
        return; //DB Trigger. Not need to send result
      });
  });

exports.createNotificationOnUnLike = functions
  .region("asia-northeast3")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    db.doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        db.doc(`/notifications/${snapshot.id}`).delete();
      })
      .then(() => {
        return; //DB Trigger. Not need to send result
      })
      .catch((err) => {
        console.error(err);
        return; //DB Trigger. Not need to send result
      });
  });

exports.createNotificationOnComment = functions
  .region("asia-northeast3")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    db.doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (doc.exists) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            read: "false",
            screamId: doc.id,
            type: "comment",
            createdAt: new Date().toISOString(),
          });
        }
      })
      .then(() => {
        return; //DB Trigger. Not need to send result
      })
      .catch((err) => {
        console.error(err);
        return; //DB Trigger. Not need to send result
      });
  });
