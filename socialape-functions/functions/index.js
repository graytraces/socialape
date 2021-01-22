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
  getUserDetail,
  markNotificationRead,
} = require("./handlers/users");

const FBAuth = require("./util/fbAuth");

const { db } = require("./util/admin");


const cors = require("cors");
app.use(cors());

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
app.get("/user/:handle", getUserDetail);
app.post("/notifications", FBAuth, markNotificationRead);

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
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
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
      .catch((err) => {
        console.error(err);
      });
  });

exports.createNotificationOnUnLike = functions
  .region("asia-northeast3")
  .firestore.document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        db.doc(`/notifications/${snapshot.id}`).delete();
      })
      .catch((err) => {
        console.error(err);
      });
  });

exports.createNotificationOnComment = functions
  .region("asia-northeast3")
  .firestore.document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
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
      .catch((err) => {
        console.error(err);
      });
  });

exports.onUserImageChange = functions
  .region("asia-northeast3")
  .firestore.document("users/{userId}")
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());

    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("image has changed");
      let batch = db.batch();
      return db
        .collection("screams")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const scream = db.doc(`/screams/${doc.id}`);
            batch.update(scream, { userImage: change.after.data().imageUrl });
          });
          return batch.commit();
        });
    }
  });

exports.onScreamDelete = functions
  .region("asia-northeast3")
  .firestore.document("screams/{screamId}")
  .onDelete((snapshot, context) => {
    //context = url에 의한 정보값
    const screamId = context.params.screamId;
    
    const batch = db.batch();
    return db
      .collection("comments")
      .where("screamId", "==", screamId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("screamId", "==", screamId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("screamId", "==", screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
