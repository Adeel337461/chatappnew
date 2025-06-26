import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import generatedAccessToken from "../utils/generatedAccessToken.js";
import getUserDetailsFromToken from "../utils/getUserDetailsFromToken.js";

export async function RegisterUser(request, response) {
  try {
    let { name, email, password, profile_pic } = request.body;
    if (!name || !email || !password) {
      return response.status(400).json({
        message: "provide email, name, password",
        error: true,
        success: false,
      });
    }

    name = name.trim();
    email = email.trim();
    password = password.trim();

    const user = await UserModel.findOne({ email });

    if (user) {
      return response.json({
        message: "Already register email",
        error: true,
        success: false,
      });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);
    const payload = {
      name,
      email,
      password: hashPassword,
      profile_pic: profile_pic,
    };
    const newUser = new UserModel(payload);
    const save = await newUser.save();
    return response.json({
      message: "User register successfully",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function LoginUser(req, res) {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "provide email, password",
        error: true,
        success: false,
      });
    }

    email = email.trim();
    password = password.trim();

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not register",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Check your password",
        error: true,
        success: false,
      });
    }

    const accesstoken = await generatedAccessToken(user._id);

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("token", accesstoken, cookiesOption);

    return res.json({
      message: "Login successfully",
      error: false,
      success: true,
      token: accesstoken,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function UserDetails(req, res) {
  try {
    const token = req.cookies.token || "";

    const user = await getUserDetailsFromToken(token);

    return res.status(200).json({
      message: "user details",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

export async function TokenAuth(req, res) {
  try {
    const token = req.cookies.token || "";

    if (!token) {
      return res.status(200).json({
        message: "Session expired",
        logout: true,
        success: true,
        error: false,
      });
    }

    const decode = await jwt.verify(token, process.env.JWT_SECREAT_KEY);

    if (!decode) {
      return response.status(401).json({
        message: "unauthorized access",
        logout: true,
        success: true,
        error: false,
      });
    }

    return res.status(200).json({
      message: "Token Success",
      error: false,
      success: true,
      logout: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function UserProfile(req, res) {
  let { name, email, password, profile_pic } = req.body;

  try {
    if (!name || !email) {
      return res.status(400).json({
        message: "provide email, name",
        error: true,
        success: false,
      });
    }

    name = name.trim();
    email = email.trim();
    password = password.trim();

    const token = req.cookies.token || "";

    if (!token) {
      return res.status(200).json({
        message: "Session expired",
        success: false,
        error: true,
      });
    }

    const decode = await jwt.verify(token, process.env.JWT_SECREAT_KEY);

    if (!decode) {
      return res.status(401).json({
        message: "unauthorized access",
        success: false,
        error: true,
      });
    }

    const existingUser = await UserModel.findOne({
      email: email,
      _id: { $ne: decode.id },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Another User with this Email already exists.",
        error: true,
        success: false,
      });
    }

    const user = await UserModel.findOne({ email });

    const updateObj = {
      email,
      name,
    };

    if (password) {
      const salt = await bcryptjs.genSalt(10);
      const hashPassword = await bcryptjs.hash(password, salt);
      updateObj.password = hashPassword;
    }

    if (profile_pic) {
      updateObj.profile_pic = profile_pic;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      decode.id,
      updateObj,
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Updated successfully",
      error: false,
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export async function UserList(req, res) {
  try {
    const token = req.cookies.token || "";

    if (!token) {
      return res.status(200).json({
        message: "Session expired",
        logout: true,
        success: true,
        error: false,
      });
    }

    const decode = await jwt.verify(token, process.env.JWT_SECREAT_KEY);

    if (!decode) {
      return response.status(401).json({
        message: "unauthorized access",
        logout: true,
        success: true,
        error: false,
      });
    }

    const data = await UserModel.find({}, { name: 1, email: 1, profile_pic: 1 });
    return res.status(200).json({
      message: "Token Success",
      error: false,
      success: true,
      data: data,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}
