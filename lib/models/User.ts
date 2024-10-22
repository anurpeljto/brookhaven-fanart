import mongoose, {Document, models, Types} from 'mongoose';
import validator, * as Validators from 'validator';
import {SignJWT} from 'jose';
import bcrypt from 'bcryptjs';
import { unique } from 'next/dist/build/utils';


interface IUser extends Document {
    email: string,
    password: string,
    username: string,
    comparePW(inputPassword: string): Promise<boolean>,
    createToken(): string;
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        trim: true,
        maxLength: 20,
        unique: true
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        validate: {
            validator: (value: string) => Validators.isEmail(value),
            message: 'Invalid email format'
        },
        unique: true
    },

    password: {
        type: String,
        required: true,
        validate: {
            validator: (value: string) => Validators.isStrongPassword(value),
            message: 'Password is too weak'
        }
    },

    role: {
        type: String,
        enum: ['user', 'admin', 'mod'],
        required: false,
        default: 'user',
        trim: true
    }


}, {timestamps: true})  

userSchema.pre<IUser>('save', async function() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePW = async function(inputPassword: string) {
    const isCorrect = await bcrypt.compare(inputPassword, this.password);
    return isCorrect;
}

userSchema.methods.createJWT = async function() {
    const token = await new SignJWT({id: this._id, email: this.email, username: this.username})
        .setProtectedHeader({alg: 'HS256'})
        .setExpirationTime(process.env.JWT_LIFETIME || '24h')
        .sign(new TextEncoder().encode(process.env.JWT_SECRET || 'fallback1921'));
    return token;
}

const User = models.User || mongoose.model("User", userSchema);
export default User;