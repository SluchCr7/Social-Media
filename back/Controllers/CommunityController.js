const { Community, ValidateCommunity, ValidateCommunityUpdate } = require('../Modules/Community')
const asyncHandler = require('express-async-handler')

const getAllCommunities = asyncHandler(async (req, res) => {
    const communities = await Community.find({})
    res.status(200).json(communities)
})

const getCommunityByCategory = asyncHandler(async (req, res) => {
    const communities = await Community.find({ category: req.params.category })
    res.status(200).json(communities)
})

const addNewCommunity = asyncHandler(async (req, res) => {
    const { error } = ValidateCommunity(req.body)
    if (error) {
        res.status(400).json({message : error.details[0].message})
    }
    const community = new Community({
        Name: req.body.Name,
        Category: req.body.Category,
        description: req.body.description,
        owner: req.user._id,
    })
    await community.save()
    res.status(201).json(community)
})

const deleteCommunity = asyncHandler(async (req, res) => {
    const community = await Community.findById(req.params.id)
    if (!community) {
        res.status(404)
        throw new Error('Community not found')
    }
    await community.remove()
    res.status(200).json({ message: 'Community removed' })
})

const joinTheCommunity = asyncHandler(async (req, res) => {
    let community = await Community.findById(req.params.id)
    if (!community) {
        res.status(404)
        throw new Error('Community not found')
    }
    if(community.members.includes(req.user._id)){
        community = await Community.findByIdAndUpdate(req.params.id, {
            $pull: { members: req.user._id },
        }, { new: true }) 
        res.status(200).json({message : "Community Left"})
    }else{
        community = await Community.findByIdAndUpdate(req.params.id, {
            $push: { members: req.user._id },
        }, { new: true }) 
        res.status(200).json({message : "Community Joined"})
    }
})

module.exports = {
    getAllCommunities,
    getCommunityByCategory,
    addNewCommunity,
    deleteCommunity,
    joinTheCommunity
}