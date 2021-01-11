const functions = require("firebase-functions");
const app = require("express")();

const {getAllScreams, postOneScream} = require('./handlers/scream')
const {signup, login, uploadImage} = require ('./handlers/users')

const FBAuth = require('./util/fbAuth');

//scream routes
app.get("/screams", getAllScreams);
app.post("/scream", FBAuth, postOneScream);//여러개 체이닝으로 가능하지만 지금은 하나만 쓸거야

//users routes
app.post("/signup", signup);
app.post("/login", login);

app.post('/user/image', FBAuth, uploadImage);



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
