const passport = require("passport");
const LocalStrategy = require("passport-local");
const knex = require("./knex");

module.exports = function (app) {
  console.log("passport.jsの中");
  // 1.ユーザー情報を取得
  passport.use(
    new LocalStrategy(
      {
        usernameField: "user_name",
        passwordField: "password",
      },
      // function (user_name, password, done) {
      function (userName, password, done) {
        console.log("user", userName, password); //tatsu ユーザー入力の値
        console.log("LocalStrategy", LocalStrategy);
        knex("customer")
          .where({
            user_name: userName,
            password: password,
          })
          .select("*")
          .then(async function (results) {
            console.log("result", results); //[ { id: 2, user_name: 'tatsu', password: 'temporary_Password' } ]
            if (results.length === 0) {
              return done(null, false, { message: "Invalid User" });
              // } else if (await bcrypt.compare(password, results[0].password)) {
            } else {
              //   return done(null, results[0]);
              return done(null, results[0]);
            }
            // } else {
            //   return done(null, false, {message: "Invalid User"});
            // }
          })
          .catch(function (err) {
            console.error(err);
            return done(null, false, { message: err.toString() });
          });
      }
    )
  );

  //2.ユーザー情報を格納
  passport.serializeUser(function (user, done) {
    console.log("serialの中");
    console.log("serialの中user", user); //{ id: 2, user_name: 'tatsu', password: 'temporary_Password' }
    done(null, user.id);
  });

  //3.ユーザー情報を取得
  passport.deserializeUser(async function (id, done) {
    console.log("deserialの中");
    console.log("deserialの中のid", id); //2
    done(null, id);
    // await User.findById(id, function (err, user) {
    //   done(err, user);
    // });

    const user = await where({ id: id });
    console.log("user", user); //{ id: 2, user_name: 'tatsu', password: 'temporary_Password' }
    if (user === null) {
      throw new Error("User not found");
    }
    return { ...user };
    // const user = await where({ id: id });
    // if (user === null) {
    //   throw new Error("User not found");
    // }
    // return { ...user };

    async function where(condition) {
      console.log("condition", condition); //{ id: 2 }
      return await knex("customer")
        .where(condition)
        .then((results) => {
          console.log("deserialのresult", results); //[ { id: 2, user_name: 'tatsu', password: 'temporary_Password' } ]
          if (results.length === 0) {
            return null;
          }
          return results[0];
        });
    }
  });

  app.use(passport.session());
};
