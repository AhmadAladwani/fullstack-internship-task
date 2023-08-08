import express from "express"
import { createUser, deleteUser, getSingleUser, getUsers, updateUser } from "../controllers/userController"
const router = express.Router()

router.route('/users').get(getUsers).post(createUser)
router.route('/users/:id').get(getSingleUser).patch(updateUser).delete(deleteUser)

export default router