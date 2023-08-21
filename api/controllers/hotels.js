import Hotel from "../models/Hotels.js";
import Room from "../models/Rooms.js";

//create
export const createHotel = async (req, res) => {
    
    const newHotel = new Hotel(req.body)

    try{
        const savedHotel = await newHotel.save()
        res.status(200).json(savedHotel)
    }catch(err){
        res.status(500).json(err)
    }
}

//update
export const updateHotel = async (req, res) => {
    try{
        const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, { $set: req.body}, {new: true})
        res.status(200).json(updatedHotel)
    }catch(err){
        res.status(500).json(err)
    }
}

//delete
export const deleteHotel = async (req, res) => {
    try{
        await Hotel.findByIdAndDelete(req.params.id)
        res.status(200).json("Hotel has been deleted")
    }catch(err){
        res.status(500).json(err)
    }
}

//get Hotel
export const getHotel = async (req, res) => {
    try{
        const hotel = await Hotel.findById(req.params.id)
        res.status(200).json(hotel)
    }catch(err){
        res.status(500).json(err)
    }
}

//get All Hotel
export const getAllHotel = async (req, res, next) => {
    const {min, max, ...others} = req.query;
    try{
        const hotels = await Hotel.find({...others, cheapestPrice: { $gt: min | 1, $lt: max || 99999}}).limit(req.query.limit)
        res.status(200).json(hotels)
    }catch(err){
        next(err)
    }
}


export const countByCity = async (req, res, next) => {
    const cities = req.query.cities.split(",");
    try{
        const list = await Promise.all(cities.map( city => {
            return Hotel.countDocuments({city: city})
        }) )
        res.status(200).json(list)
    }catch(err){
        next(err)
    }
}

export const countByType = async (req, res, next) => {
    const hotelCount = await Hotel.countDocuments({type:"hotel"})
    const apartmentCount = await Hotel.countDocuments({type:"apartment"})
    const resortCount = await Hotel.countDocuments({type:"resort"})
    const villaCount = await Hotel.countDocuments({type:"villa"})
    const cabinCount = await Hotel.countDocuments({type:"cabin"})

    try{
        res.status(200).json([
            {type: "hotel", count: hotelCount},
            {type: "apartment", count: apartmentCount},
            {type: "resort", count: resortCount},
            {type: "villa", count: villaCount},
            {type: "cabin", count: cabinCount}
        ]);
    }catch(err){
        next(err)
    }
}

export const getHotelRooms = async (req, res, next) => {
    try{
        const hotel = await Hotel.findById(req.params.id)
        const list = await Promise.all(hotel.rooms.map( room => {
            return Room.findById(room)
        }))
        res.json(list)
    }catch(err){
        next(err)
    }
}