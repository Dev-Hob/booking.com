import express from "express"
import { createRoom, deleteRoom, getAllRoom, getRoom, updateRoom, updateRoomAvailability } from "../controllers/rooms.js";
import { verifyAdmin } from "../utils/verifyToken.js";
const router = express.Router();

//create
router.post("/:hotelid", verifyAdmin, createRoom)

//update
router.put("/:id", verifyAdmin, updateRoom)
router.put("/availability/:id", updateRoomAvailability)

//delete
router.delete("/:roomid/:hotelid", verifyAdmin, deleteRoom)

//get
router.get("/:id", getRoom)

//get all
router.get("/", getAllRoom)

export default router;