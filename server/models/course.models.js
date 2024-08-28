import {model,Schema} from 'mongoose';

const courseSchema = new Schema({
    title: {
        type: String,
        required: [true, "title is required"],
        minLength: [8, "title must be atleast 8 characters"],
        maxLength: [59, "title should be less than 60 character"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "description is required"],
        minLength: [8, "description must be atleast 8 characters"],
        maxLength: [200, "description should be less than 200 character"],
    },
    category: {
        type: String,
        required: [true, "category is required"],
    },
    thumbnail:{
        public_id: {
            type: String,
            required: true
        },
        secure_url: {
            type: String,
            required: true
        }
    },
    lectures:[
        {
            title:String,
            description: String,
            lectured: {
                public_id: {
                    type: String,
                    required: true
                },
                secure_url: {
                    type: String,
                    required: true
                }
            }
        }
    ],
    numbersOfLectures: {
        type: Number,
        default: 0,
    },
    createdBy: {
        type:String,
        required: true
    }
},{
    timestamps:true
})

const Coures = model('Coure',courseSchema);

export default Coures;