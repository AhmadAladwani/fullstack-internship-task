import { useEffect, useState } from "react"
import type { AddOrEditButtonProps } from "./AddOrEditButton"
import type { User } from "../App"
import LoadingSpinner from "./LoadingSpinner"

interface ModalContentProps extends AddOrEditButtonProps {
    onClose: () => void,
}

export default function UserForm({ _id, setUsers, setError, onClose }: ModalContentProps) {
    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [hobbies, setHobbies] = useState('')
    const [loading, setLoading] = useState(_id ? true : false)

    useEffect(() => {
        if (_id) {
            async function getSingleUser() {
                const response = await fetch(`/api/users/${_id}`)
                const data: { user: User } = await response.json()
                const { user } = data
                const { name, phoneNumber, email, hobbies } = user
                setName(name)
                setPhoneNumber(phoneNumber)
                setEmail(email)
                setHobbies(hobbies)
                setLoading(false)
            }
            getSingleUser()
        }
    }, [])

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        try {
            const url = _id ? `/api/users/${_id}` : '/api/users'
            const submittedData = { name, phoneNumber, email, hobbies }
            const response = await fetch(url, {
                method: _id ? 'PATCH' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...submittedData })
            })
            if (!response.ok) {
                const data: { message: string } = await response.json()
                const { message } = data
                throw message
            }
            const data: { user: User } = await response.json()
            const { user } = data
            if (_id) {
                setUsers(prevUsers => prevUsers.map((user) => {
                    if (user._id === _id) {
                        return { _id, name, phoneNumber, email, hobbies }
                    } else {
                        return user
                    }
                }))
            } else {
                setUsers(prev => [...prev, user])
            }
            onClose()
        } catch (error) {
            setError(error as string)
        }
    }

    async function deleteUser() {
        try {
            const response = await fetch(`/api/users/${_id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' } })
            if (!response.ok) {
                throw response.statusText
            }
            setUsers(prevUsers => prevUsers.filter(user => user._id !== _id))
            onClose()
        } catch (error) {
            setError(error as string)
        }
    }

    if (loading) {
        return (
            <div className="modal">
                <LoadingSpinner />
            </div>
        )
    }

    return (
        <div className="modal">
            <button className="close-modal-button" onClick={() => onClose()}>Close Modal</button>
            <form onSubmit={(event) => handleSubmit(event)}>
                <label htmlFor="name">{_id ? "Update" : "Add"} name:</label>
                <input id="name" name="name" type="text" placeholder="Name" required={true} value={name} onChange={(e) => setName(e.target.value)} />
                <label htmlFor="phone">{_id ? "Update" : "Add"} phone number:</label>
                <input id="phone" name="phone" type="tel" placeholder="Phone number" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required={true} value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                <small>Format: 123-456-7890</small>
                <label htmlFor="email">{_id ? "Update" : "Add"} email:</label>
                <input id="email" name="email" type="text" placeholder="Email" required={true} value={email} onChange={(e) => setEmail(e.target.value)} />
                <label htmlFor="hobbies">{_id ? "Update" : "Add"} hobbies:</label>
                <textarea id="hobbies" name="hobbies" placeholder="Hobbies" required={true} value={hobbies} onChange={(e) => setHobbies(e.target.value)} />
                <button className="save-button" type="submit">Save</button>
            </form>
            {_id && <button className="delete-button" onClick={() => deleteUser()}>Delete User</button>}
        </div>
    )
}