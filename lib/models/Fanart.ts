import mongoose, { Types } from "mongoose";

const fanartSchema = new mongoose.Schema({

    title: {
        type: "string",
        required: [true, 'You must give your fanart a title!']
    },

    description: {
        type: String,
        required: false
    },

    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },

    image: {
        src: {
            type: String,
            required: true
        }
    }


}, {
    timestamps: true
})

const Fanart = mongoose.models.Fanart || mongoose.model('Fanart', fanartSchema);
export default Fanart;