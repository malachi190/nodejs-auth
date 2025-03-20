const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

// Register
const registerUser = async (req, res) => {
  try {
    // get auth details from the request body
    const { username, email, password, role } = req.body;

    // check if user already exists
    const checkIfUserExists = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (checkIfUserExists) {
      res.status(400).json({
        success: false,
        message: "User already exists, Please login instead.",
      });
    }

    // Hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPasword = await bcrypt.hash(password, salt);

    // create new user and store in the db
    const newUser = new User({
      userName: username,
      email,
      password: hashedPasword,
      role: role || "user",
    });

    await newUser.save();

    if (newUser) {
      res.status(201).json({
        success: true,
        message: "User registered successfully.",
        data: newUser
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Unable to register user, please try again",
      });
    }
  } catch (error) {
    console.log("An error occured ==>", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    // get request items from the request body
    const {username, password} = req.body;
    
    // check if user doesnt exist
    const user = await User.findOne({userName: username});
    if(!user){
        return res.status(400).json({
            success: false,
            message: "User doesn't exist"
        })
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, user.password)

    if(!passwordMatch){
        return res.status(400).json({
            success: false,
            message: "Invalid credentials."
        })
    } 

    // Create web token
    const token = jwt.sign({
        userId: user._id,
        username: user.userName,
        role: user.role
    }, process.env.JWT_SECRET_KEY, {
        expiresIn: "30m"
    })

    res.status(200).json({
        success: true,
        message: "Login successful",
        token: token,     
    })

  } catch (error) {
    console.log("An error occured ==>", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    console.log("body ==>", req.body);
    
    // get user id
    const userId = req.userInfo.userId

    // get old and new password from the request
    const {old_password, new_password} = req.body

    // find the current logged in user
    const user = await User.findById(userId)

    if(!user){
     return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    // check if passwords match
    const passwordMatch = await bcrypt.compare(old_password, user.password)

    if(!passwordMatch){
      return res.status(400).json({
        success: false,
        message: "Old password does not match with current password."
      })
    }

    // hash the new password
    const salt = await bcrypt.genSalt(10)
    const newlyHashedPasword = await bcrypt.hash(new_password, salt)

    // update the current password
    user.password = newlyHashedPasword
    await user.save()

    res.status(200).json({
      success: true,
      message: "User password changed successfully."
    })
  } catch (error) {
    console.log("An error occured ==>", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
}

module.exports = { registerUser, loginUser, changePassword };
