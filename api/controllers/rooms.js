import Rooms from "../models/Rooms.js";
import Hotels from "../models/Hotels.js";
import { createError } from "../utils/error.js";

export const createRoom = async (req, res, next) => {
    
    const hotelId = req.params.hotelid;
    const newRoom = new Rooms(req.body)

    try{
        const savedRoom = await newRoom.save()
        try {
            await Hotels.findByIdAndUpdate(hotelId, {$push:{ rooms: savedRoom._id}})
        } catch (error) {
            next(err)
        }

        res.status(200).json(savedRoom)

    }catch(err){
        next(err)
    }
}

//update
export const updateRoom = async (req, res) => {
    try{
        const updatedRoom = await Rooms.findByIdAndUpdate(
            req.params.id,
             { $set: req.body},
              {new: true})
        res.status(200).json(updatedRoom)
    }catch(err){
        res.status(500).json(err)
    }
}

//update
export const updateRoomAvailability = async (req, res) => {
    try{
        await Rooms.updateOne({"roomNumbers._id": req.params.id},
        {$push: {
            "roomNumbers.$.unavailableDates": req.body.dates
        }}
        )
        res.status(200).json("done")
    }catch(err){
        res.status(500).json(err)
    }
}

//delete
export const deleteRoom = async (req, res) => {
    try{
        const hotelId = req.params.hotelid
        try {
            await Hotels.findByIdAndUpdate(hotelId, {$pull:{ rooms: req.params.roomid}})
        } catch (error) {
            next(err)
        }
        await Rooms.findByIdAndDelete(req.params.roomid)
        res.status(200).json("Room has been deleted")
    }catch(err){
        res.status(500).json(err)
    }
}

//get Room
export const getRoom = async (req, res) => {
    try{
        const room = await Rooms.findById(req.params.id)
        res.status(200).json(room)
    }catch(err){
        res.status(500).json(err)
    }
}

//get All Room
export const getAllRoom = async (req, res, next) => {
    try{
        const rooms = await Rooms.find({})
        res.status(200).json(rooms)
    }catch(err){
        next(err)
    }
}