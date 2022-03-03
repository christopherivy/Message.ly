const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const jwt = require("jsonwebtoken");
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require("../config");
const User = require("../models/user")

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.get('/', (req, res, next) => {
    res.send("APP IS WORKING!!!")
})

router.get("/login", async(req, res, next) => {
    try {
        // this is the username and password provided by the user
        let { username, password } = req.body
        if (await User.authenticate(username, password)) {
            let token = jwt.sign({ username }, SECRET_KEY)
            User.updateLoginTimestamp(username)
            return res.json({ token })
        } else {
            // throw error code for wrong login credentials
            throw new ExpressError("Invalid username/password", 400)
        }
    } catch (e) {
        return next(e)
    }
})


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post("/register", async(req, res, next) => {
    try {
        // let a user create a username
        let { username } = await User.register(req.body)
        let token = jwt.sign({ username }, SECRET_KEY)
        User.updateLoginTimestamp(username)
        return res.json({ token })
    } catch (e) {
        return next(e)
    }
})


module.exports = router