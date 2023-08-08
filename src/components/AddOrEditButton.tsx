import { useState } from "react"
import { createPortal } from "react-dom"
import type { User } from "../App"
import UserForm from "./UserForm"

export type AddOrEditButtonProps = {
    _id?: string,
    setUsers: React.Dispatch<React.SetStateAction<User[]>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
}

export default function AddOrEditButton({ _id, setUsers, setError }: AddOrEditButtonProps) {
    const [showModal, setShowModal] = useState(false)
    return (
        <>
            <button className={_id ? "edit-button" : "add-button"} onClick={() => setShowModal(true)}>{_id ? "Edit User" : "Add New User"}</button>
            {showModal && createPortal(
                <>
                    <div className="overlay"></div>
                    <UserForm _id={_id} setUsers={setUsers} setError={setError} onClose={() => setShowModal(false)} />
                </>,
                document.body
            )}
        </>
    )
}