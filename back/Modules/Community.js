const mongoose = require('mongoose')
const joi = require('joi')

const communitySchema = new mongoose.Schema({
    Picture: {
        type : Object, 
        default:{
            url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            publicId : null
        }
    },
    Name: {
        type: String,
        required : true,
    },
    description : {
        type: String,
        default : "Group Description"
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    isPrivate: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    Category : {
        type : String,
        required : true
    },
    Cover: {
        type : Object, 
        default:{
            url: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.flaticon.com%2Ffree-icon%2Fgroup_268547&psig=AOvVaw3YybDBffOVibIf3Jw_Kxlw&ust=1750944947868000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCIDM9Z3YjI4DFQAAAAAdAAAAABAd",
            publicId : null
        }
    },
}, {
    timestamps: true
})

const Community = mongoose.model('Community', communitySchema)

const ValidateCommunity = (obj) => {
    const schema = joi.object({
        Name: joi.string().required(),
        description: joi.string(),
        isPrivate: joi.boolean(),
        Category : joi.string().required()
    })
    return schema.validate(obj, {
        abortEarly: false
    })
}

const ValidateCommunityUpdate = (obj) => {
    const schema = joi.object({
        Name: joi.string(),
        description: joi.string(),
        isPrivate: joi.boolean(),
    })
    return schema.validate(obj, {
        abortEarly: false
    })
}

module.exports = {Community , ValidateCommunity , ValidateCommunityUpdate}