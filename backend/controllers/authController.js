import User from "../model/userModel.js";
import bcrypt from "bcrypt";


export const checkUserName = async (req, res) => {
    const { userName } = req.body;
    try {
        const checkUserName = await user.findOne({ userName });
        if (checkUserName) {
            return res.status(400).json({ message: "Username already exists!" });
        }
    } catch (error) {
        console.log(error);
        res.json({ message: "Something went wrong!", error });
    }
}

export const Register = async (req, res) => {
    const { firstName, lastName, userName, email, password } = req.body;

    try {

        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists!" });
        }
        const hashPassowrd = bcrypt.hashSync(password, 12);
        const user = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password: hashPassowrd
        });

        res.status(201).json({ message: "User created successfully!", user });

    } catch (error) {
        console.log(error);
        res.json({ message: "Something went wrong!", error });
    }
}

export const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const cehckUser = await User.findOne({ email });
        const checkUserName = await User.findOne({ userName });
        if (!cehckUser || checkUserName) {
            return res.status(400).json({ message: "Username or Email Id Not Found" });
        }
        const checkPassword = bcrypt.compare(password, cehckUser.password);
        if (!checkPassword) {
            return res.status(400).json({ message: "Invalid credentials!" });
        }
    } catch (error) {
        console.log(error);
        res.json({ message: "Something went wrong!", error });
    }
}